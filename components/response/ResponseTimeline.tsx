"use client";
import React, { useState } from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { notificationService } from '../../lib/notifications/notificationService';
import { Send, CheckCircle, Activity, Play } from 'lucide-react';

export function ResponseTimeline({ alertId }: { alertId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const workflows = useJalPulseStore(state => state.workflows);
  const acknowledgeAlert = useJalPulseStore(state => state.acknowledgeAlert);
  const resolveAlert = useJalPulseStore(state => state.resolveAlert);
  const updateWorkflowStatus = useJalPulseStore(state => state.updateWorkflowStatus);
  
  const wf = workflows[alertId];

  const handleNotifyTeam = () => {
    notificationService.dispatch(alertId, 'Unknown', 'Unknown', 'WARNING', 'Response Team Activated via Alert Center', ['SMS', 'WHATSAPP']);
    updateWorkflowStatus(alertId, 'NOTIFIED');
  };

  const handleStartResponse = () => {
    acknowledgeAlert(alertId);
    updateWorkflowStatus(alertId, 'RESPONDING');
  };

  const handleResolve = () => {
    resolveAlert(alertId);
    updateWorkflowStatus(alertId, 'RESOLVED');
  };

  return (
    <div className="mt-4 border-t border-border/30 pt-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs font-bold tracking-widest uppercase text-accent flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Activity className="w-4 h-4" /> 
        {isExpanded ? 'Hide Response Timeline' : 'View Response Timeline'}
      </button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-surface rounded-xl border border-border/50">
          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button 
              onClick={handleNotifyTeam}
              className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase bg-surface-elevated border border-border/50 rounded-lg text-text-primary hover:bg-surface-highlight flex items-center gap-2"
            >
              <Send className="w-3 h-3" /> Notify Team
            </button>
            <button 
              onClick={handleStartResponse}
              className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase bg-surface-elevated border border-border/50 rounded-lg text-amber-500 hover:bg-surface-highlight flex items-center gap-2"
            >
              <Play className="w-3 h-3" /> Start Response
            </button>
            <button 
              onClick={handleResolve}
              className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase bg-surface-elevated border border-border/50 rounded-lg text-accent hover:bg-surface-highlight flex items-center gap-2"
            >
              <CheckCircle className="w-3 h-3" /> Resolve
            </button>
          </div>

          {/* Timeline */}
          {(!wf || wf.timeline.length === 0) ? (
            <div className="text-xs text-text-muted italic">No response events logged yet.</div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
              {wf.timeline.map((event) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border/50 bg-surface-elevated text-text-muted shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-border/30 bg-surface-elevated/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-text-primary">{event.title}</span>
                      <span className="text-[10px] text-text-muted font-mono">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs text-text-secondary">{event.description}</div>
                    {event.isSimulated && (
                       <div className="mt-2 text-[9px] font-mono tracking-widest text-text-muted bg-black/20 inline-block px-1.5 py-0.5 rounded">SIMULATED DATA</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
