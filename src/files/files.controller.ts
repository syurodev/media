import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(readonly service: FilesService) {}

  @Get('buckets')
  async bucketsList() {
    console.log(1);
    return await this.service.bucketsList();
  }

  @Get('file-url/:name')
  async getFile(@Param('name') name: string) {
    return await this.service.getFile(name);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file') file: Express.Multer.File) {
    console.log(2);
    return await this.service.uploadFile(file);
  }
}
