import { Module } from '@nestjs/common';
import { HefengController } from './hefeng.controller';
import { HefengService } from './hefeng.service';

@Module({
  controllers: [HefengController],
  providers: [HefengService],
  exports: [HefengService],
})
export class HefengModule {}
