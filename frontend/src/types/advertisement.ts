export interface Advertisement {
  id?: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  width: number;
  height: number;
  location: 'id' | 'class'; // 'id' para sidebar-widget ad-widget (ID), 'class' para class="sidebar-widget ad-widget"
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  clickCount?: number;
  impressionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdvertisementFormData {
  title: string;
  imageUrl: string;
  linkUrl: string;
  width: number;
  height: number;
  location: 'id' | 'class';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}
