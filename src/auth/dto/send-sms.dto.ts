import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { SmsPurpose } from '../sms-purpose.enum';

export class SendSmsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位大陆手机号' })
  phone: string;

  @IsEnum(SmsPurpose)
  purpose: SmsPurpose;
}
