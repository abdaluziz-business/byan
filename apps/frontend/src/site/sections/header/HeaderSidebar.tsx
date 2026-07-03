import { useState } from 'react';
import { useI18n } from '@/i18n/i18nContext';
import { HeaderSectionProps } from '@/site/types';

export function HeaderSidebar({ siteName, siteNameAr, logo }: HeaderSectionProps) {
  const [open, setOpen] = useState(false);
  const { language, t } = useI18n();
  const displayName = language === 'ar' ? siteNameAr : siteName;

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-border px-3 py-2 text-sm text-text"
        >
          ☰
        </button>
        <span className="font-heading text-lg font-bold text-text">{displayName}</span>
        {logo ? <img src={logo} alt={displayName} className="h-8 w-8 rounded object-cover" /> : <span className="w-8" />}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex w-64 flex-col gap-4 bg-surface p-6 rtl:mr-auto ltr:ml-auto"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="self-end text-sm text-text-muted"
            >
              {t.common.close}
            </button>
            <a href="#services" className="text-text hover:text-cta">
              {t.site.ourServices}
            </a>
            <a href="#team" className="text-text hover:text-cta">
              {t.site.ourTeam}
            </a>
            <a href="#contact" className="text-text hover:text-cta">
              {t.site.contactUs}
            </a>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
