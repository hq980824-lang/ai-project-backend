import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UserStatus } from '../user-status.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户名', minLength: 2, maxLength: 64, example: 'lisi' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 64)
  username?: string;

  @ApiPropertyOptional({ description: '手机号（6–20 位数字，可带 +）', example: '13900000000' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{6,20}$/, { message: 'phone 格式不正确' })
  phone?: string;

  @ApiPropertyOptional({
    enum: UserStatus,
    description: '用户状态：0 禁用，1 正常',
    example: UserStatus.Normal,
  })
  @IsOptional()
  @IsIn([UserStatus.Disabled, UserStatus.Normal])
  status?: UserStatus;
}

