import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { AssumeRoleCommand, STSClient } from '@aws-sdk/client-sts';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { CompleteUploadResponseDto } from './dtos/upload.response.dto';
import { ENVConfig } from 'src/env.config';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private sts: STSClient;
  private roleArn: string = ENVConfig.AWS_STS_ROLE_ARN;
  constructor() {
    this.s3 = new S3Client({
      region: ENVConfig.AWS_REGION,
      endpoint: ENVConfig.AWS_S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: ENVConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: ENVConfig.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.sts = new STSClient({
      region: ENVConfig.AWS_REGION,
      endpoint: ENVConfig.AWS_S3_ENDPOINT,
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
    clientIp?: string,
  ) {
    const ipRestrictionPolicy = JSON.stringify({
      version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: 's3:PutObject',
          Resource: 'arn:aws:s3:::' + ENVConfig.AWS_S3_BUCKET + '/' + key,
          Condition: {
            IpAddress: {
              'aws:SourceIp': `${clientIp}/32`,
            },
          },
        },
      ],
    });

    const assumedRoleCommand = new AssumeRoleCommand({
      RoleArn: this.roleArn,
      RoleSessionName: `upload-session-${uploadId}`,
      Policy: ipRestrictionPolicy,
      DurationSeconds: 3600,
    });

    const assumedRole = await this.sts.send(assumedRoleCommand);
    const tempCredentials = assumedRole.Credentials;
    const tempS3Client = new S3Client({
      region: ENVConfig.AWS_REGION,
      endpoint: ENVConfig.AWS_S3_ENDPOINT,
      forcePathStyle: true,
      credentials: {
        accessKeyId: tempCredentials?.AccessKeyId || '',
        secretAccessKey: tempCredentials?.SecretAccessKey || '',
        sessionToken: tempCredentials?.SessionToken || '',
      },
    });
    const urls = await Promise.all(
      Array.from({ length: partCount }, async (_, index) => {
        const command = new UploadPartCommand({
          Bucket: ENVConfig.AWS_S3_BUCKET,
          Key: key,
          UploadId: uploadId,
          PartNumber: index + 1,
        });

        const url = await getSignedUrl(tempS3Client, command, {
          expiresIn: 3600,
        });
        return { partNumber: index + 1, url };
      }),
    );

    return urls;
  }

  async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: { ETag: string; PartNumber: number }[],
  ): Promise<CompleteUploadResponseDto> {
    const command = new CompleteMultipartUploadCommand({
      Bucket: ENVConfig.AWS_S3_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    const response = await this.s3.send(command);
    return {
      ETag: response.ETag ?? '',
      Bucket: ENVConfig.AWS_S3_BUCKET,
      Key: key,
      Location: `https://${ENVConfig.AWS_S3_BUCKET}.${ENVConfig.AWS_S3_ENDPOINT}/${key}`,
    };
  }
}
