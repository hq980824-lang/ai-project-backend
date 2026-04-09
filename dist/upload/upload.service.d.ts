import { Upload } from './upload.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private uploadRepository;
    private configService;
    private ossClient;
    constructor(uploadRepository: Repository<Upload>, configService: ConfigService);
    uploadToOSS(file: Express.Multer.File): Promise<Upload>;
    getOSSPolicy(): Promise<{
        accessKeyId: any;
        policy: string;
        signature: any;
        dir: string;
        host: string;
        domain: any;
    }>;
}
