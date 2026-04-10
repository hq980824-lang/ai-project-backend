import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { HefengService } from './hefeng.service';
import { HefengIndecesDto } from './dto/hefeng-indeces.dto';
import { HefengSunDto } from './dto/hefeng-sun.dto';

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
    description:
      '按预报日期 YYYY-MM-DD 查询；type 为指数类型 ID（逗号分隔），不传默认 1,2。服务端按和风规则内部选用 1d/3d 请求。',
  })
  @ResponseMessage('success')
  getIndices(@Body() dto: HefengIndecesDto) {
    return this.hefengService.getIndicesByDate(
      dto.cityId,
      dto.date,
      dto.type,
    );
  }

  @Post('sun')
  @ApiOperation({
    summary: '日出日落',
    description:
      '调用和风 /v7/astronomy/sun，date 为 YYYY-MM-DD；结果写入数据库。详见 https://dev.qweather.com/docs/api/astronomy/sunrise-sunset/',
  })
  @ResponseMessage('success')
  getSun(@Body() dto: HefengSunDto) {
    return this.hefengService.getSunByDate(dto.cityId, dto.date);
  }
}
