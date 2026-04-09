import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OSS from 'ali-oss';
import { OSSConfig } from './config/oss';

@Injectable()
export class UploadService {
  private ossClient: OSS;
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
    private configService: ConfigService,
  ) {
    this.ossClient = new OSS(OSSConfig(configService));
  }

  async uploadToOSS(file: Express.Multer.File) {
    // 1. 生成唯一文件名，防止覆盖
    const fileExt = file.originalname.split('.').pop();
    const ossFileName = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

    try {
      // 2. 上传到阿里云OSS（核心代码！）
      await this.ossClient.put(ossFileName, file.buffer);

      // 3. 拼接线上可访问URL
      const fileUrl = `${this.configService.get('OSS_DOMAIN')}/${ossFileName}`;

      // 4. 把信息存数据库
      const newFile = this.uploadRepository.create({
        originalName: file.originalname,
        filename: ossFileName,
        url: fileUrl,
        size: file.size,
        mimetype: file.mimetype,
      });

      const result = await this.uploadRepository.save(newFile);

      // 5. 返回给前端
      return result;
    } catch (err) {
      throw new Error('OSS上传失败：' + err.message);
    }
  }

  async getOSSPolicy() {
    const accessKeyId = this.configService.get('OSS_ACCESS_KEY_ID');
    const accessKeySecret = this.configService.get('OSS_ACCESS_KEY_SECRET');
    const bucket = this.configService.get('OSS_BUCKET');
    const region = this.configService.get('OSS_REGION');
    const domain = this.configService.get('OSS_DOMAIN');

    const expireTime = 10 * 60;
    const expire = Math.floor(Date.now() / 1000) + expireTime;

    const policy = {
      expiration: new Date(expire * 1000).toISOString(),
      conditions: [
        ['content-length-range', 0, 5 * 1024 * 1024], 
        { bucket: bucket },
      ],
    };

    const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');

    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha1', accessKeySecret)
      .update(policyBase64)
      .digest('base64');

    return {
      accessKeyId: accessKeyId,
      policy: policyBase64,
      signature: signature,
      dir: 'uploads/', 
      host: `https://${bucket}.${region}.aliyuncs.com`, 
      domain: domain, 
    };
  }
}
