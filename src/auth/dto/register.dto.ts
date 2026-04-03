import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: '用户名', minLength: 2, maxLength: 64, example: 'zhangsan' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 64)
  username: string;

  @ApiProperty({ description: '11 位大陆手机号', example: '13800138000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位大陆手机号' })
  phone: string;

  @ApiProperty({ description: '密码，至少 8 位', minLength: 8, example: 'password12' })
  @IsString()
  @MinLength(8, { message: '密码至少 8 位' })
  password: string;

  @ApiProperty({ description: '短信验证码，4–8 位数字', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,8}$/, { message: '验证码格式不正确' })
  code: string;
}
