import { BlogPost, Service, Site, TeamMember, Testimonial } from '@bayan/shared';

export interface SitePublicPayload {
  site: Site;
  teamMembers: TeamMember[];
  services: Service[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
}

export interface HeaderSectionProps {
  siteName: string;
  siteNameAr: string;
  logo: string;
}

export interface HeroSectionProps {
  siteName: string;
  siteNameAr: string;
  logo: string;
}

export interface AboutSectionProps {
  siteName: string;
  siteNameAr: string;
}

export interface ServicesSectionProps {
  services: Service[];
}

export interface TeamSectionProps {
  members: TeamMember[];
}

export interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export interface BlogSectionProps {
  posts: BlogPost[];
}

export interface ContactSectionProps {
  siteId: string;
}

export interface FooterSectionProps {
  siteName: string;
  siteNameAr: string;
}
