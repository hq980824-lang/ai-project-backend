import {
  Body,
  Controller,
  Request,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';

@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register/send-code')
  @ResponseMessage('验证码发送成功')
  async sendRegisterCode(@Query('email') email: string) {
    await this.usersService.sendRegisterCode(email);
  }

  @Post('register')
  @ResponseMessage('注册成功')
  async register(@Body() dto: CreateUserDto) {
    return this.usersService.register(dto.email, dto.code);
  }

  @Post('login/send-code')
  @ResponseMessage('验证码发送成功')
  async sendLoginCode(@Query('email') email: string) {
    await this.usersService.sendLoginCode(email);
  }

  @Post('login')
  @ResponseMessage('登录成功')
  async login(@Body() dto: CreateUserDto) {
    return this.usersService.login(dto.email, dto.code);
  }

  @UseGuards(JwtGuard)
  @Post('profile')
  getProfile(
    @Request() req: Request & { user: { id: number; email: string } },
  ) {
    return req.user;
  }
}
