import { ContactMessage as ContactMessageDto } from '@bayan/shared';
import { ContactMessage as ContactMessageEntity } from '@prisma/client';

export function toContactMessageDto(message: ContactMessageEntity): ContactMessageDto {
  return {
    id: message.id,
    siteId: message.siteId,
    name: message.name,
    email: message.email,
    phone: message.phone,
    message: message.message,
    attachment: message.attachment,
    createdAt: message.createdAt.toISOString(),
  };
}
