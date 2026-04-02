import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/user-status.enum';
import { RegisterDto } from './dto/register.dto';
import { SmsPurpose } from './sms-purpose.enum';
import { SmsService } from './sms.service';

export interface AuthTokenPayload {
  accessToken: string;
  user: {
    id: number;
    username: string;
    phone: string;
    status: UserStatus;
  };
}

@Injectable()
export class AuthService {
  private readonly passwordRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokenPayload> {
    await this.smsService.verifyAndConsumeCode(
      dto.phone,
      SmsPurpose.Register,
      dto.code,
    );

    const passwordHash = await bcrypt.hash(dto.password, this.passwordRounds);
    const user = await this.usersService.createWithPasswordHash({
      username: dto.username,
      phone: dto.phone,
      passwordHash,
    });
    return this.buildTokenResponse(user);
  }

  async loginWithPassword(
    phone: string,
    password: string,
  ): Promise<AuthTokenPayload> {
    const user = await this.usersService.findByPhoneWithSecret(phone);
    if (!user?.passwordHash) {
      throw new UnauthorizedException('手机号或密码错误');
    }
    if (user.status !== UserStatus.Normal) {
      throw new ForbiddenException('账号已禁用');
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('手机号或密码错误');
    }
    return this.buildTokenResponse(user);
  }

  async loginWithSms(phone: string, code: string): Promise<AuthTokenPayload> {
    await this.smsService.verifyAndConsumeCode(
      phone,
      SmsPurpose.Login,
      code,
    );
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.status !== UserStatus.Normal) {
      throw new ForbiddenException('账号已禁用');
    }
    return this.buildTokenResponse(user);
  }

  private buildTokenResponse(user: {
    id: number;
    username: string;
    phone: string;
    status: UserStatus;
  }): AuthTokenPayload {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        status: user.status,
      },
    };
  }
}
