import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../../config/configuration';

export interface CreateMoyasarPaymentInput {
  amount: number;
  currency?: string;
  description: string;
  callbackUrl: string;
  source: {
    type: 'creditcard';
    name: string;
    number: string;
    cvc: string;
    month: string;
    year: string;
  };
}

export interface MoyasarPayment {
  id: string;
  status: 'initiated' | 'paid' | 'failed' | 'authorized' | 'captured' | 'refunded' | 'voided';
  amount: number;
  currency: string;
  invoice_id: string | null;
}

/**
 * Thin wrapper around the Moyasar payments API (Saudi payment gateway).
 * Placeholder integration: set MOYASAR_API_KEY in .env to enable real charges.
 */
@Injectable()
export class MoyasarService {
  private readonly logger = new Logger(MoyasarService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {
    this.apiKey = this.configService.get('moyasar.apiKey', { infer: true });
    this.baseUrl = this.configService.get('moyasar.baseUrl', { infer: true });
  }

  private get authHeader(): string {
    return `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`;
  }

  async createPayment(input: CreateMoyasarPaymentInput): Promise<MoyasarPayment> {
    if (!this.apiKey) {
      this.logger.warn('MOYASAR_API_KEY not set — returning a simulated payment');
      return {
        id: `simulated_${Date.now()}`,
        status: 'initiated',
        amount: input.amount,
        currency: input.currency ?? 'SAR',
        invoice_id: null,
      };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post<MoyasarPayment>(
          `${this.baseUrl}/payments`,
          {
            amount: input.amount,
            currency: input.currency ?? 'SAR',
            description: input.description,
            callback_url: input.callbackUrl,
            source: input.source,
          },
          { headers: { Authorization: this.authHeader } },
        ),
      );

      return response.data;
    } catch (error) {
      this.logger.error('Moyasar payment creation failed', error);
      throw new ServiceUnavailableException('Payment provider is unavailable');
    }
  }

  async getPayment(paymentId: string): Promise<MoyasarPayment> {
    const response = await firstValueFrom(
      this.httpService.get<MoyasarPayment>(`${this.baseUrl}/payments/${paymentId}`, {
        headers: { Authorization: this.authHeader },
      }),
    );

    return response.data;
  }

  verifyWebhookSecret(providedSecret: string | undefined): boolean {
    const expected = this.configService.get('moyasar.webhookSecret', { infer: true });
    return Boolean(expected) && providedSecret === expected;
  }
}
