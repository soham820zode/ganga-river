import { useJalPulseStore } from '../../store/useJalPulseStore';
import { NotificationEvent, NotificationChannel } from '../../types/notifications';

class NotificationService {
  public async dispatch(
    alertId: string, 
    stationId: string, 
    parameter: string, 
    severity: 'INFO' | 'WARNING' | 'CRITICAL',
    message: string,
    channels: NotificationChannel[]
  ) {
    const store = useJalPulseStore.getState();
    const now = new Date().toISOString();

    channels.forEach(channel => {
      if (channel === 'IN_APP') {
        const n: NotificationEvent = {
          id: crypto.randomUUID(),
          alertId,
          stationId,
          parameter,
          severity,
          channel,
          message,
          status: 'UNREAD',
          timestamp: now,
          isSimulated: true
        };
        store.addNotification(n);
        
        // Also log to timeline if it's an alert workflow
        store.addWorkflowTimelineEvent(alertId, {
           timestamp: now,
           title: 'Alert Detected',
           description: message,
           isSimulated: true
        });

      } else {
        // External channels (SMS, Email, WhatsApp) are simulated
        const id = crypto.randomUUID();
        const queuedN: NotificationEvent = {
          id, alertId, stationId, parameter, severity, channel, message,
          status: 'QUEUED', timestamp: now, isSimulated: true, recipient: 'Demo Response Team'
        };
        store.addNotification(queuedN);
        
        store.addWorkflowTimelineEvent(alertId, {
           timestamp: now,
           title: `${channel} Queued`,
           description: `Dispatching prototype message to Demo Response Team via ${channel}`,
           isSimulated: true
        });

        // Simulate network delay
        setTimeout(() => {
           // We just cheat and update the timeline directly since updating the notification array by ID requires more boilerplate.
           const deliveryTime = new Date().toISOString();
           store.addWorkflowTimelineEvent(alertId, {
             timestamp: deliveryTime,
             title: `${channel} Simulated Delivery`,
             description: `Message delivered to Demo Response Team.`,
             isSimulated: true
           });
        }, 1500 + Math.random() * 1000);
      }
    });
  }
}

export const notificationService = new NotificationService();
