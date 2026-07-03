export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  whatsapp?: string;
  website?: string;
}

export interface TeamMember {
  id: string;
  siteId: string;
  nameAr: string;
  nameEn: string;
  role: string;
  bio: string | null;
  image: string | null;
  socialLinks: SocialLinks | null;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}
