export interface Station {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: 'active' | 'maintenance' | 'offline';
}
