import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^1\d{10}$/, { message: '请输入 11 位大陆手机号' })
  phone: string;

  @IsString()
  @MinLength(1)
  password: string;
}
