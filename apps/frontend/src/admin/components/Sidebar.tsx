import { NavLink } from 'react-router-dom';
import { useI18n } from '@/i18n/i18nContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', key: 'dashboard' } as const,
  { to: '/admin/site-settings', key: 'siteSettings' } as const,
  { to: '/admin/services', key: 'services' } as const,
  { to: '/admin/bookings', key: 'bookings' } as const,
  { to: '/admin/team', key: 'team' } as const,
  { to: '/admin/testimonials', key: 'testimonials' } as const,
  { to: '/admin/blog', key: 'blog' } as const,
  { to: '/admin/contact-messages', key: 'contactMessages' } as const,
];

export function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="hidden w-60 shrink-0 border-e border-neutral-200 bg-white md:block">
      <div className="px-6 py-5">
        <span className="font-heading text-lg font-bold text-[#111111]">بيان Bayan</span>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive ? 'bg-[#111111] text-white' : 'text-neutral-600 hover:bg-neutral-100'
              }`
            }
          >
            {t.admin[item.key]}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
