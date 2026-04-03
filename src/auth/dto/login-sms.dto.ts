import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginSmsDto {
  @ApiProperty({ description: '11 位大陆手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位大陆手机号' })
  phone: string;

  @ApiProperty({ description: '短信验证码', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,8}$/, { message: '验证码格式不正确' })
  code: string;
}
