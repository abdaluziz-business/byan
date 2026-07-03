export interface Testimonial {
  id: string;
  siteId: string;
  authorName: string;
  rating: number;
  content: string;
  avatar: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
