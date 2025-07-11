import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

const providers = [UploadService];

@Module({
  controllers: [UploadController],
  providers: [...providers],
  exports: [...providers],
})
export class UploadModule {}
