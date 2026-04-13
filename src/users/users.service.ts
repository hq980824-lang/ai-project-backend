import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private createToken(user: UserEntity) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
  }

  private registerOtpKey(email: string) {
    return `users:otp:register:${email}`;
  }

  private loginOtpKey(email: string) {
    return `users:otp:login:${email}`;
  }

  async sendRegisterCode(email: string) {
    const code = this.generateCode();
    await this.redis.set(this.registerOtpKey(email), code, 'EX', 300);
    await this.emailService.sendCode(email, code);
  }

  async sendLoginCode(email: string) {
    const code = this.generateCode();
    await this.redis.set(this.loginOtpKey(email), code, 'EX', 300);
    await this.emailService.sendCode(email, code);
  }

  async register(email: string, code: string) {
    const correctCode = await this.redis.get(this.registerOtpKey(email));

    if (!correctCode || correctCode !== code) {
      throw new HttpException('验证码错误或已过期', HttpStatus.BAD_REQUEST);
    }

    const exists = await this.usersRepo.exists({ where: { email } });

    if (exists) {
      throw new HttpException('邮箱已注册', HttpStatus.BAD_REQUEST);
    }

    const user = this.usersRepo.create({ email });

    await this.usersRepo.save(user);

    await this.redis.del(this.registerOtpKey(email));

    return {
      user,
      token: `Bearer ${this.createToken(user)}`
    };
  }

  async login(email: string, code: string) {
    const correctCode = await this.redis.get(this.loginOtpKey(email));

    if (!correctCode || correctCode !== code) {
      throw new HttpException('验证码错误或已过期', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersRepo.findOne({ where: { email } });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    user.lastLoginAt = new Date();
    await this.usersRepo.save(user);

    await this.redis.del(this.loginOtpKey(email));

    return {
      user,
      token: `Bearer ${this.createToken(user)}`
    };
  }
}
