import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HefengIndicesEntity } from './entities/hefeng-indices.entity';
import { HefengController } from './hefeng.controller';
import { HefengService } from './hefeng.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([HefengIndicesEntity])],
  controllers: [HefengController],
  providers: [HefengService],
  exports: [HefengService],
})
export class HefengModule {}
