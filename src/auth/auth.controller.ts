import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { AuthService } from './auth.service';
import { LoginPasswordDto } from './dto/login-password.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { RegisterDto } from './dto/register.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { SmsService } from './sms.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
  ) {}

  @Post('sms/send')
  @ResponseMessage('验证码已发送')
  async sendSms(@Body() dto: SendSmsDto) {
    await this.smsService.requestCode(dto.phone, dto.purpose);
    return { sent: true };
  }

  @Post('register')
  @ResponseMessage('注册成功')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login/password')
  @ResponseMessage('登录成功')
  loginPassword(@Body() dto: LoginPasswordDto) {
    return this.authService.loginWithPassword(dto.phone, dto.password);
  }

  @Post('login/sms')
  @ResponseMessage('登录成功')
  loginSms(@Body() dto: LoginSmsDto) {
    return this.authService.loginWithSms(dto.phone, dto.code);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ResponseMessage('success')
  me(@Req() req: Request & { user: { id: number; username: string; phone: string; status: number } }) {
    return req.user;
  }
}
