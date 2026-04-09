"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSSConfig = void 0;
const OSSConfig = (configService) => ({
    region: configService.get('OSS_REGION'),
    accessKeyId: configService.get('OSS_ACCESS_KEY_ID'),
    accessKeySecret: configService.get('OSS_ACCESS_KEY_SECRET'),
    bucket: configService.get('OSS_BUCKET'),
});
exports.OSSConfig = OSSConfig;
//# sourceMappingURL=oss.js.map