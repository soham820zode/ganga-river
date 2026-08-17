import { ParameterType } from '../types/water-quality';

export interface ParameterMetadata {
  key: ParameterType;
  displayName: string;
  description: string;
  unit: string;
  decimals: number;
  reference: string;
  color: string;
  lightBg: string;
  lightBorder: string;
  lightText: string;
  badgeBg: string;
  iconBg: string;
  accentHex: string;
}

export const PARAMETER_METADATA: Record<ParameterType, ParameterMetadata> = {
  pH: {
    key: 'pH',
    displayName: 'pH Level',
    description: 'Measure of how acidic/basic water is. Essential for aquatic life balance.',
    unit: 'pH',
    decimals: 2,
    reference: '6.5–8.5',
    color: '#059669', // Emerald
    lightBg: 'bg-emerald-50',
    lightBorder: 'border-emerald-200',
    lightText: 'text-emerald-700',
    badgeBg: 'bg-emerald-100/80 text-emerald-800 border-emerald-300',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    accentHex: '#059669',
  },
  DO: {
    key: 'DO',
    displayName: 'Dissolved Oxygen',
    description: 'Amount of oxygen available to living aquatic ecosystems.',
    unit: 'mg/L',
    decimals: 2,
    reference: '≥ 4.0 mg/L',
    color: '#0284c7', // Sky Azure
    lightBg: 'bg-sky-50',
    lightBorder: 'border-sky-200',
    lightText: 'text-sky-700',
    badgeBg: 'bg-sky-100/80 text-sky-800 border-sky-300',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
    accentHex: '#0284c7',
  },
  BOD: {
    key: 'BOD',
    displayName: 'Biochemical Oxygen Demand',
    description: 'Oxygen required by organisms to decompose organic waste.',
    unit: 'mg/L',
    decimals: 2,
    reference: '≤ 3.0 mg/L',
    color: '#e11d48', // Ruby Rose
    lightBg: 'bg-rose-50',
    lightBorder: 'border-rose-200',
    lightText: 'text-rose-700',
    badgeBg: 'bg-rose-100/80 text-rose-800 border-rose-300',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    accentHex: '#e11d48',
  },
  Temperature: {
    key: 'Temperature',
    displayName: 'Water Temperature',
    description: 'Thermal profile affecting biochemical rates and dissolved gas solubility.',
    unit: '°C',
    decimals: 1,
    reference: '< 30 °C',
    color: '#ea580c', // Sunset Amber
    lightBg: 'bg-amber-50',
    lightBorder: 'border-amber-200',
    lightText: 'text-amber-700',
    badgeBg: 'bg-amber-100/80 text-amber-800 border-amber-300',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    accentHex: '#ea580c',
  },
  Turbidity: {
    key: 'Turbidity',
    displayName: 'Turbidity & Clarity',
    description: 'Degree to which water loses transparency due to suspended sediment.',
    unit: 'NTU',
    decimals: 1,
    reference: '≤ 10 NTU',
    color: '#7c3aed', // Amethyst Violet
    lightBg: 'bg-purple-50',
    lightBorder: 'border-purple-200',
    lightText: 'text-purple-700',
    badgeBg: 'bg-purple-100/80 text-purple-800 border-purple-300',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
    accentHex: '#7c3aed',
  }
};
