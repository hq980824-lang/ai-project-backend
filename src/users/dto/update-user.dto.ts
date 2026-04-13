import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { UserStatus } from '../user-status.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    enum: UserStatus,
    description: '用户状态：0 禁用，1 正常',
    example: UserStatus.Normal,
  })
  @IsOptional()
  @IsIn([UserStatus.Disabled, UserStatus.Normal])
  status?: UserStatus;
}

