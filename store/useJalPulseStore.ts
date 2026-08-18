import { NotificationEvent, ResponseWorkflow } from '../types/notifications';
import { create } from 'zustand';

import { Alert } from '../types/alerts';
import { ParameterType } from '../types/water-quality';
import { Insight, PriorityStation } from '../types/insight';

export type DigitalTwinMode = 'OVERVIEW' | 'FLOW' | 'STATIONS' | 'DATA';

export type StationFilterType = 'ALL' | 'NORMAL' | 'WARNING' | 'CRITICAL' | 'SIMULATED' | 'OFFLINE';
export type TimeRangeType = '1H' | '6H' | '24H' | '48H' | '72H';
export type ForecastHorizon = '24H' | '48H' | '72H';
export type AnalyticsMode = 'NETWORK' | 'STATION';

interface JalPulseState {
  selectedStationId: string | null;
  selectedParameter: ParameterType | null;
  analyticsTimeRange: TimeRangeType;
  analyticsMode: AnalyticsMode;
  forecastHorizon: ForecastHorizon;
  alerts: Alert[];
  insights: Insight[];
  priorityStation: PriorityStation | null;
  notifications: NotificationEvent[];
  workflows: Record<string, ResponseWorkflow>;
  isSimulationRunning: boolean;
  
  // Map Explorer specific state
  stationSearch: string;
  stationFilter: StationFilterType;
  mapLayerType: 'SATELLITE' | 'LIGHT' | 'DARK';
  mapAlertFilter: 'ALL' | 'RED_ALERT' | 'MODERATE' | 'LOW_ALERT';
  setStationSearch: (search: string) => void;
  setStationFilter: (filter: StationFilterType) => void;
  setMapLayerType: (layer: 'SATELLITE' | 'LIGHT' | 'DARK') => void;
  setMapAlertFilter: (filter: 'ALL' | 'RED_ALERT' | 'MODERATE' | 'LOW_ALERT') => void;
  
  // Digital Twin specific state
  digitalTwinMode: DigitalTwinMode;
  showLabels: boolean;
  showParticles: boolean;
  autoRotate: boolean;
  cameraTarget: [number, number, number] | null;

  setSelectedStation: (id: string | null) => void;
  setSelectedParameter: (param: ParameterType | null) => void;
  setAnalyticsTimeRange: (range: TimeRangeType) => void;
  setAnalyticsMode: (mode: AnalyticsMode) => void;
  setForecastHorizon: (horizon: ForecastHorizon) => void;
  addOrUpdateAlert: (alert: Alert) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  setAlerts: (alerts: Alert[]) => void;
  addOrUpdateInsights: (newInsights: Insight[]) => void;
  setPriorityStation: (station: PriorityStation | null) => void;
  toggleSimulation: () => void;
  addNotification: (n: NotificationEvent) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addWorkflowTimelineEvent: (alertId: string, event: Omit<import('../types/notifications').TimelineEvent, 'id'>) => void;
  updateWorkflowStatus: (alertId: string, status: import('../types/notifications').ResponseStatus) => void;
  
  setDigitalTwinMode: (mode: DigitalTwinMode) => void;
  setShowLabels: (show: boolean) => void;
  setShowParticles: (show: boolean) => void;
  setAutoRotate: (rotate: boolean) => void;
  setCameraTarget: (target: [number, number, number] | null) => void;
}

export const useJalPulseStore = create<JalPulseState>((set) => ({
  selectedStationId: null,
  selectedParameter: null,
  analyticsTimeRange: '24H',
  analyticsMode: 'NETWORK',
  forecastHorizon: '48H',
  alerts: [],
  insights: [],
  priorityStation: null,
  notifications: [],
  workflows: {},
  isSimulationRunning: true,
  
  stationSearch: '',
  stationFilter: 'ALL',
  mapLayerType: 'SATELLITE',
  mapAlertFilter: 'ALL',
  
  digitalTwinMode: 'OVERVIEW',
  showLabels: true,
  showParticles: true,
  autoRotate: false,
  cameraTarget: null,

  setSelectedStation: (id) => set({ selectedStationId: id }),
  setSelectedParameter: (param) => set({ selectedParameter: param }),
  setAnalyticsTimeRange: (range) => set({ analyticsTimeRange: range }),
  setAnalyticsMode: (mode) => set({ analyticsMode: mode }),
  setForecastHorizon: (horizon) => set({ forecastHorizon: horizon }),
  addOrUpdateAlert: (newAlert) => set((state) => {
    const existingIndex = state.alerts.findIndex(a => a.fingerprint === newAlert.fingerprint && (a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED'));
    if (existingIndex >= 0) {
      const updated = [...state.alerts];
      const existing = updated[existingIndex];
      let status = existing.status;
      if (existing.severity === 'WARNING' && newAlert.severity === 'CRITICAL') {
         status = 'ACTIVE'; // re-escalate
      }
      updated[existingIndex] = { ...newAlert, id: existing.id, createdAt: existing.createdAt, status, occurrences: existing.occurrences + 1 };
      return { alerts: updated.slice(0, 100) };
    }
    return { alerts: [newAlert, ...state.alerts].slice(0, 100) };
  }),
  acknowledgeAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledgedAt: new Date().toISOString() } : a)
  })),
  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : a)
  })),
  setAlerts: (alerts) => set({ alerts }),
  addOrUpdateInsights: (newInsights) => set((state) => {
    const updated = [...state.insights];
    newInsights.forEach(ni => {
      const idx = updated.findIndex(i => i.fingerprint === ni.fingerprint);
      if (idx >= 0) {
        updated[idx] = { ...ni, id: updated[idx].id, createdAt: updated[idx].createdAt }; // Preserve original ID and creation time
      } else {
        updated.unshift(ni); // Add new to front
      }
    });
    // Keep only last 100 insights to avoid memory bloat
    return { insights: updated.slice(0, 100) };
  }),
  setPriorityStation: (station) => set({ priorityStation: station }),
  toggleSimulation: () => set((state) => ({ isSimulationRunning: !state.isSimulationRunning })),
  addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications].slice(0, 100) })),
  markNotificationRead: (id) => set((state) => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, status: 'READ' } : n) })),
  markAllNotificationsRead: () => set((state) => ({ notifications: state.notifications.map(n => n.status === 'UNREAD' ? { ...n, status: 'READ' } : n) })),
  addWorkflowTimelineEvent: (alertId, event) => set((state) => {
    const wf = state.workflows[alertId] || { alertId, status: 'NOTIFIED', timeline: [] };
    const newTimeline = [...wf.timeline, { ...event, id: crypto.randomUUID() }];
    return { workflows: { ...state.workflows, [alertId]: { ...wf, timeline: newTimeline } } };
  }),
  updateWorkflowStatus: (alertId, status) => set((state) => {
    const wf = state.workflows[alertId];
    if (!wf) return state;
    return { workflows: { ...state.workflows, [alertId]: { ...wf, status } } };
  }),
  
  setStationSearch: (search) => set({ stationSearch: search }),
  setStationFilter: (filter) => set({ stationFilter: filter }),
  setMapLayerType: (layer) => set({ mapLayerType: layer }),
  setMapAlertFilter: (filter) => set({ mapAlertFilter: filter }),
  
  setDigitalTwinMode: (mode) => set({ digitalTwinMode: mode }),
  setShowLabels: (show) => set({ showLabels: show }),
  setShowParticles: (show) => set({ showParticles: show }),
  setAutoRotate: (rotate) => set({ autoRotate: rotate }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
}));
