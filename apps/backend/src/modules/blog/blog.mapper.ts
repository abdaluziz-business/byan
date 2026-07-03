import { BlogPost as BlogPostDto } from '@bayan/shared';
import { BlogPost as BlogPostEntity } from '@prisma/client';

export function toBlogPostDto(post: BlogPostEntity): BlogPostDto {
  return {
    id: post.id,
    siteId: post.siteId,
    titleAr: post.titleAr,
    titleEn: post.titleEn,
    contentAr: post.contentAr,
    contentEn: post.contentEn,
    coverImage: post.coverImage,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    authorId: post.authorId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}
