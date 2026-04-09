import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Upload } from './upload.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Upload]), ConfigModule],
  controllers: [UploadController],
  providers: [UploadService],
})

export class UploadModule {}
