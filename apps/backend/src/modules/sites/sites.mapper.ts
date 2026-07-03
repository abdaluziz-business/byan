import { Language, SectionsConfig, Site as SiteDto, SiteTheme } from '@bayan/shared';
import { Site as SiteEntity } from '@prisma/client';

export function toSiteDto(site: SiteEntity): SiteDto {
  return {
    id: site.id,
    clientId: site.clientId,
    theme: site.theme as unknown as SiteTheme,
    sections: site.sections as unknown as SectionsConfig,
    language: site.language as unknown as Language,
    domain: site.domain,
    isPublished: site.isPublished,
    createdAt: site.createdAt.toISOString(),
    updatedAt: site.updatedAt.toISOString(),
  };
}
