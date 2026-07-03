import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ContactMessage } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { EMAIL_QUEUE, EmailJob } from '../../queue/queue.constants';
import { SitesService } from '../sites/sites.service';
import { toContactMessageDto } from './contact.mapper';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sitesService: SitesService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async submit(siteId: string, dto: CreateContactMessageDto): Promise<ContactMessage> {
    const site = await this.prisma.site.findUnique({ where: { id: siteId }, include: { client: true } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    const message = await this.prisma.contactMessage.create({ data: { ...dto, siteId } });

    await this.emailQueue.add(EmailJob.CONTACT_NOTIFICATION, {
      to: site.client.email,
      subject: `New contact message from ${dto.name}`,
      html: `<p><strong>${dto.name}</strong> (${dto.email}) wrote:</p><p>${dto.message}</p>`,
    });

    return toContactMessageDto(message);
  }

  async findAllForSite(siteId: string, clientId: string): Promise<ContactMessage[]> {
    await this.sitesService.ensureOwnership(siteId, clientId);

    const messages = await this.prisma.contactMessage.findMany({
      where: { siteId },
      orderBy: { createdAt: 'desc' },
    });

    return messages.map(toContactMessageDto);
  }
}
