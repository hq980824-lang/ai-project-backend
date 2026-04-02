"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto_1 = require("crypto");
const typeorm_2 = require("typeorm");
const dysmsapi20170525_1 = __importStar(require("@alicloud/dysmsapi20170525"));
const openapi_core_1 = require("@alicloud/openapi-core");
const users_service_1 = require("../users/users.service");
const sms_verification_entity_1 = require("./entities/sms-verification.entity");
const sms_purpose_enum_1 = require("./sms-purpose.enum");
const SEND_COOLDOWN_MS = 60_000;
const CODE_TTL_MS = 5 * 60_000;
const CODE_SALT_ROUNDS = 6;
let SmsService = SmsService_1 = class SmsService {
    config;
    usersService;
    smsRepo;
    logger = new common_1.Logger(SmsService_1.name);
    lastSent = new Map();
    constructor(config, usersService, smsRepo) {
        this.config = config;
        this.usersService = usersService;
        this.smsRepo = smsRepo;
    }
    async requestCode(phone, purpose) {
        const key = `${phone}:${purpose}`;
        const prev = this.lastSent.get(key);
        if (prev !== undefined && Date.now() - prev < SEND_COOLDOWN_MS) {
            throw new common_1.BadRequestException('发送过于频繁，请稍后再试');
        }
        if (purpose === sms_purpose_enum_1.SmsPurpose.Register) {
            const exists = await this.usersService.findByPhone(phone);
            if (exists) {
                throw new common_1.BadRequestException('该手机号已注册');
            }
        }
        else {
            const exists = await this.usersService.findByPhone(phone);
            if (!exists) {
                throw new common_1.BadRequestException('该手机号未注册');
            }
        }
        await this.smsRepo.delete({ phone, purpose });
        const code = String((0, crypto_1.randomInt)(100_000, 1_000_000));
        const codeHash = await bcrypt.hash(code, CODE_SALT_ROUNDS);
        const expiresAt = new Date(Date.now() + CODE_TTL_MS);
        await this.smsRepo.save(this.smsRepo.create({
            phone,
            purpose,
            codeHash,
            expiresAt,
        }));
        await this.dispatchAliyun(phone, code);
        this.lastSent.set(key, Date.now());
    }
    async verifyAndConsumeCode(phone, purpose, code) {
        const row = await this.smsRepo.findOne({
            where: { phone, purpose },
            order: { id: 'DESC' },
        });
        if (!row || row.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('验证码无效或已过期');
        }
        const ok = await bcrypt.compare(code, row.codeHash);
        if (!ok) {
            throw new common_1.BadRequestException('验证码错误');
        }
        await this.smsRepo.delete({ id: row.id });
    }
    async dispatchAliyun(phone, code) {
        const mock = this.config.get('SMS_MOCK') === 'true' ||
            !this.config.get('ALIYUN_ACCESS_KEY_ID')?.trim();
        if (mock) {
            this.logger.warn(`[SMS 模拟] -> ${phone} 验证码: ${code}`);
            return;
        }
        const accessKeyId = this.config.getOrThrow('ALIYUN_ACCESS_KEY_ID');
        const accessKeySecret = this.config.getOrThrow('ALIYUN_ACCESS_KEY_SECRET');
        const signName = this.config.getOrThrow('ALIYUN_SMS_SIGN_NAME');
        const templateCode = this.config.getOrThrow('ALIYUN_SMS_TEMPLATE_CODE');
        const paramKey = this.config.get('ALIYUN_SMS_CODE_PARAM', 'code');
        const cfg = new openapi_core_1.$OpenApiUtil.Config({
            accessKeyId,
            accessKeySecret,
            regionId: this.config.get('ALIYUN_REGION_ID', 'cn-hangzhou'),
        });
        cfg.endpoint = 'dysmsapi.aliyuncs.com';
        const client = new dysmsapi20170525_1.default(cfg);
        const req = new dysmsapi20170525_1.SendSmsRequest({
            phoneNumbers: phone,
            signName,
            templateCode,
            templateParam: JSON.stringify({ [paramKey]: code }),
        });
        const res = await client.sendSms(req);
        const body = res.body;
        if (body?.code !== 'OK') {
            this.logger.error(`阿里云短信失败: ${body?.code} ${body?.message ?? ''}`);
            throw new common_1.ServiceUnavailableException(body?.message ?? '短信发送失败，请稍后重试');
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(sms_verification_entity_1.SmsVerificationEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        typeorm_2.Repository])
], SmsService);
//# sourceMappingURL=sms.service.js.map