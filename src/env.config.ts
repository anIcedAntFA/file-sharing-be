import { config } from 'dotenv';

config();

class ENVConfiguration {
  readonly AWS_ACCESS_KEY_ID = process.env['AWS_ACCESS_KEY_ID'] ?? 'admin';
  readonly AWS_SECRET_ACCESS_KEY =
    process.env['AWS_SECRET_ACCESS_KEY'] ?? 'adminadmin';
  readonly AWS_S3_BUCKET = process.env['AWS_S3_BUCKET'] ?? 'uploads';
  readonly AWS_REGION = process.env['AWS_REGION'] ?? 'us-east-1';
  readonly AWS_S3_ENDPOINT =
    process.env['AWS_S3_ENDPOINT'] ?? 'http://localhost:9000';
}

export const ENVConfig = new ENVConfiguration();
