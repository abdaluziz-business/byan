import { Service as ServiceDto } from '@bayan/shared';
import { Service as ServiceEntity } from '@prisma/client';

export function toServiceDto(service: ServiceEntity): ServiceDto {
  return {
    id: service.id,
    siteId: service.siteId,
    nameAr: service.nameAr,
    nameEn: service.nameEn,
    description: service.description,
    price: service.price.toNumber(),
    duration: service.duration,
    isOnline: service.isOnline,
    isInPerson: service.isInPerson,
    assignedMemberId: service.assignedMemberId,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}
