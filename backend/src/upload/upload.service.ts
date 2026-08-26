import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {}

  buildPublicUrl(filename: string): string {
    const driver = this.config.get<string>('upload.driver', 'local');
    if (driver === 'local') {
      return `/uploads/${filename}`;
    }
    const bucket = this.config.get<string>('upload.s3.bucket');
    const region = this.config.get<string>('upload.s3.region');
    return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
  }
}
