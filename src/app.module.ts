import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from './minio/minio.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MinioModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
