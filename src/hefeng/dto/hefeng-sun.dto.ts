import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class HefengSunDto {
  @ApiProperty({ description: '城市 LocationID', example: '101010100' })
  @IsString()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({
    description: '日期 YYYY-MM-DD（服务端会转为和风要求的 yyyyMMdd）',
    example: '2026-04-10',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date 须为 YYYY-MM-DD' })
  date: string;
}
