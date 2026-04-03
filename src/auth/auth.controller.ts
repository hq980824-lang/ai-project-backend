import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { AuthService } from './auth.service';
import { LoginPasswordDto } from './dto/login-password.dto';
import { LoginSmsDto } from './dto/login-sms.dto';
import { RegisterDto } from './dto/register.dto';
import { SendSmsDto } from './dto/send-sms.dto';
import { SmsService } from './sms.service';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
  ) {}

  @Post('sms/send')
  @ApiOperation({ summary: '发送短信验证码' })
  @ResponseMessage('验证码已发送')
  async sendSms(@Body() dto: SendSmsDto) {
    await this.smsService.requestCode(dto.phone, dto.purpose);
    return { sent: true };
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ResponseMessage('注册成功')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login/password')
  @ApiOperation({ summary: '手机号密码登录' })
  @ResponseMessage('登录成功')
  loginPassword(@Body() dto: LoginPasswordDto) {
    return this.authService.loginWithPassword(dto.phone, dto.password);
  }

  @Post('login/sms')
  @ApiOperation({ summary: '手机号短信验证码登录' })
  @ResponseMessage('登录成功')
  loginSms(@Body() dto: LoginSmsDto) {
    return this.authService.loginWithSms(dto.phone, dto.code);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: '当前登录用户信息' })
  @ResponseMessage('success')
  me(@Req() req: Request & { user: { id: number; username: string; phone: string; status: number } }) {
    return req.user;
  }
}
