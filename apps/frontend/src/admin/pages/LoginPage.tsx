import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthResponse } from '@bayan/shared';
import { Button } from '@/admin/components/Button';
import { Card } from '@/admin/components/Card';
import { Input } from '@/admin/components/Input';
import { useI18n } from '@/i18n/i18nContext';
import { api } from '@/lib/api';
import { setTokens } from '@/lib/auth';

export function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      navigate('/admin/dashboard');
    },
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50" dir="ltr">
      <Card className="w-full max-w-sm">
        <h1 className="mb-6 text-center font-heading text-xl font-bold text-[#111111]">{t.auth.loginTitle}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            label={t.auth.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label={t.auth.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mutation.isError && <p className="text-sm text-red-600">{t.auth.invalidCredentials}</p>}
          <Button type="submit" disabled={mutation.isPending}>
            {t.auth.login}
          </Button>
        </form>
      </Card>
    </div>
  );
}
