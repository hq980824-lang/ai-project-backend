import { IsIn, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { UserStatus } from '../user-status.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 64)
  username?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{6,20}$/, { message: 'phone 格式不正确' })
  phone?: string;

  @IsOptional()
  @IsIn([UserStatus.Disabled, UserStatus.Normal])
  status?: UserStatus;
}

