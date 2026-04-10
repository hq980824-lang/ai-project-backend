import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { HefengService } from './hefeng.service';

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
}
