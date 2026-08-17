import { ParameterType } from '../types/water-quality';

export interface ParameterMetadata {
  key: ParameterType;
  displayName: string;
  description: string;
  unit: string;
  decimals: number;
  reference: string;
}

export const PARAMETER_METADATA: Record<ParameterType, ParameterMetadata> = {
  pH: {
    key: 'pH',
    displayName: 'pH Level',
    description: 'Measure of how acidic/basic water is. Important for aquatic life.',
    unit: 'pH',
    decimals: 2,
    reference: '6.5–8.5'
  },
  DO: {
    key: 'DO',
    displayName: 'Dissolved Oxygen',
    description: 'Amount of oxygen available to living aquatic organisms.',
    unit: 'mg/L',
    decimals: 2,
    reference: '≥ 4.0 mg/L'
  },
  BOD: {
    key: 'BOD',
    displayName: 'Biochemical Oxygen Demand',
    description: 'Amount of dissolved oxygen needed by aerobic biological organisms to break down organic material.',
    unit: 'mg/L',
    decimals: 2,
    reference: '≤ 3.0 mg/L'
  },
  Temperature: {
    key: 'Temperature',
    displayName: 'Temperature',
    description: 'Water temperature affects oxygen levels and aquatic life.',
    unit: '°C',
    decimals: 1,
    reference: '< 30 °C'
  },
  Turbidity: {
    key: 'Turbidity',
    displayName: 'Turbidity',
    description: 'Measure of the degree to which the water loses its transparency due to the presence of suspended particulates.',
    unit: 'NTU',
    decimals: 1,
    reference: '≤ 10 NTU'
  }
};
