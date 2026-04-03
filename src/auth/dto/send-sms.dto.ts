import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { SmsPurpose } from '../sms-purpose.enum';

export class SendSmsDto {
  @ApiProperty({ description: '11 位大陆手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位大陆手机号' })
  phone: string;

  @ApiProperty({ enum: SmsPurpose, example: SmsPurpose.Register })
  @IsEnum(SmsPurpose)
  purpose: SmsPurpose;
}
