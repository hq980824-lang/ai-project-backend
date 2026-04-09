import { Upload } from './upload.entity';
import { Repository } from 'typeorm';
export declare class UploadService {
    private uploadRepository;
    constructor(uploadRepository: Repository<Upload>);
    saveFileInfo(file: Express.Multer.File): Promise<Upload>;
}
