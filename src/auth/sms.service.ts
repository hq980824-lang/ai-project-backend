import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { Repository } from 'typeorm';
import Dysmsapi20170525, { SendSmsRequest } from '@alicloud/dysmsapi20170525';
import { $OpenApiUtil } from '@alicloud/openapi-core';
import { UsersService } from '../users/users.service';
import { SmsVerificationEntity } from './entities/sms-verification.entity';
import { SmsPurpose } from './sms-purpose.enum';

const SEND_COOLDOWN_MS = 60_000;
const CODE_TTL_MS = 5 * 60_000;
const CODE_SALT_ROUNDS = 6;

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly lastSent = new Map<string, number>();

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    @InjectRepository(SmsVerificationEntity)
    private readonly smsRepo: Repository<SmsVerificationEntity>,
  ) {}

  async requestCode(phone: string, purpose: SmsPurpose): Promise<void> {
    const key = `${phone}:${purpose}`;
    const prev = this.lastSent.get(key);
    if (prev !== undefined && Date.now() - prev < SEND_COOLDOWN_MS) {
      throw new BadRequestException('发送过于频繁，请稍后再试');
    }

    if (purpose === SmsPurpose.Register) {
      const exists = await this.usersService.findByPhone(phone);
      if (exists) {
        throw new BadRequestException('该手机号已注册');
      }
    } else {
      const exists = await this.usersService.findByPhone(phone);
      if (!exists) {
        throw new BadRequestException('该手机号未注册');
      }
    }

    await this.smsRepo.delete({ phone, purpose });

    const code = String(randomInt(100_000, 1_000_000));
    const codeHash = await bcrypt.hash(code, CODE_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + CODE_TTL_MS);

    await this.smsRepo.save(
      this.smsRepo.create({
        phone,
        purpose,
        codeHash,
        expiresAt,
      }),
    );

    await this.dispatchAliyun(phone, code);
    this.lastSent.set(key, Date.now());
  }

  async verifyAndConsumeCode(
    phone: string,
    purpose: SmsPurpose,
    code: string,
  ): Promise<void> {
    const row = await this.smsRepo.findOne({
      where: { phone, purpose },
      order: { id: 'DESC' },
    });
    if (!row || row.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('验证码无效或已过期');
    }
    const ok = await bcrypt.compare(code, row.codeHash);
    if (!ok) {
      throw new BadRequestException('验证码错误');
    }
    await this.smsRepo.delete({ id: row.id });
  }

  private async dispatchAliyun(phone: string, code: string): Promise<void> {
    const mock =
      this.config.get<string>('SMS_MOCK') === 'true' ||
      !this.config.get<string>('ALIYUN_ACCESS_KEY_ID')?.trim();
    if (mock) {
      this.logger.warn(`[SMS 模拟] -> ${phone} 验证码: ${code}`);
      return;
    }

    const accessKeyId = this.config.getOrThrow<string>('ALIYUN_ACCESS_KEY_ID');
    const accessKeySecret = this.config.getOrThrow<string>(
      'ALIYUN_ACCESS_KEY_SECRET',
    );
    const signName = this.config.getOrThrow<string>('ALIYUN_SMS_SIGN_NAME');
    const templateCode = this.config.getOrThrow<string>(
      'ALIYUN_SMS_TEMPLATE_CODE',
    );
    const paramKey = this.config.get<string>('ALIYUN_SMS_CODE_PARAM', 'code');

    const cfg = new $OpenApiUtil.Config({
      accessKeyId,
      accessKeySecret,
      regionId: this.config.get<string>('ALIYUN_REGION_ID', 'cn-hangzhou'),
    });
    cfg.endpoint = 'dysmsapi.aliyuncs.com';

    const client = new Dysmsapi20170525(cfg);
    const req = new SendSmsRequest({
      phoneNumbers: phone,
      signName,
      templateCode,
      templateParam: JSON.stringify({ [paramKey]: code }),
    });

    const res = await client.sendSms(req);
    const body = res.body;
    if (body?.code !== 'OK') {
      this.logger.error(
        `阿里云短信失败: ${body?.code} ${body?.message ?? ''}`,
      );
      throw new ServiceUnavailableException(
        body?.message ?? '短信发送失败，请稍后重试',
      );
    }
  }
}
