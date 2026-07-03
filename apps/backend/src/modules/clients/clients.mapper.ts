import { Client as ClientDto, Plan } from '@bayan/shared';
import { Client as ClientEntity } from '@prisma/client';

export function toClientDto(client: ClientEntity): ClientDto {
  return {
    id: client.id,
    email: client.email,
    businessName: client.businessName,
    plan: client.plan as unknown as Plan,
    isActive: client.isActive,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}
