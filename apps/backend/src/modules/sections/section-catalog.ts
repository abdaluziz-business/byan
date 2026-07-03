import { SectionKey } from '@bayan/shared';

export interface SectionVariantOption {
  value: string;
  labelAr: string;
  labelEn: string;
}

export interface SectionCatalogEntry {
  key: SectionKey;
  labelAr: string;
  labelEn: string;
  variants: SectionVariantOption[];
}

/**
 * Static catalog of section keys and their available variants. Drives the
 * admin "customize site" UI and is mirrored by the frontend section registry.
 */
export const SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    key: 'header',
    labelAr: 'الرأس',
    labelEn: 'Header',
    variants: [
      { value: 'classic', labelAr: 'كلاسيكي', labelEn: 'Classic' },
      { value: 'minimal', labelAr: 'بسيط', labelEn: 'Minimal' },
      { value: 'sidebar', labelAr: 'قائمة جانبية', labelEn: 'Sidebar' },
    ],
  },
  {
    key: 'hero',
    labelAr: 'المقدمة',
    labelEn: 'Hero',
    variants: [
      { value: 'text', labelAr: 'نصي', labelEn: 'Text' },
      { value: 'image', labelAr: 'صورة', labelEn: 'Image' },
      { value: 'video', labelAr: 'فيديو', labelEn: 'Video' },
    ],
  },
  {
    key: 'about',
    labelAr: 'من نحن',
    labelEn: 'About',
    variants: [{ value: 'default', labelAr: 'افتراضي', labelEn: 'Default' }],
  },
  {
    key: 'services',
    labelAr: 'الخدمات',
    labelEn: 'Services',
    variants: [{ value: 'grid', labelAr: 'شبكة', labelEn: 'Grid' }],
  },
  {
    key: 'team',
    labelAr: 'الفريق',
    labelEn: 'Team',
    variants: [{ value: 'grid', labelAr: 'شبكة', labelEn: 'Grid' }],
  },
  {
    key: 'testimonials',
    labelAr: 'آراء العملاء',
    labelEn: 'Testimonials',
    variants: [{ value: 'slider', labelAr: 'شرائح', labelEn: 'Slider' }],
  },
  {
    key: 'achievements',
    labelAr: 'الإنجازات',
    labelEn: 'Achievements',
    variants: [{ value: 'counter', labelAr: 'عدّاد', labelEn: 'Counter' }],
  },
  {
    key: 'gallery',
    labelAr: 'معرض الصور',
    labelEn: 'Gallery',
    variants: [{ value: 'grid', labelAr: 'شبكة', labelEn: 'Grid' }],
  },
  {
    key: 'trust',
    labelAr: 'شركاء الثقة',
    labelEn: 'Trust badges',
    variants: [{ value: 'badges', labelAr: 'شارات', labelEn: 'Badges' }],
  },
  {
    key: 'how-we-work',
    labelAr: 'كيف نعمل',
    labelEn: 'How we work',
    variants: [{ value: 'steps', labelAr: 'خطوات', labelEn: 'Steps' }],
  },
  {
    key: 'blog',
    labelAr: 'المدونة',
    labelEn: 'Blog',
    variants: [{ value: 'grid', labelAr: 'شبكة', labelEn: 'Grid' }],
  },
  {
    key: 'contact',
    labelAr: 'تواصل معنا',
    labelEn: 'Contact',
    variants: [{ value: 'form', labelAr: 'نموذج', labelEn: 'Form' }],
  },
  {
    key: 'footer',
    labelAr: 'التذييل',
    labelEn: 'Footer',
    variants: [{ value: 'simple', labelAr: 'بسيط', labelEn: 'Simple' }],
  },
];
