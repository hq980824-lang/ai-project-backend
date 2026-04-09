"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const upload_entity_1 = require("./upload.entity");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const ali_oss_1 = __importDefault(require("ali-oss"));
const oss_1 = require("./config/oss");
let UploadService = class UploadService {
    uploadRepository;
    configService;
    ossClient;
    constructor(uploadRepository, configService) {
        this.uploadRepository = uploadRepository;
        this.configService = configService;
        this.ossClient = new ali_oss_1.default((0, oss_1.OSSConfig)(configService));
    }
    async uploadToOSS(file) {
        const fileExt = file.originalname.split('.').pop();
        const ossFileName = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
        try {
            await this.ossClient.put(ossFileName, file.buffer);
            const fileUrl = `${this.configService.get('OSS_DOMAIN')}/${ossFileName}`;
            const newFile = this.uploadRepository.create({
                originalName: file.originalname,
                filename: ossFileName,
                url: fileUrl,
                size: file.size,
                mimetype: file.mimetype,
            });
            const result = await this.uploadRepository.save(newFile);
            return result;
        }
        catch (err) {
            throw new Error('OSS上传失败：' + err.message);
        }
    }
    async getOSSPolicy() {
        const accessKeyId = this.configService.get('OSS_ACCESS_KEY_ID');
        const accessKeySecret = this.configService.get('OSS_ACCESS_KEY_SECRET');
        const bucket = this.configService.get('OSS_BUCKET');
        const region = this.configService.get('OSS_REGION');
        const domain = this.configService.get('OSS_DOMAIN');
        const expireTime = 10 * 60;
        const expire = Math.floor(Date.now() / 1000) + expireTime;
        const policy = {
            expiration: new Date(expire * 1000).toISOString(),
            conditions: [
                ['content-length-range', 0, 5 * 1024 * 1024],
                { bucket: bucket },
            ],
        };
        const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');
        const crypto = require('crypto');
        const signature = crypto
            .createHmac('sha1', accessKeySecret)
            .update(policyBase64)
            .digest('base64');
        return {
            accessKeyId: accessKeyId,
            policy: policyBase64,
            signature: signature,
            dir: 'uploads/',
            host: `https://${bucket}.${region}.aliyuncs.com`,
            domain: domain,
        };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(upload_entity_1.Upload)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map