import { Payment as PaymentDto, PaymentStatus } from '@bayan/shared';
import { Payment as PaymentEntity } from '@prisma/client';

export function toPaymentDto(payment: PaymentEntity): PaymentDto {
  return {
    id: payment.id,
    bookingId: payment.bookingId,
    amount: payment.amount.toNumber(),
    currency: payment.currency,
    status: payment.status as unknown as PaymentStatus,
    moyasarId: payment.moyasarId,
    createdAt: payment.createdAt.toISOString(),
  };
}
