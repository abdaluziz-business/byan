import { Booking as BookingDto, BookingStatus, PaymentStatus } from '@bayan/shared';
import { Booking as BookingEntity } from '@prisma/client';

export function toBookingDto(booking: BookingEntity): BookingDto {
  return {
    id: booking.id,
    serviceId: booking.serviceId,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    date: booking.date.toISOString(),
    time: booking.time,
    status: booking.status as unknown as BookingStatus,
    paymentStatus: booking.paymentStatus as unknown as PaymentStatus,
    notes: booking.notes,
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}
