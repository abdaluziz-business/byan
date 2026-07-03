import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { BlogPage } from '@/admin/pages/BlogPage';
import { BookingsPage } from '@/admin/pages/BookingsPage';
import { ContactMessagesPage } from '@/admin/pages/ContactMessagesPage';
import { DashboardPage } from '@/admin/pages/DashboardPage';
import { LoginPage } from '@/admin/pages/LoginPage';
import { ServicesPage } from '@/admin/pages/ServicesPage';
import { SiteSettingsPage } from '@/admin/pages/SiteSettingsPage';
import { TeamPage } from '@/admin/pages/TeamPage';
import { TestimonialsPage } from '@/admin/pages/TestimonialsPage';
import { getAccessToken } from '@/lib/auth';
import { SiteRenderer } from '@/site/SiteRenderer';

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!getAccessToken()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteRenderer />} />
        <Route path="/preview/:siteId" element={<SiteRenderer />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="site-settings" element={<SiteSettingsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="contact-messages" element={<ContactMessagesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
