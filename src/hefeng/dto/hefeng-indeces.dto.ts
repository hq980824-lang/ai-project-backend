import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class HefengIndecesDto {
  @ApiProperty({ description: '城市 LocationID', example: '101010100' })
  @IsString()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({
    description: '预报日期，YYYY-MM-DD',
    example: '2026-04-10',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date 须为 YYYY-MM-DD' })
  date: string;

  @ApiPropertyOptional({
    description: '生活指数类型 ID，多个用英文逗号分隔，默认 1,2',
    example: '1,2',
  })
  @IsOptional()
  @IsString()
  type?: string;
}
