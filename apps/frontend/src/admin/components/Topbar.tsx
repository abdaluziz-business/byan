import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/i18nContext';
import { clearTokens } from '@/lib/auth';
import { Button } from './Button';

export function Topbar() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();

  function handleLogout() {
    clearTokens();
    navigate('/admin/login');
  }

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
      <div />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="text-sm text-neutral-500 hover:text-[#111111]"
        >
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
        <Button variant="secondary" onClick={handleLogout}>
          {t.auth.logout}
        </Button>
      </div>
    </header>
  );
}
