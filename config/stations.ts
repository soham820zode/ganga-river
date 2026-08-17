export type StationStatus = 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'SIMULATED';

export interface MockStation {
  id: string;
  name: string;
  shortName: string;
  position: [number, number, number]; // 3D position for Digital Twin
  latitude: number;  // 2D Map coordinate
  longitude: number; // 2D Map coordinate
  region: string;
  status: StationStatus;
  lastUpdated: string;
  availableParameters: string[];
}

export const MOCK_STATIONS: MockStation[] = [
  { 
    id: 'JLP-HAR-01', 
    name: 'Haridwar', 
    shortName: 'HAR',
    position: [-4, 2, -2], 
    latitude: 29.9457,
    longitude: 78.1642,
    region: 'Uttarakhand',
    status: 'SIMULATED',
    lastUpdated: 'Updated moments ago',
    availableParameters: ['pH', 'DO', 'BOD', 'TEMP', 'TURBIDITY']
  },
  { 
    id: 'JLP-KAN-01', 
    name: 'Kanpur', 
    shortName: 'KAN',
    position: [-1, 0.5, 0], 
    latitude: 26.4499,
    longitude: 80.3319,
    region: 'Uttar Pradesh',
    status: 'SIMULATED',
    lastUpdated: 'Updated moments ago',
    availableParameters: ['pH', 'DO', 'BOD', 'TEMP']
  },
  { 
    id: 'JLP-PRY-01', 
    name: 'Prayagraj', 
    shortName: 'PRY',
    position: [1, -0.5, 1], 
    latitude: 25.4358,
    longitude: 81.8463,
    region: 'Uttar Pradesh',
    status: 'SIMULATED',
    lastUpdated: 'Updated moments ago',
    availableParameters: ['pH', 'DO', 'BOD', 'TEMP', 'TURBIDITY']
  },
  { 
    id: 'JLP-VAR-01', 
    name: 'Varanasi', 
    shortName: 'VAR',
    position: [3, -1, 1.5], 
    latitude: 25.3176,
    longitude: 83.0062,
    region: 'Uttar Pradesh',
    status: 'SIMULATED',
    lastUpdated: 'Updated moments ago',
    availableParameters: ['pH', 'DO', 'BOD', 'TEMP', 'COLIFORM']
  },
  { 
    id: 'JLP-PAT-01', 
    name: 'Patna', 
    shortName: 'PAT',
    position: [5, -1.5, 2], 
    latitude: 25.5941,
    longitude: 85.1376,
    region: 'Bihar',
    status: 'SIMULATED',
    lastUpdated: 'Updated moments ago',
    availableParameters: ['pH', 'DO', 'TEMP']
  },
];
