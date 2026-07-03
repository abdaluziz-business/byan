import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogPost } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { SitesService } from '../sites/sites.service';
import { toBlogPostDto } from './blog.mapper';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sitesService: SitesService,
  ) {}

  async create(siteId: string, clientId: string, dto: CreateBlogPostDto): Promise<BlogPost> {
    await this.sitesService.ensureOwnership(siteId, clientId);
    const { publishNow, ...rest } = dto;

    const post = await this.prisma.blogPost.create({
      data: { ...rest, siteId, publishedAt: publishNow ? new Date() : null },
    });

    return toBlogPostDto(post);
  }

  async findPublishedForSite(siteId: string): Promise<BlogPost[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: { siteId, publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
    });

    return posts.map(toBlogPostDto);
  }

  async findAllForSite(siteId: string, clientId: string): Promise<BlogPost[]> {
    await this.sitesService.ensureOwnership(siteId, clientId);

    const posts = await this.prisma.blogPost.findMany({ where: { siteId }, orderBy: { createdAt: 'desc' } });
    return posts.map(toBlogPostDto);
  }

  async update(id: string, clientId: string, dto: UpdateBlogPostDto): Promise<BlogPost> {
    await this.ensureOwnership(id, clientId);
    const { publishNow, ...rest } = dto;

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: { ...rest, ...(publishNow !== undefined && { publishedAt: publishNow ? new Date() : null }) },
    });

    return toBlogPostDto(post);
  }

  async remove(id: string, clientId: string): Promise<void> {
    await this.ensureOwnership(id, clientId);
    await this.prisma.blogPost.delete({ where: { id } });
  }

  private async ensureOwnership(postId: string, clientId: string): Promise<void> {
    const post = await this.prisma.blogPost.findUnique({ where: { id: postId }, include: { site: true } });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    if (post.site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this blog post');
    }
  }
}
