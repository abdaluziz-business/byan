import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeConfig } from '@/theme/ThemeTypes';
import { useTheme } from '@/theme/ThemeContext';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';
import { SECTION_REGISTRY } from './registry';
import { SitePublicPayload } from './types';

function toThemeConfig(site: SitePublicPayload['site']): ThemeConfig {
  const language = site.language.toLowerCase() as 'ar' | 'en';

  return {
    clientId: site.clientId,
    language,
    direction: language === 'ar' ? 'rtl' : 'ltr',
    mode: site.theme.mode,
    colors: site.theme.colors,
    fonts: site.theme.fonts,
    logo: site.theme.logo,
    siteName: site.theme.siteName,
    siteNameAr: site.theme.siteNameAr,
    sections: site.sections,
  };
}

async function fetchSite(siteId: string | undefined, domain: string): Promise<SitePublicPayload> {
  const url = siteId ? `/public/sites/${siteId}` : `/public/sites/by-domain/${domain}`;
  const response = await api.get<SitePublicPayload>(url);
  return response.data;
}

export function SiteRenderer() {
  const { siteId } = useParams();
  const { setTheme } = useTheme();
  const { setLanguage } = useI18n();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public-site', siteId ?? window.location.hostname],
    queryFn: () => fetchSite(siteId, window.location.hostname),
  });

  useEffect(() => {
    if (data) {
      const themeConfig = toThemeConfig(data.site);
      setTheme(themeConfig);
      setLanguage(themeConfig.language);
    }
  }, [data, setTheme, setLanguage]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text-muted">Loading…</div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text-muted">
        Site not found
      </div>
    );
  }

  const orderedSections = Object.entries(data.site.sections)
    .filter(([, config]) => config.enabled)
    .sort((a, b) => a[1].order - b[1].order);

  return (
    <div className="min-h-screen bg-background">
      {orderedSections.map(([key, config]) => {
        const renderSection = SECTION_REGISTRY[key as keyof typeof SECTION_REGISTRY]?.[config.variant];
        return renderSection ? <div key={key}>{renderSection(data)}</div> : null;
      })}
    </div>
  );
}
