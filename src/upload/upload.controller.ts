import { Controller, Post, Body } from '@nestjs/common'
import { UploadService } from './upload.service'

@Controller('v1/upload')
export class UploadController {
  constructor(private s3: UploadService) {}

  @Post('init')
  async initUpload(@Body() body: { filename: string; contentType: string }) {
    return this.s3.createMultipartUpload(body.filename, body.contentType)
  }

  @Post('presign')
  async getPartUrls(@Body() body: { key: string; uploadId: string; partCount: number }) {
    return this.s3.generatePresignedUrls(body.key, body.uploadId, body.partCount)
  }

  @Post('complete')
  async completeUpload(
    @Body() body: { key: string; uploadId: string; parts: { ETag: string; PartNumber: number }[] },
  ) {
    return this.s3.completeMultipartUpload(body.key, body.uploadId, body.parts)
  }
}
