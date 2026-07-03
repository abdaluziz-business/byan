import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { SitesService } from '../sites/sites.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { toServiceDto } from './services.mapper';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sitesService: SitesService,
  ) {}

  async create(siteId: string, clientId: string, dto: CreateServiceDto): Promise<Service> {
    await this.sitesService.ensureOwnership(siteId, clientId);

    const service = await this.prisma.service.create({
      data: { ...dto, siteId },
    });

    return toServiceDto(service);
  }

  async findAllForSite(siteId: string): Promise<Service[]> {
    const services = await this.prisma.service.findMany({ where: { siteId }, orderBy: { createdAt: 'asc' } });
    return services.map(toServiceDto);
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.prisma.service.findUnique({ where: { id } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return toServiceDto(service);
  }

  async update(id: string, clientId: string, dto: UpdateServiceDto): Promise<Service> {
    await this.ensureOwnership(id, clientId);
    const service = await this.prisma.service.update({ where: { id }, data: dto });
    return toServiceDto(service);
  }

  async remove(id: string, clientId: string): Promise<void> {
    await this.ensureOwnership(id, clientId);
    await this.prisma.service.delete({ where: { id } });
  }

  private async ensureOwnership(serviceId: string, clientId: string): Promise<void> {
    const service = await this.prisma.service.findUnique({ where: { id: serviceId }, include: { site: true } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this service');
    }
  }
}
