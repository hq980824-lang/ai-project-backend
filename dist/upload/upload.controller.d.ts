import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadToOSS(file: Express.Multer.File): Promise<import("./upload.entity").Upload>;
    getPolicy(): Promise<{
        accessKeyId: any;
        policy: string;
        signature: any;
        dir: string;
        host: string;
        domain: any;
    }>;
}
