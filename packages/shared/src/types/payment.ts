import { PaymentStatus } from './enums';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  moyasarId: string | null;
  createdAt: string;
}
