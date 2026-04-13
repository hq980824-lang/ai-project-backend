import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '../user-status.enum';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: '邮箱',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: '验证码',
    example: '123456',
  })
  @IsString()
  code: string;

  @ApiPropertyOptional({
    enum: UserStatus,
    description: '用户状态：0 禁用，1 正常；默认由服务端决定',
    example: UserStatus.Normal,
  })
  @IsOptional()
  @IsIn([UserStatus.Disabled, UserStatus.Normal])
  status?: UserStatus;
}

