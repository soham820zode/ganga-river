import { StationProfile } from '../types/simulation';

export const stationProfiles: Record<string, StationProfile> = {
  'JLP-HAR-01': {
    id: 'JLP-HAR-01',
    variabilityMultiplier: 0.8, // Stable
    baselines: {
      pH: 7.4,
      DO: 8.5,
      BOD: 1.2,
      Temperature: 18.0,
      Turbidity: 5.0
    }
  },
  'JLP-KAN-01': {
    id: 'JLP-KAN-01',
    variabilityMultiplier: 1.2, // More variable
    baselines: {
      pH: 7.1,
      DO: 6.0,
      BOD: 4.5,
      Temperature: 22.0,
      Turbidity: 15.0
    }
  },
  'JLP-PRY-01': {
    id: 'JLP-PRY-01',
    variabilityMultiplier: 1.0,
    baselines: {
      pH: 7.2,
      DO: 6.5,
      BOD: 3.5,
      Temperature: 24.0,
      Turbidity: 12.0
    }
  },
  'JLP-VAR-01': {
    id: 'JLP-VAR-01',
    variabilityMultiplier: 1.5, // High variability
    baselines: {
      pH: 7.0,
      DO: 5.5,
      BOD: 5.0,
      Temperature: 25.0,
      Turbidity: 20.0
    }
  },
  'JLP-PAT-01': {
    id: 'JLP-PAT-01',
    variabilityMultiplier: 1.1,
    baselines: {
      pH: 7.3,
      DO: 6.2,
      BOD: 4.0,
      Temperature: 23.0,
      Turbidity: 18.0
    }
  }
};
