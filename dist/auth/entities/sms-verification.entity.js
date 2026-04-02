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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsVerificationEntity = void 0;
const typeorm_1 = require("typeorm");
const sms_purpose_enum_1 = require("../sms-purpose.enum");
let SmsVerificationEntity = class SmsVerificationEntity {
    id;
    phone;
    purpose;
    codeHash;
    expiresAt;
    createdAt;
};
exports.SmsVerificationEntity = SmsVerificationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SmsVerificationEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], SmsVerificationEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64 }),
    __metadata("design:type", String)
], SmsVerificationEntity.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code_hash', type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], SmsVerificationEntity.prototype, "codeHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SmsVerificationEntity.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SmsVerificationEntity.prototype, "createdAt", void 0);
exports.SmsVerificationEntity = SmsVerificationEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'sms_verifications' }),
    (0, typeorm_1.Index)(['phone', 'purpose'])
], SmsVerificationEntity);
//# sourceMappingURL=sms-verification.entity.js.map