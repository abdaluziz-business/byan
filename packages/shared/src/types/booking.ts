import { BookingStatus, PaymentStatus } from './enums';

export interface Booking {
  id: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
