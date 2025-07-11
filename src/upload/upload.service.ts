import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  ServiceOutputTypes,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ENVConfig } from 'src/env.config';

@Injectable()
export class UploadService {
  private s3;
  constructor() {
    console.log('S3 Client initialized with endpoint:', ENVConfig);

    this.s3 = new S3Client({
      region: ENVConfig.AWS_REGION,
      endpoint: ENVConfig.AWS_S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: ENVConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENVConfig.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async createMultipartUpload(filename: string, contentType: string) {
    const command = new CreateMultipartUploadCommand({
      Bucket: ENVConfig.AWS_S3_BUCKET,
      Key: filename,
      ContentType: contentType,
    });

    const response = await this.s3.send(command);

    if (!response.UploadId || !response.Key) {
      throw new Error(
        'Failed to create multipart upload: UploadId or Key is null',
      );
    }

    return {
      uploadId: response.UploadId,
      key: response.Key,
    };
  }

  async generatePresignedUrls(
    key: string,
    uploadId: string,
    partCount: number,
  ) {
    const urls = await Promise.all(
      Array.from({ length: partCount }, async (_, index) => {
        const command = new UploadPartCommand({
          Bucket: ENVConfig.AWS_S3_BUCKET,
          Key: key,
          UploadId: uploadId,
          PartNumber: index + 1,
        });

        const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
        return { partNumber: index + 1, url };
      }),
    );

    return urls;
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: ENVConfig.AWS_S3_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    return await this.s3.send(command);
  }
}
