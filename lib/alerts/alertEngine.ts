import { notificationService } from '../notifications/notificationService';
import { simulator } from '../simulation/simulator';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { Alert, AlertSeverity, AlertType } from '../../types/alerts';
import { PARAMETER_METADATA } from '../../config/parameters';
import { ParameterType, StationData } from '../../types/water-quality';

// In-memory state for persistence tracking
const persistenceMap: Record<string, number> = {};

export class JalPulseAlertEngine {
  constructor() {
    simulator.subscribe((snapshot) => {
      this.processTick(snapshot.stations);
    });
  }

  private processTick(stations: Record<string, StationData>) {
    const store = useJalPulseStore.getState();
    const now = new Date().toISOString();

    Object.values(stations).forEach((station) => {
      Object.keys(station.readings).forEach((p) => {
        const param = p as ParameterType;
        const reading = station.readings[param];
        if (!reading) return;

        const meta = PARAMETER_METADATA[param];
        let isViolation = false;
        let severity: AlertSeverity = 'INFO';
        let type: AlertType = 'THRESHOLD_EXCEEDED';
        let refValue = 0;
        let direction = '';

        if (meta.reference.includes('<') || meta.reference.includes('≤')) {
          refValue = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
          if (reading.value > refValue) {
             isViolation = true;
             direction = 'upper';
          }
        } else if (meta.reference.includes('>')) {
          refValue = parseFloat(meta.reference.replace(/[^0-9.]/g, ''));
          if (reading.value < refValue) {
             isViolation = true;
             direction = 'lower';
          }
        }

        const fingerprint = `${station.id}-${param}-THRESHOLD`;

        if (isViolation) {
          persistenceMap[fingerprint] = (persistenceMap[fingerprint] || 0) + 1;
          
          severity = 'WARNING';
          
          // Escalation: if condition persists for 3 ticks (15 seconds simulated time)
          if (persistenceMap[fingerprint] >= 3) {
             severity = 'CRITICAL';
          }
          
          // Anomaly scenario explicitly injected
          if (reading.isAnomaly) {
             type = 'ANOMALY';
             severity = 'CRITICAL';
          }

          const message = `${meta.displayName} ${direction === 'upper' ? 'exceeded' : 'dropped below'} the configured prototype reference (${meta.reference}) at ${station.name}.`;

          const alert: Alert = {
            id: crypto.randomUUID(),
            fingerprint,
            stationId: station.id,
            parameter: param,
            type,
            severity,
            status: 'ACTIVE',
            createdAt: now,
            updatedAt: now,
            occurrences: 1,
            currentValue: reading.value,
            referenceThreshold: refValue,
            message,
            source: 'SIMULATION_ENGINE',
            isProjected: false,
            isSimulated: true
          };

          store.addOrUpdateAlert(alert);

          // Trigger In-App Notification if it's a brand new alert (occurrences === 1)
          // For prototype, we just rely on the toast manager to catch it, but let's officially dispatch an IN_APP notification
          // only when it first spawns or escalates.
          const existing = store.alerts.find(a => a.fingerprint === fingerprint);
          if (!existing || (existing.severity === 'WARNING' && severity === 'CRITICAL')) {
             notificationService.dispatch(alert.id, station.id, param, severity, message, ['IN_APP']);
          }

        } else {
          // Recovery
          if (persistenceMap[fingerprint] > 0) {
            persistenceMap[fingerprint] = 0;
            // Find active alert and resolve it
            const existing = store.alerts.find(a => a.fingerprint === fingerprint && (a.status === 'ACTIVE' || a.status === 'ACKNOWLEDGED'));
            if (existing) {
               store.resolveAlert(existing.id);
            }
          }
        }
      });
    });
  }
}

// Singleton initialization
export const alertEngine = new JalPulseAlertEngine();
