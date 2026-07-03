import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Language, SectionsConfig, Site, SiteTheme } from '@bayan/shared';
import { Button } from '@/admin/components/Button';
import { Card } from '@/admin/components/Card';
import { Input } from '@/admin/components/Input';
import { useCurrentSite } from '@/admin/components/useCurrentSite';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';

interface SectionCatalogEntry {
  key: string;
  labelAr: string;
  labelEn: string;
  variants: { value: string; labelAr: string; labelEn: string }[];
}

const COLOR_FIELDS: (keyof SiteTheme['colors'])[] = [
  'primary',
  'secondary',
  'background',
  'surface',
  'text',
  'textMuted',
  'border',
  'cta',
  'ctaText',
];

export function SiteSettingsPage() {
  const { t, language } = useI18n();
  const { site } = useCurrentSite();
  const queryClient = useQueryClient();

  const [theme, setTheme] = useState<SiteTheme | null>(null);
  const [sections, setSections] = useState<SectionsConfig | null>(null);
  const [siteLanguage, setSiteLanguage] = useState<Language>(Language.AR);
  const [domain, setDomain] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  const catalogQuery = useQuery({
    queryKey: ['section-catalog'],
    queryFn: async () => (await api.get<SectionCatalogEntry[]>('/sections/catalog')).data,
  });

  useEffect(() => {
    if (site) {
      setTheme(site.theme);
      setSections(site.sections);
      setSiteLanguage(site.language);
      setDomain(site.domain ?? '');
      setIsPublished(site.isPublished);
    }
  }, [site]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch<Site>(`/sites/${site!.id}`, {
        theme,
        sections,
        language: siteLanguage,
        domain: domain || undefined,
        isPublished,
      });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sites'] }),
  });

  if (!theme || !sections) {
    return <p className="text-neutral-500">{t.common.loading}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-[#111111]">{t.admin.siteSettings}</h1>

      <Card>
        <h2 className="mb-4 font-heading text-lg font-semibold text-[#111111]">{t.admin.theme}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t.auth.businessName + ' (EN)'}
            value={theme.siteName}
            onChange={(e) => setTheme({ ...theme, siteName: e.target.value })}
          />
          <Input
            label={t.auth.businessName + ' (AR)'}
            value={theme.siteNameAr}
            onChange={(e) => setTheme({ ...theme, siteNameAr: e.target.value })}
          />
          <Input label="Logo URL" value={theme.logo} onChange={(e) => setTheme({ ...theme, logo: e.target.value })} />
          <label className="flex flex-col gap-1 text-sm text-[#111111]">
            <span className="font-medium">Mode</span>
            <select
              value={theme.mode}
              onChange={(e) => setTheme({ ...theme, mode: e.target.value as SiteTheme['mode'] })}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COLOR_FIELDS.map((field) => (
            <label key={field} className="flex items-center justify-between gap-2 text-sm text-[#111111]">
              <span>{field}</span>
              <input
                type="color"
                value={theme.colors[field]}
                onChange={(e) => setTheme({ ...theme, colors: { ...theme.colors, [field]: e.target.value } })}
                className="h-8 w-12 cursor-pointer rounded border border-neutral-300"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-heading text-lg font-semibold text-[#111111]">Publishing</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-[#111111]">
            <span className="font-medium">Language</span>
            <select
              value={siteLanguage}
              onChange={(e) => setSiteLanguage(e.target.value as Language)}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2"
            >
              <option value={Language.AR}>العربية</option>
              <option value={Language.EN}>English</option>
            </select>
          </label>
          <Input label="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-[#111111]">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Published
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-heading text-lg font-semibold text-[#111111]">{t.admin.sections}</h2>
        <div className="flex flex-col gap-3">
          {catalogQuery.data?.map((entry) => {
            const config = sections[entry.key] ?? { enabled: false, variant: entry.variants[0]?.value, order: 0 };

            return (
              <div
                key={entry.key}
                className="flex flex-wrap items-center gap-4 rounded-md border border-neutral-200 p-3"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-[#111111]">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) =>
                      setSections({ ...sections, [entry.key]: { ...config, enabled: e.target.checked } })
                    }
                  />
                  {language === 'ar' ? entry.labelAr : entry.labelEn}
                </label>
                <select
                  value={config.variant}
                  onChange={(e) => setSections({ ...sections, [entry.key]: { ...config, variant: e.target.value } })}
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm"
                >
                  {entry.variants.map((variant) => (
                    <option key={variant.value} value={variant.value}>
                      {language === 'ar' ? variant.labelAr : variant.labelEn}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={config.order}
                  onChange={(e) =>
                    setSections({ ...sections, [entry.key]: { ...config, order: Number(e.target.value) } })
                  }
                  className="w-20 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm"
                />
              </div>
            );
          })}
        </div>
      </Card>

      <div>
        <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
          {t.common.save}
        </Button>
      </div>
    </div>
  );
}
