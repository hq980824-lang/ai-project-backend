import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendCode(to: string, code: string) {
    await this.transporter.sendMail({
      from: this.configService.get('EMAIL_USER'),
      to,
      subject: '邮箱验证码',
      html: `
         <div style="padding:16px;">
            <p>您好，您的验证码是：</p>
            <h2 style="color:#1677ff">${code}</h2>
            <p>5分钟内有效，请勿泄露给他人</p>
          </div>
        `,
    });
  }
}
