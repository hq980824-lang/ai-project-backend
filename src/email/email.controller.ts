import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get()
  @ResponseMessage('验证码发送成功')
  async send(@Query('to') to: string) {
    await this.emailService.sendCode(to, '123456');
  }
}
