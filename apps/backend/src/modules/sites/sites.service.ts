import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Site } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { toBlogPostDto } from '../blog/blog.mapper';
import { toServiceDto } from '../services/services.mapper';
import { toTeamMemberDto } from '../team/team.mapper';
import { toTestimonialDto } from '../testimonials/testimonials.mapper';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { toSiteDto } from './sites.mapper';

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(clientId: string, dto: CreateSiteDto): Promise<Site> {
    const site = await this.prisma.site.create({
      data: {
        clientId,
        theme: dto.theme as object,
        sections: dto.sections as object,
        language: dto.language,
        domain: dto.domain,
      },
    });

    return toSiteDto(site);
  }

  async findAllForClient(clientId: string): Promise<Site[]> {
    const sites = await this.prisma.site.findMany({ where: { clientId }, orderBy: { createdAt: 'asc' } });
    return sites.map(toSiteDto);
  }

  async findOneOwned(id: string, clientId: string): Promise<Site> {
    const site = await this.ensureOwnership(id, clientId);
    return toSiteDto(site);
  }

  async update(id: string, clientId: string, dto: UpdateSiteDto): Promise<Site> {
    await this.ensureOwnership(id, clientId);

    const site = await this.prisma.site.update({
      where: { id },
      data: {
        ...(dto.theme && { theme: dto.theme as object }),
        ...(dto.sections && { sections: dto.sections as object }),
        ...(dto.language && { language: dto.language }),
        ...(dto.domain !== undefined && { domain: dto.domain }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
    });

    return toSiteDto(site);
  }

  async remove(id: string, clientId: string): Promise<void> {
    await this.ensureOwnership(id, clientId);
    await this.prisma.site.delete({ where: { id } });
  }

  /** Aggregates everything SiteRenderer needs to render a published live site. */
  async getPublicSiteByDomain(domain: string) {
    const site = await this.prisma.site.findFirst({ where: { domain, isPublished: true } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    return this.buildPublicPayload(site.id);
  }

  async getPublicSiteById(id: string) {
    const site = await this.prisma.site.findFirst({ where: { id, isPublished: true } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    return this.buildPublicPayload(site.id);
  }

  private async buildPublicPayload(siteId: string) {
    const [site, teamMembers, services, testimonials, blogPosts] = await Promise.all([
      this.prisma.site.findUniqueOrThrow({ where: { id: siteId } }),
      this.prisma.teamMember.findMany({ where: { siteId } }),
      this.prisma.service.findMany({ where: { siteId } }),
      this.prisma.testimonial.findMany({ where: { siteId, isApproved: true } }),
      this.prisma.blogPost.findMany({ where: { siteId, publishedAt: { not: null } } }),
    ]);

    return {
      site: toSiteDto(site),
      teamMembers: teamMembers.map(toTeamMemberDto),
      services: services.map(toServiceDto),
      testimonials: testimonials.map(toTestimonialDto),
      blogPosts: blogPosts.map(toBlogPostDto),
    };
  }

  async ensureOwnership(siteId: string, clientId: string) {
    const site = await this.prisma.site.findUnique({ where: { id: siteId } });

    if (!site) {
      throw new NotFoundException('Site not found');
    }

    if (site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this site');
    }

    return site;
  }
}
