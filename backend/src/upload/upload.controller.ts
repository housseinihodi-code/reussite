import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { nanoid } from 'nanoid';
import { UploadService } from './upload.service';

const imageFileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  callback: (error: Error | null, accept: boolean) => void,
) => {
  if (!file.mimetype.match(/^image\/(jpe?g|png|webp|avif)$/)) {
    callback(new BadRequestException('Seules les images (jpg, png, webp, avif) sont autorisées.'), false);
    return;
  }
  callback(null, true);
};

const storage = diskStorage({
  destination: process.env.UPLOAD_DIR ?? 'uploads',
  filename: (_req, file, callback) => {
    callback(null, `${nanoid(16)}${extname(file.originalname)}`);
  },
});

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter: imageFileFilter, limits: { fileSize: 8 * 1024 * 1024 } }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: this.uploadService.buildPublicUrl(file.filename) };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 15, { storage, fileFilter: imageFileFilter, limits: { fileSize: 8 * 1024 * 1024 } }))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return { urls: files.map((file) => this.uploadService.buildPublicUrl(file.filename)) };
  }
}
