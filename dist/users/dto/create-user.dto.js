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
    username;
    phone;
    status;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '用户名', minLength: 2, maxLength: 64, example: 'lisi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(2, 64),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '手机号（6–20 位数字，可带 +）', example: '13900000000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\+?\d{6,20}$/, { message: 'phone 格式不正确' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
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