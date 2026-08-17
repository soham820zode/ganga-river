"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Clock } from 'lucide-react';
import { useJalPulseStore } from '../../store/useJalPulseStore';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const notifications = useJalPulseStore(state => state.notifications);
  const markNotificationRead = useJalPulseStore(state => state.markNotificationRead);
  const markAllNotificationsRead = useJalPulseStore(state => state.markAllNotificationsRead);
  
  const inAppNotifications = notifications.filter(n => n.channel === 'IN_APP').sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const unreadCount = inAppNotifications.filter(n => n.status === 'UNREAD').length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-elevated border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center p-3 border-b border-border/50 bg-surface/50">
            <h3 className="text-sm font-bold tracking-widest uppercase">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllNotificationsRead()}
                className="text-xs text-accent hover:text-accent/80 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {inAppNotifications.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-xs">No notifications.</div>
            ) : (
              inAppNotifications.map(n => {
                const isUnread = n.status === 'UNREAD';
                const isCrit = n.severity === 'CRITICAL';
                return (
                  <div 
                    key={n.id} 
                    onClick={() => {
                      if (isUnread) markNotificationRead(n.id);
                    }}
                    className={`p-4 border-b border-border/20 transition-colors cursor-pointer hover:bg-surface ${
                      isUnread ? (isCrit ? 'bg-red-500/5' : 'bg-amber-500/5') : 'opacity-70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${
                        isCrit ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {n.severity}
                      </span>
                      <span suppressHydrationWarning className="text-[10px] text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-xs mt-2 ${isUnread ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {n.message}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
