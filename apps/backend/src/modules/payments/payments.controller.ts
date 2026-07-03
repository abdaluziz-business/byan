import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Payment } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { MoyasarService } from '../../integrations/moyasar/moyasar.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

interface MoyasarWebhookPayload {
  secret_token?: string;
  data: { id: string; status: string };
}

@ApiTags('payments')
@Controller()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly moyasarService: MoyasarService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('payments/checkout')
  @ApiOperation({ summary: 'Charge a booking via Moyasar' })
  checkout(@Body() dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.checkout(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('payments/webhook')
  @ApiOperation({ summary: 'Moyasar webhook — payment status updates' })
  async webhook(@Body() payload: MoyasarWebhookPayload): Promise<{ received: true }> {
    if (!this.moyasarService.verifyWebhookSecret(payload.secret_token)) {
      throw new ForbiddenException('Invalid webhook secret');
    }

    await this.paymentsService.handleWebhook(payload.data.id, payload.data.status);
    return { received: true };
  }

  @ApiBearerAuth()
  @Get('sites/:siteId/payments')
  @ApiOperation({ summary: 'List payments for a site' })
  findAll(@CurrentClient() client: AuthenticatedClient, @Param('siteId') siteId: string): Promise<Payment[]> {
    return this.paymentsService.findAllForSite(siteId, client.id);
  }
}
