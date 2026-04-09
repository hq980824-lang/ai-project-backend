import * as OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';
export declare const OSSConfig: (configService: ConfigService) => OSS.Options;
