import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import { InjectMinio } from '../common/decorators/minio.decorator';

@Injectable()
export class FilesService {
  protected _bucketName = 'wibutime';

  constructor(@InjectMinio() private readonly minioService: Minio.Client) {}

  async bucketsList() {
    return await this.minioService.listBuckets();
  }

  async getFile(filename: string) {
    return await this.minioService.presignedUrl(
      'GET',
      this._bucketName,
      filename,
    );
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = `${randomUUID().toString()}-${file.originalname}`;

    try {
      // Tải file lên MinIO
      await this.minioService.putObject(
        this._bucketName,
        filename,
        file.buffer,
        file.size,
      );

      // Tạo URL tạm thời cho file đã tải lên
      const fileUrl = await this.minioService.presignedUrl(
        'GET',
        this._bucketName,
        filename,
      );

      return {
        message: 'File uploaded successfully',
        url: fileUrl, // Trả về URL của file đã tải lên
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
}
