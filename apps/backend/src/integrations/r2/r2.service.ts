import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AppConfig } from '../../config/configuration';

/**
 * Thin wrapper around Cloudflare R2 (S3-compatible object storage).
 * Placeholder integration: set R2_* variables in .env to enable uploads.
 */
@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly configured: boolean;

  constructor(private readonly configService: ConfigService<AppConfig, true>) {
    const accountId = this.configService.get('r2.accountId', { infer: true });
    const accessKeyId = this.configService.get('r2.accessKeyId', { infer: true });
    const secretAccessKey = this.configService.get('r2.secretAccessKey', { infer: true });
    this.bucket = this.configService.get('r2.bucket', { infer: true });
    this.publicUrl = this.configService.get('r2.publicUrl', { infer: true });
    this.configured = Boolean(accountId && accessKeyId && secretAccessKey);

    this.client = new S3Client({
      region: 'auto',
      endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async uploadFile(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const key = `${randomUUID()}-${originalName.replace(/\s+/g, '-')}`;

    if (!this.configured) {
      this.logger.warn(`R2 credentials not set — skipping real upload for ${key}`);
      return `${this.publicUrl || 'https://placeholder.local'}/${key}`;
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    return `${this.publicUrl}/${key}`;
  }

  async getSignedDownloadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }
}
