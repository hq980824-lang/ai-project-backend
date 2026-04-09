import * as OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';

export const OSSConfig = (configService: ConfigService): OSS.Options => ({
  region: configService.get('OSS_REGION'),
  accessKeyId: configService.get('OSS_ACCESS_KEY_ID')!,
  accessKeySecret: configService.get('OSS_ACCESS_KEY_SECRET')!,
  bucket: configService.get('OSS_BUCKET'),
});