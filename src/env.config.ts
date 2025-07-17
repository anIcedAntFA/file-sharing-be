import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';
import { config } from 'dotenv';

config();

class ENVConfiguration {
  constructor() {
    const error = validateSync(this);
    if (!error.length) return;
    console.error(`Config validation error: ${JSON.stringify(error, null, 2)}`);
    process.exit(1);
  }

  @IsNumber()
  readonly MINUTE_IN_MS = Number(process.env['MINUTE_IN_MS'] || 60000);

  @IsNumber()
  readonly MAX_REQUEST = Number(process.env['MAX_REQUEST'] || 300);

  @IsString()
  readonly SENTRY_DSN =
    process.env['SENTRY_DSN'] ??
    'https://f3a7f5ddb918ee08165a5426c650d8d1@o460330.ingest.sentry.io/4506148549558272';

  @IsString()
  readonly NODE_ENV = process.env['NODE_ENV'] ?? 'local';

  @IsString()
  readonly APP_ENV = process.env['APP_ENV'] ?? 'local';

  @IsString()
  readonly GLOBAL_PREFIX_API = process.env['GLOBAL_PREFIX_API'] ?? 'api';

  @IsInt()
  readonly PORT = Number(process.env['PORT'] || '3002');

  @IsArray()
  readonly ALLOW_ORIGINS = process.env['ALLOW_ORIGINS']?.split(',') ?? [];
  @IsString()
  readonly SERVICE_NAME = process.env['SERVICE_NAME'] ?? 'selectall-api';

  @IsString()
  readonly SERVICE_CODE = process.env['SERVICE_CODE'] ?? 'selectall';

  @IsString()
  readonly MAIL_URL = process.env['MAIL_URL'] ?? '';

  @IsString()
  readonly MAIL_API_KEY = process.env['MAIL_API_KEY'] ?? '';

  @IsString()
  readonly MAIL_RECIPIENTS = process.env['MAIL_RECIPIENTS'] ?? '';

  @IsString()
  readonly MAIL_SENDER = process.env['MAIL_SENDER'] ?? '';

  @IsString()
  readonly QUICK_BOARD_URL = process.env['QUICK_BOARD_URL'] ?? '';

  @IsString()
  readonly QUICK_BOARD_KEY = process.env['QUICK_BOARD_KEY'] ?? '';

  @IsString()
  readonly QUICK_BOARD_CLIENT_ID = process.env['QUICK_BOARD_CLIENT_ID'] ?? '';

  @IsString()
  readonly INSPECTION_URL = process.env['INSPECTION_URL'] ?? '';

  @IsString()
  readonly INSPECTION_KEY = process.env['INSPECTION_KEY'] ?? '';

  @IsString()
  readonly INSPECTION_COMMUNITY_ID =
    process.env['INSPECTION_COMMUNITY_ID'] ?? '';

  @IsString()
  readonly AWS_ACCESS_KEY_ID = process.env['AWS_ACCESS_KEY_ID'] ?? 'admin';
  @IsString()
  readonly AWS_SECRET_ACCESS_KEY =
    process.env['AWS_SECRET_ACCESS_KEY'] ?? 'adminadmin';
  @IsString()
  readonly AWS_S3_BUCKET = process.env['AWS_S3_BUCKET'] ?? 'uploads';
  @IsString()
  readonly AWS_REGION = process.env['AWS_REGION'] ?? 'us-east-1';
  @IsString()
  readonly AWS_S3_ENDPOINT =
    process.env['AWS_S3_ENDPOINT'] ?? 'http://localhost:9000';
  @IsString()
  readonly AWS_STS_ROLE_ARN =
    process.env['AWS_STS_ROLE_ARN'] ?? `arn:aws:iam::admin:role/upload-role`;
}

export const ENVConfig = new ENVConfiguration();
