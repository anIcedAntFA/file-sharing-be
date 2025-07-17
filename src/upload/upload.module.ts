import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

const providers = [UploadService];

@Module({
  imports: [
    MulterModule.register({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      storage: memoryStorage(),
    }),
  ],
  controllers: [UploadController],
  providers: [...providers],
  exports: [...providers],
})
export class UploadModule {}
