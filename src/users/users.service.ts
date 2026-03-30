import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const existing = await this.usersRepo.findOne({
      where: [{ username: dto.username }, { phone: dto.phone }],
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('username 或 phone 已存在');
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

  async findOne(id: number) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (dto.username && dto.username !== user.username) {
      const hit = await this.usersRepo.findOne({
        where: { username: dto.username },
        select: { id: true },
      });
      if (hit) throw new ConflictException('username 已存在');
    }
    if (dto.phone && dto.phone !== user.phone) {
      const hit = await this.usersRepo.findOne({
        where: { phone: dto.phone },
        select: { id: true },
      });
      if (hit) throw new ConflictException('phone 已存在');
    }

    Object.assign(user, dto);
    return await this.usersRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
    return { deleted: true };
  }
}

