import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider } from '@/i18n/i18nContext';
import { AppRouter } from '@/router';
import { ThemeProvider } from '@/theme/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AppRouter />
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
