import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class HefengIndecesDto {
  @ApiProperty({ description: '城市 ID', example: '101010100' })
  @IsString()
  @IsNotEmpty()
  cityId: string;

  @ApiProperty({
    description: '预报天数，与官方一致为 1d / 3d；',
    example: '1d',
  })
  @IsString()
  @IsNotEmpty()
  days: string;
}