import { IsNotEmpty, IsString, Length, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 64)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位大陆手机号' })
  phone: string;

  @IsString()
  @MinLength(8, { message: '密码至少 8 位' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,8}$/, { message: '验证码格式不正确' })
  code: string;
}
