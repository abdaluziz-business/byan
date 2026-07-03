import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { AppConfig } from '../../config/configuration';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Thin wrapper around the Resend email API. Placeholder integration: wire a
 * real RESEND_API_KEY in .env to enable delivery. Without a key it logs and
 * no-ops so local development never fails on missing credentials.
 */
@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly client: Resend | null;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService<AppConfig, true>) {
    const apiKey = this.configService.get('resend.apiKey', { infer: true });
    this.fromEmail = this.configService.get('resend.fromEmail', { infer: true });
    this.client = apiKey ? new Resend(apiKey) : null;
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    if (!this.client) {
      this.logger.warn(`RESEND_API_KEY not set — skipping email to ${options.to}: "${options.subject}"`);
      return;
    }

    await this.client.emails.send({
      from: this.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
