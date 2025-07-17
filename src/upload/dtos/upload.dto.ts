import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayNotEmpty, IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator'

export class InitUploadDto {
  @ApiProperty({
    description: 'The name of the file to upload',
    example: 'document.pdf',
  })
  @IsString()
  fileName: string

  @ApiProperty({
    description: 'The MIME type of the file',
    example: 'application/pdf',
  })
  @IsString()
  contentType: string
}

export class PresignUrlsDto {
  @ApiProperty({
    description: 'The key of the file in S3',
    example: 'document.pdf',
  })
  @IsString()
  key: string

  @ApiProperty({
    description: 'The upload ID from the initiated multipart upload',
    example:
      '9gQOYxnQm1Qup0Ct3AE_e8hNj6tNsgKXmxLIUHFGNy5WfJRFYKIl8xLOB78SsqhOr1CKgYTzLc6rS_6DByOujQ==',
  })
  @IsString()
  uploadId: string

  @ApiProperty({
    description: 'The number of parts the file will be split into',
    example: 5,
  })
  @Min(1)
  @IsNumber()
  partCount: number
}

export class UploadPartDto {
  @ApiProperty({
    description: 'The ETag returned by S3 after uploading a part',
    example: '"d8e8fca2dc0f896fd7cb4cb0031ba249"',
  })
  @IsString()
  ETag: string

  @ApiProperty({
    description: 'The part number',
    example: 1,
  })
  @Min(1)
  @IsNumber()
  PartNumber: number
}

export class CompleteUploadDto {
  @ApiProperty({
    description: 'The key of the file in S3',
    example: 'document.pdf',
  })
  key: string

  @ApiProperty({
    description: 'The upload ID from the initiated multipart upload',
    example:
      '9gQOYxnQm1Qup0Ct3AE_e8hNj6tNsgKXmxLIUHFGNy5WfJRFYKIl8xLOB78SsqhOr1CKgYTzLc6rS_6DByOujQ==',
  })
  @IsString()
  uploadId: string

  @ApiProperty({
    description: 'The parts information with ETags returned by S3',
    type: [UploadPartDto],
  })
  @IsArray()
  @ArrayNotEmpty() // Đảm bảo mảng không rỗng
  @ValidateNested({ each: true }) // Quan trọng: Validate từng object trong mảng
  @Type(() => UploadPartDto)
  parts: UploadPartDto[]
}
