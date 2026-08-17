export type NotificationChannel = 'IN_APP' | 'BROWSER' | 'EMAIL' | 'SMS' | 'WHATSAPP';
export type NotificationStatus = 'QUEUED' | 'SIMULATED_DELIVERY' | 'FAILED' | 'READ' | 'UNREAD';

export interface NotificationEvent {
  id: string;
  alertId: string;
  stationId: string;
  parameter: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  channel: NotificationChannel;
  recipient?: string;
  message: string;
  status: NotificationStatus;
  timestamp: string;
  isSimulated: boolean;
}

export type ResponseStatus = 'NOTIFIED' | 'ACKNOWLEDGED' | 'RESPONDING' | 'RESOLVED';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  isSimulated: boolean;
}

export interface ResponseWorkflow {
  alertId: string;
  status: ResponseStatus;
  timeline: TimelineEvent[];
}
