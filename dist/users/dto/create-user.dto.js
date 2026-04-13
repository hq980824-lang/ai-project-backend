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
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_status_enum_1 = require("../user-status.enum");
class CreateUserDto {
    email;
    code;
    status;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '邮箱',
        example: 'test@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: '验证码',
        example: '123456',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: user_status_enum_1.UserStatus,
        description: '用户状态：0 禁用，1 正常；默认由服务端决定',
        example: user_status_enum_1.UserStatus.Normal,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([user_status_enum_1.UserStatus.Disabled, user_status_enum_1.UserStatus.Normal]),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "status", void 0);
//# sourceMappingURL=create-user.dto.js.map