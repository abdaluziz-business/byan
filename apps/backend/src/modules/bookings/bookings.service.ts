import { InjectQueue } from '@nestjs/bullmq';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Booking } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { EMAIL_QUEUE, EmailJob } from '../../queue/queue.constants';
import { toBookingDto } from './bookings.mapper';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
  ) {}

  async create(dto: CreateBookingDto): Promise<Booking> {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const booking = await this.prisma.booking.create({
      data: {
        serviceId: dto.serviceId,
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientPhone: dto.clientPhone,
        date: new Date(dto.date),
        time: dto.time,
        notes: dto.notes,
      },
    });

    await this.emailQueue.add(EmailJob.BOOKING_CONFIRMATION, {
      to: dto.clientEmail,
      subject: 'Booking received',
      html: `<p>Hi ${dto.clientName}, your booking for "${service.nameEn}" on ${dto.date} at ${dto.time} has been received.</p>`,
    });

    return toBookingDto(booking);
  }

  async findAllForSite(siteId: string, clientId: string): Promise<Booking[]> {
    await this.ensureSiteOwnership(siteId, clientId);

    const bookings = await this.prisma.booking.findMany({
      where: { service: { siteId } },
      orderBy: { date: 'desc' },
    });

    return bookings.map(toBookingDto);
  }

  async updateStatus(id: string, clientId: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    await this.ensureBookingOwnership(id, clientId);
    const booking = await this.prisma.booking.update({ where: { id }, data: dto });
    return toBookingDto(booking);
  }

  async remove(id: string, clientId: string): Promise<void> {
    await this.ensureBookingOwnership(id, clientId);
    await this.prisma.booking.delete({ where: { id } });
  }

  private async ensureSiteOwnership(siteId: string, clientId: string): Promise<void> {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    if (site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this site');
    }
  }

  private async ensureBookingOwnership(bookingId: string, clientId: string): Promise<void> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: { include: { site: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.service.site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this booking');
    }
  }
}
