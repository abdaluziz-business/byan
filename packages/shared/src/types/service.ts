export interface Service {
  id: string;
  siteId: string;
  nameAr: string;
  nameEn: string;
  description: string | null;
  price: number;
  duration: number;
  isOnline: boolean;
  isInPerson: boolean;
  assignedMemberId: string | null;
  createdAt: string;
  updatedAt: string;
}
