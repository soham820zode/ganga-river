"use client";
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { IconButton } from './IconButton';

export type ToastType = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';

export interface ToastProps {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  timestamp?: string;
  onClose?: () => void;
  duration?: number;
}

export function Toast({ type, title, message, timestamp, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible && !onClose) return null;

  const typeConfig = {
    INFO: { icon: <Info className="h-5 w-5 text-info" />, bg: 'border-info/30', indicator: 'bg-info' },
    SUCCESS: { icon: <CheckCircle className="h-5 w-5 text-success" />, bg: 'border-success/30', indicator: 'bg-success' },
    WARNING: { icon: <AlertTriangle className="h-5 w-5 text-warning" />, bg: 'border-warning/30', indicator: 'bg-warning' },
    CRITICAL: { icon: <AlertOctagon className="h-5 w-5 text-critical" />, bg: 'border-critical/30', indicator: 'bg-critical' },
  };

  const config = typeConfig[type];

  return (
    <div 
      className={`relative flex w-full max-w-sm overflow-hidden rounded-lg border glass-panel shadow-lg ${config.bg} transition-all`}
      role="alert"
    >
      <div className={`w-1 ${config.indicator}`} />
      <div className="flex p-4 w-full">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          {message && <p className="mt-1 text-sm text-text-secondary">{message}</p>}
          {timestamp && <p className="mt-2 text-xs text-text-muted text-technical">{timestamp}</p>}
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <IconButton 
            icon={<X className="h-4 w-4" />} 
            label="Close" 
            onClick={() => {
              setIsVisible(false);
              if (onClose) setTimeout(onClose, 300);
            }}
            size="sm"
            className="text-text-muted hover:text-text-primary"
          />
        </div>
      </div>
    </div>
  );
}
