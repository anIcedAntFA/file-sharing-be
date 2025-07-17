import { ApiProperty } from '@nestjs/swagger'

export class InitUploadResponseDto {
  @ApiProperty({
    description: 'The upload ID from the initiated multipart upload',
    example:
      '9gQOYxnQm1Qup0Ct3AE_e8hNj6tNsgKXmxLIUHFGNy5WfJRFYKIl8xLOB78SsqhOr1CKgYTzLc6rS_6DByOujQ==',
  })
  uploadId: string

  @ApiProperty({
    description: 'The key of the file in S3',
    example: 'document.pdf',
  })
  key: string
}

export class PresignedUrlDto {
  @ApiProperty({
    description: 'The part number',
    example: 1,
  })
  partNumber: number

  @ApiProperty({
    description: 'The pre-signed URL to upload the part to',
    example: 'https://bucket-name.s3.amazonaws.com/document.pdf?partNumber=1&uploadId=9gQOYx...',
  })
  url: string
}

export class CompleteUploadResponseDto {
  @ApiProperty({
    description: 'The ETag of the complete object',
    example: '"d8e8fca2dc0f896fd7cb4cb0031ba249"',
  })
  ETag: string

  @ApiProperty({
    description: 'The bucket name',
    example: 'my-bucket',
  })
  Bucket: string

  @ApiProperty({
    description: 'The key of the file in S3',
    example: 'document.pdf',
  })
  Key: string

  @ApiProperty({
    description: 'The URL of the complete object',
    example: 'https://bucket-name.s3.amazonaws.com/document.pdf',
  })
  Location: string
}
