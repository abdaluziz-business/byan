export interface ContactMessage {
  id: string;
  siteId: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  attachment: string | null;
  createdAt: string;
}
