import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { toClientDto } from './clients.mapper';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return toClientDto(client);
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.prisma.client.update({ where: { id }, data: dto });
    return toClientDto(client);
  }
}
