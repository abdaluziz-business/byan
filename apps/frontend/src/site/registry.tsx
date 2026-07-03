import { ReactNode } from 'react';
import { SectionKey } from '@bayan/shared';
import { AboutDefault } from './sections/about';
import { AchievementsCounter } from './sections/achievements';
import { BlogGrid } from './sections/blog';
import { ContactForm } from './sections/contact';
import { FooterSimple } from './sections/footer';
import { GalleryGrid } from './sections/gallery';
import { HeaderClassic, HeaderMinimal, HeaderSidebar } from './sections/header';
import { HeroImage, HeroText, HeroVideo } from './sections/hero';
import { HowWeWorkSteps } from './sections/how-we-work';
import { ServicesGrid } from './sections/services';
import { TeamGrid } from './sections/team';
import { TestimonialsSlider } from './sections/testimonials';
import { TrustBadges } from './sections/trust';
import { SitePublicPayload } from './types';

type SectionRenderer = (payload: SitePublicPayload) => ReactNode;

/**
 * Maps each section key + variant to the component that renders it. Adding a
 * new variant means writing the component and registering it here — nothing
 * else in the renderer needs to change.
 */
export const SECTION_REGISTRY: Record<SectionKey, Record<string, SectionRenderer>> = {
  header: {
    classic: ({ site }) => (
      <HeaderClassic siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} logo={site.theme.logo} />
    ),
    minimal: ({ site }) => (
      <HeaderMinimal siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} logo={site.theme.logo} />
    ),
    sidebar: ({ site }) => (
      <HeaderSidebar siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} logo={site.theme.logo} />
    ),
  },
  hero: {
    text: ({ site }) => (
      <HeroText siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} logo={site.theme.logo} />
    ),
    image: ({ site }) => (
      <HeroImage siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} logo={site.theme.logo} />
    ),
    video: ({ site }) => (
      <HeroVideo siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} logo={site.theme.logo} />
    ),
  },
  about: {
    default: ({ site }) => <AboutDefault siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} />,
  },
  services: {
    grid: ({ services }) => <ServicesGrid services={services} />,
  },
  team: {
    grid: ({ teamMembers }) => <TeamGrid members={teamMembers} />,
  },
  testimonials: {
    slider: ({ testimonials }) => <TestimonialsSlider testimonials={testimonials} />,
  },
  achievements: {
    counter: () => <AchievementsCounter />,
  },
  gallery: {
    grid: () => <GalleryGrid />,
  },
  trust: {
    badges: () => <TrustBadges />,
  },
  'how-we-work': {
    steps: () => <HowWeWorkSteps />,
  },
  blog: {
    grid: ({ blogPosts }) => <BlogGrid posts={blogPosts} />,
  },
  contact: {
    form: ({ site }) => <ContactForm siteId={site.id} />,
  },
  footer: {
    simple: ({ site }) => <FooterSimple siteName={site.theme.siteName} siteNameAr={site.theme.siteNameAr} />,
  },
};
