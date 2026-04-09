import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('oss')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  @ResponseMessage('上传成功')
  async uploadToOSS(@UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.uploadToOSS(file);
  }

  @Get('policy')
  @ResponseMessage('获取policy成功')
  async getPolicy() {
    return await this.uploadService.getOSSPolicy();
  }
}
