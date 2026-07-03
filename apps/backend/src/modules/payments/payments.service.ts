import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Payment, PaymentStatus } from '@bayan/shared';
import { MoyasarService } from '../../integrations/moyasar/moyasar.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { toPaymentDto } from './payments.mapper';

const MOYASAR_STATUS_MAP: Record<string, PaymentStatus> = {
  paid: PaymentStatus.PAID,
  captured: PaymentStatus.PAID,
  failed: PaymentStatus.FAILED,
  refunded: PaymentStatus.REFUNDED,
  voided: PaymentStatus.FAILED,
};

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly moyasarService: MoyasarService,
  ) {}

  async checkout(dto: CreatePaymentDto): Promise<Payment> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { service: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const moyasarPayment = await this.moyasarService.createPayment({
      amount: Math.round(booking.service.price.toNumber() * 100),
      description: `Booking ${booking.id} - ${booking.service.nameEn}`,
      callbackUrl: dto.callbackUrl,
      source: { type: 'creditcard', ...dto.source },
    });

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.service.price,
        moyasarId: moyasarPayment.id,
        status: MOYASAR_STATUS_MAP[moyasarPayment.status] ?? PaymentStatus.PENDING,
      },
    });

    await this.prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: payment.status },
    });

    return toPaymentDto(payment);
  }

  async handleWebhook(moyasarId: string, status: string): Promise<void> {
    const payment = await this.prisma.payment.findFirst({ where: { moyasarId } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const mappedStatus = MOYASAR_STATUS_MAP[status] ?? PaymentStatus.PENDING;

    await this.prisma.payment.update({ where: { id: payment.id }, data: { status: mappedStatus } });
    await this.prisma.booking.update({ where: { id: payment.bookingId }, data: { paymentStatus: mappedStatus } });
  }

  async findAllForSite(siteId: string, clientId: string): Promise<Payment[]> {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    if (site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this site');
    }

    const payments = await this.prisma.payment.findMany({
      where: { booking: { service: { siteId } } },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(toPaymentDto);
  }
}
