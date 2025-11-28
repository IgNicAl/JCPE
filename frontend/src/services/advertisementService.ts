import api from './api';
import { Advertisement, AdvertisementFormData } from '@/types/advertisement';

const MOCK_ADS: Advertisement[] = [
  {
    id: '1',
    title: 'Anúncio Demo 1',
    imageUrl: 'https://placehold.co/350x180/0066cc/white?text=Anúncio+1',
    linkUrl: 'https://example.com',
    width: 350,
    height: 180,
    location: 'id',
    isActive: true,
    clickCount: 150,
    impressionCount: 5000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Anúncio Demo 2',
    imageUrl: 'https://placehold.co/350x180/cc0066/white?text=Anúncio+2',
    linkUrl: 'https://example.com',
    width: 350,
    height: 180,
    location: 'class',
    isActive: true,
    clickCount: 89,
    impressionCount: 3200,
    createdAt: new Date().toISOString(),
  },
];

class AdvertisementService {
  private baseUrl = '/advertisements';
  private useMock = true; // Altere para false quando o backend estiver pronto

  async getAll(): Promise<Advertisement[]> {
    if (this.useMock) {
      return Promise.resolve([...MOCK_ADS]);
    }
    const response = await api.get<Advertisement[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: string): Promise<Advertisement> {
    if (this.useMock) {
      const ad = MOCK_ADS.find(a => a.id === id);
      if (!ad) throw new Error('Advertisement not found');
      return Promise.resolve({ ...ad });
    }
    const response = await api.get<Advertisement>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getByLocation(location: 'id' | 'class'): Promise<Advertisement[]> {
    if (this.useMock) {
      const filtered = MOCK_ADS.filter(ad => ad.isActive && ad.location === location);
      return Promise.resolve([...filtered]);
    }
    const response = await api.get<Advertisement[]>(`${this.baseUrl}/location/${location}`);
    return response.data;
  }

  async create(data: AdvertisementFormData): Promise<Advertisement> {
    if (this.useMock) {
      const newAd: Advertisement = {
        ...data,
        id: String(MOCK_ADS.length + 1),
        clickCount: 0,
        impressionCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_ADS.push(newAd);
      return Promise.resolve({ ...newAd });
    }
    const response = await api.post<Advertisement>(this.baseUrl, data);
    return response.data;
  }

  async update(id: string, data: AdvertisementFormData): Promise<Advertisement> {
    if (this.useMock) {
      const index = MOCK_ADS.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Advertisement not found');
      
      const updatedAd = {
        ...MOCK_ADS[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      MOCK_ADS[index] = updatedAd;
      return Promise.resolve({ ...updatedAd });
    }
    const response = await api.put<Advertisement>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    if (this.useMock) {
      const index = MOCK_ADS.findIndex(a => a.id === id);
      if (index !== -1) {
        MOCK_ADS.splice(index, 1);
      }
      return Promise.resolve();
    }
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async trackClick(id: string): Promise<void> {
    if (this.useMock) {
      const ad = MOCK_ADS.find(a => a.id === id);
      if (ad && ad.clickCount !== undefined) {
        ad.clickCount++;
      }
      return Promise.resolve();
    }
    await api.post(`${this.baseUrl}/${id}/click`);
  }

  async trackImpression(id: string): Promise<void> {
    if (this.useMock) {
      const ad = MOCK_ADS.find(a => a.id === id);
      if (ad && ad.impressionCount !== undefined) {
        ad.impressionCount++;
      }
      return Promise.resolve();
    }
    await api.post(`${this.baseUrl}/${id}/impression`);
  }
}

export const advertisementService = new AdvertisementService();
