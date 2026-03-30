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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    usersRepo;
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    async create(dto) {
        const existing = await this.usersRepo.findOne({
            where: [{ username: dto.username }, { phone: dto.phone }],
            select: { id: true },
        });
        if (existing) {
            throw new common_1.ConflictException('username 或 phone 已存在');
        }
        const entity = this.usersRepo.create({
            ...dto,
            status: dto.status ?? undefined,
        });
        return await this.usersRepo.save(entity);
    }
    async findAll() {
        return await this.usersRepo.find({ order: { id: 'DESC' } });
    }
    async findOne(id) {
        const user = await this.usersRepo.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('用户不存在');
        return user;
    }
    async update(id, dto) {
        const user = await this.findOne(id);
        if (dto.username && dto.username !== user.username) {
            const hit = await this.usersRepo.findOne({
                where: { username: dto.username },
                select: { id: true },
            });
            if (hit)
                throw new common_1.ConflictException('username 已存在');
        }
        if (dto.phone && dto.phone !== user.phone) {
            const hit = await this.usersRepo.findOne({
                where: { phone: dto.phone },
                select: { id: true },
            });
            if (hit)
                throw new common_1.ConflictException('phone 已存在');
        }
        Object.assign(user, dto);
        return await this.usersRepo.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepo.remove(user);
        return { deleted: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map