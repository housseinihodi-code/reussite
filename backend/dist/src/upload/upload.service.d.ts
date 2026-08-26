import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private readonly config;
    constructor(config: ConfigService);
    buildPublicUrl(filename: string): string;
}
