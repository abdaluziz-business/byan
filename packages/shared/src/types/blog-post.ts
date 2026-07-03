export interface BlogPost {
  id: string;
  siteId: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  coverImage: string | null;
  publishedAt: string | null;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}
