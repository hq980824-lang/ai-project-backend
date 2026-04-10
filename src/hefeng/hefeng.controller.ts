import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { HefengService } from './hefeng.service';
import { HefengIndecesDto } from './dto/hefeng-indeces.dto';

@ApiTags('和风天气')
@Controller('hefeng')
export class HefengController {
  constructor(private readonly hefengService: HefengService) {}

  @Get('token')
  @ApiOperation({
    summary: '获取和风天气 API JWT',
    description:
      '按官方文档使用 Ed25519 私钥签发 JWT，请求业务 API 时在 Header 携带：`Authorization: Bearer <token>`。',
  })
  @ResponseMessage('success')
  getToken() {
    return this.hefengService.getQweatherJwt();
  }

  @Post('indices')
  @ApiOperation({
    summary: '获取和风天气生活指数',
    description: '获取和风天气生活指数',
  })
  @ResponseMessage('success')
  getIndices(@Body() dto: HefengIndecesDto) {
    return this.hefengService.getIndicesByDays(dto.cityId, dto.days);
  }
}
