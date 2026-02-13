<<<<<<< HEAD
import {
  Controller,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { Request } from 'express';
import {
  CompleteUploadDto,
  InitUploadDto,
  PresignUrlsDto,
} from './dtos/upload.dto';
import {
  CompleteUploadResponseDto,
  InitUploadResponseDto,
  PresignedUrlDto,
} from './dtos/upload.response.dto';
=======
import { Controller, Post, Body } from '@nestjs/common';
import { UploadService } from './upload.service';
>>>>>>> 74c4116 (backup)

@ApiTags('File Upload')
@Controller('v1/upload')
export class UploadController {
  constructor(private s3: UploadService) {}

  @Post('init')
<<<<<<< HEAD
  @ApiOperation({
    summary: 'Initialize multipart upload',
    description:
      'Creates a new multipart upload in S3 and returns an upload ID',
  })
  @ApiResponse({
    status: 201,
    description: 'The upload has been successfully initiated',
    type: InitUploadResponseDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async initUpload(
    @Body() body: InitUploadDto,
  ): Promise<InitUploadResponseDto> {
=======
  async initUpload(@Body() body: { fileName: string; contentType: string }) {
>>>>>>> 74c4116 (backup)
    return this.s3.createMultipartUpload(body.fileName, body.contentType);
  }

  @Post('presign')
<<<<<<< HEAD
  @ApiOperation({
    summary: 'Generate presigned URLs for parts',
    description:
      'Generates presigned URLs for uploading individual parts of a multipart upload',
  })
  @ApiResponse({
    status: 201,
    description: 'Presigned URLs generated successfully',
    type: [PresignedUrlDto],
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getPartUrls(
    @Req() req: Request,
    @Body() body: PresignUrlsDto,
  ): Promise<PresignedUrlDto[]> {
    const ip = req.ip;
=======
  async getPartUrls(
    @Body() body: { key: string; uploadId: string; partCount: number },
  ) {
>>>>>>> 74c4116 (backup)
    return this.s3.generatePresignedUrls(
      body.key,
      body.uploadId,
      body.partCount,
<<<<<<< HEAD
      ip,
=======
>>>>>>> 74c4116 (backup)
    );
  }

  @Post('complete')
  @ApiOperation({
    summary: 'Complete multipart upload',
    description:
      'Completes a multipart upload by assembling previously uploaded parts',
  })
  @ApiResponse({
    status: 201,
    description: 'The multipart upload has been successfully completed',
    type: CompleteUploadResponseDto,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async completeUpload(
<<<<<<< HEAD
    @Body() body: CompleteUploadDto,
  ): Promise<CompleteUploadResponseDto> {
=======
    @Body()
    body: {
      key: string;
      uploadId: string;
      parts: { ETag: string; PartNumber: number }[];
    },
  ) {
>>>>>>> 74c4116 (backup)
    return this.s3.completeMultipartUpload(body.key, body.uploadId, body.parts);
  }
}
