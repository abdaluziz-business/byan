import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Testimonial } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { SitesService } from '../sites/sites.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { toTestimonialDto } from './testimonials.mapper';

@Injectable()
export class TestimonialsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sitesService: SitesService,
  ) {}

  async submit(siteId: string, dto: CreateTestimonialDto): Promise<Testimonial> {
    const testimonial = await this.prisma.testimonial.create({
      data: { ...dto, siteId, isApproved: false },
    });

    return toTestimonialDto(testimonial);
  }

  async findApprovedForSite(siteId: string): Promise<Testimonial[]> {
    const testimonials = await this.prisma.testimonial.findMany({
      where: { siteId, isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    return testimonials.map(toTestimonialDto);
  }

  async findAllForSite(siteId: string, clientId: string): Promise<Testimonial[]> {
    await this.sitesService.ensureOwnership(siteId, clientId);

    const testimonials = await this.prisma.testimonial.findMany({
      where: { siteId },
      orderBy: { createdAt: 'desc' },
    });

    return testimonials.map(toTestimonialDto);
  }

  async update(id: string, clientId: string, dto: UpdateTestimonialDto): Promise<Testimonial> {
    await this.ensureOwnership(id, clientId);
    const testimonial = await this.prisma.testimonial.update({ where: { id }, data: dto });
    return toTestimonialDto(testimonial);
  }

  async remove(id: string, clientId: string): Promise<void> {
    await this.ensureOwnership(id, clientId);
    await this.prisma.testimonial.delete({ where: { id } });
  }

  private async ensureOwnership(testimonialId: string, clientId: string): Promise<void> {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id: testimonialId },
      include: { site: true },
    });

    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    if (testimonial.site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this testimonial');
    }
  }
}
