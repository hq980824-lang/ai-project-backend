import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginPasswordDto {
  @ApiProperty({ description: '11 位大陆手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位大陆手机号' })
  phone: string;

  @ApiProperty({ description: '密码', example: 'password12' })
  @IsString()
  @MinLength(1)
  password: string;
}
