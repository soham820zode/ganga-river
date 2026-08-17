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
    <div className="mt-4 border-t border-slate-200 pt-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs font-bold tracking-wider uppercase text-sky-600 flex items-center gap-2 hover:text-sky-700 transition-colors"
      >
        <Activity className="w-4 h-4" /> 
        {isExpanded ? 'Hide Response Timeline' : 'View Response Timeline'}
      </button>

      {isExpanded && (
        <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
          {/* Actions */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button 
              onClick={handleNotifyTeam}
              className="px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-2 shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" /> Notify Team
            </button>
            <button 
              onClick={handleStartResponse}
              className="px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase bg-white border border-amber-200 rounded-xl text-amber-700 hover:bg-amber-50 flex items-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-amber-600" /> Start Response
            </button>
            <button 
              onClick={handleResolve}
              className="px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase bg-white border border-emerald-200 rounded-xl text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 shadow-xs"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Resolve
            </button>
          </div>

          {/* Timeline */}
          {(!wf || wf.timeline.length === 0) ? (
            <div className="text-xs text-slate-400 italic">No response events logged yet.</div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {wf.timeline.map((event) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-200 bg-white text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 shadow-xs">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-900">{event.title}</span>
                      <span suppressHydrationWarning className="text-[10px] text-slate-400 font-mono font-medium">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed font-medium">{event.description}</div>
                    {event.isSimulated && (
                       <div className="mt-2 text-[9px] font-mono tracking-wider text-slate-500 bg-slate-100 border border-slate-200 inline-block px-2 py-0.5 rounded font-bold">STREAM EVENT</div>
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
