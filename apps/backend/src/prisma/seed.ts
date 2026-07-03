import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const password = await bcrypt.hash('Passw0rd!', 10);

  const client = await prisma.client.upsert({
    where: { email: 'demo@bayan.sa' },
    update: {},
    create: {
      email: 'demo@bayan.sa',
      password,
      businessName: 'Bayan Demo Business',
      plan: 'PRO',
    },
  });

  const site = await prisma.site.upsert({
    where: { id: 'seed-site-id' },
    update: {},
    create: {
      id: 'seed-site-id',
      clientId: client.id,
      language: 'AR',
      isPublished: true,
      theme: {
        mode: 'light',
        colors: {
          primary: '#0F172A',
          secondary: '#1E293B',
          background: '#FFFFFF',
          surface: '#F8FAFC',
          text: '#0F172A',
          textMuted: '#64748B',
          border: '#E2E8F0',
          cta: '#2563EB',
          ctaText: '#FFFFFF',
        },
        fonts: { heading: 'Tajawal', body: 'Tajawal' },
        logo: '',
        siteName: 'Bayan Demo',
        siteNameAr: 'بيان التجريبي',
      },
      sections: {
        header: { enabled: true, variant: 'classic', order: 0 },
        hero: { enabled: true, variant: 'text', order: 1 },
        services: { enabled: true, variant: 'grid', order: 2 },
        team: { enabled: true, variant: 'grid', order: 3 },
        testimonials: { enabled: true, variant: 'slider', order: 4 },
        contact: { enabled: true, variant: 'form', order: 5 },
        footer: { enabled: true, variant: 'simple', order: 6 },
      },
    },
  });

  console.log({ client: client.email, site: site.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
