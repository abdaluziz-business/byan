import { Plan } from './enums';

export interface Client {
  id: string;
  email: string;
  businessName: string;
  plan: Plan;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ClientProfile = Client;
