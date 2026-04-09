import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  async saveFileInfo(file: Express.Multer.File) {
    const newFile = this.uploadRepository.create({
      originalName: file.originalname,
      filename: file.fieldname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    });

    return await this.uploadRepository.save(newFile);
  }
}
