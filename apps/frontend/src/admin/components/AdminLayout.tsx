import { Outlet } from 'react-router-dom';
import { useI18n } from '@/i18n/i18nContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminLayout() {
  const { language } = useI18n();

  return (
    <div className="flex min-h-screen bg-neutral-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
