'use client';

import React, { useEffect } from 'react';
import { useJalPulseStore } from '../../store/useJalPulseStore';
import { InsightCard } from '../../components/intelligence/InsightCard';
import { WhatChangedPanel } from '../../components/intelligence/WhatChangedPanel';
import { IntelligenceTimeline } from '../../components/intelligence/IntelligenceTimeline';
import { MethodologyPanel } from '../../components/intelligence/MethodologyPanel';
import { Navbar } from '../../components/navigation/Navbar';
import { Brain, MapPin } from 'lucide-react';
import { MOCK_STATIONS } from '../../config/stations';
import { Insight } from '../../types/insight';
import { useRouter } from 'next/navigation';

export default function IntelligenceDashboard() {
  const router = useRouter();
  const insights = useJalPulseStore(state => state.insights);
  const priorityStation = useJalPulseStore(state => state.priorityStation);
  
  // Ensure the engine is running (it subscribes to simulator automatically, but good to ensure it's imported)
  useEffect(() => {
    // The import itself initializes the singleton
  }, []);

  const topInsight = insights.length > 0 ? insights[0] : null;
  const networkInsight = insights.find(i => i.type === 'NETWORK_SUMMARY');
  const otherInsights = insights.filter(i => i !== topInsight && i.type !== 'NETWORK_SUMMARY').slice(0, 4);

  const priorityStationName = priorityStation 
    ? (MOCK_STATIONS.find(s => s.id === priorityStation.stationId)?.name || priorityStation.stationId)
    : 'None';

  const handleAction = (actionType: string, insight?: Insight) => {
    if (actionType === 'REVIEW_STATION' && insight?.stationId) {
      useJalPulseStore.getState().setSelectedStation(insight.stationId);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen text-text-primary font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/15 shadow-[0_0_15px_rgba(0,200,255,0.1)]">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-[0.05em]">Environmental Intelligence</h1>
          </div>
          <p className="text-text-secondary max-w-3xl">
            Automated analysis and decision-support layer translating simulated environmental data into clear, actionable insights.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* System Intelligence Summary */}
            {networkInsight && (
              <div className="aetheris-glass p-6 border-glow-cyan">
                <h2 className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase mb-3 text-glow">System Intelligence Summary</h2>
                <p className="text-text-primary leading-relaxed">{networkInsight.summary}</p>
              </div>
            )}

            {/* Top Priority Signal */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-text-primary tracking-wide">Top Priority Signal</h2>
                {priorityStation && (
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary bg-white/[0.04] px-4 py-2 rounded-xl border border-white/[0.08] tracking-wider uppercase">
                    <MapPin className="w-3.5 h-3.5" />
                    Demo Priority: <span className="font-semibold text-text-primary">{priorityStationName}</span>
                  </div>
                )}
              </div>
              
              {topInsight ? (
                <InsightCard insight={topInsight} onAction={handleAction} />
              ) : (
                <div className="aetheris-glass p-10 text-center text-text-muted">
                  <div className="text-[10px] tracking-[0.3em] uppercase font-bold">Gathering initial simulated data to generate insights...</div>
                </div>
              )}
            </div>

            {/* Other Insights */}
            {otherInsights.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-text-primary mb-5 tracking-wide">Additional Context</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherInsights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} onAction={handleAction} />
                  ))}
                </div>
              </div>
            )}

            <MethodologyPanel />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WhatChangedPanel insights={insights} />
            <IntelligenceTimeline insights={insights} />
          </div>
          
        </div>
      </main>
    </div>
  );
}
