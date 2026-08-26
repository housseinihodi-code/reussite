"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const nanoid_1 = require("nanoid");
const upload_service_1 = require("./upload.service");
const imageFileFilter = (_req, file, callback) => {
    if (!file.mimetype.match(/^image\/(jpe?g|png|webp|avif)$/)) {
        callback(new common_1.BadRequestException('Seules les images (jpg, png, webp, avif) sont autorisées.'), false);
        return;
    }
    callback(null, true);
};
const storage = (0, multer_1.diskStorage)({
    destination: process.env.UPLOAD_DIR ?? 'uploads',
    filename: (_req, file, callback) => {
        callback(null, `${(0, nanoid_1.nanoid)(16)}${(0, path_1.extname)(file.originalname)}`);
    },
});
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    uploadImage(file) {
        return { url: this.uploadService.buildPublicUrl(file.filename) };
    }
    uploadImages(files) {
        return { urls: files.map((file) => this.uploadService.buildPublicUrl(file.filename)) };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage, fileFilter: imageFileFilter, limits: { fileSize: 8 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 15, { storage, fileFilter: imageFileFilter, limits: { fileSize: 8 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], UploadController.prototype, "uploadImages", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
//# sourceMappingURL=upload.controller.js.map