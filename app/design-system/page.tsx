import React from 'react';
import { Button } from '../../components/ui/Button';
import { IconButton } from '../../components/ui/IconButton';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataSourceBadge } from '../../components/ui/DataSourceBadge';
import { Card } from '../../components/ui/Card';
import { GlassCard } from '../../components/ui/GlassCard';

import { GlassPanel } from '../../components/ui/GlassPanel';
import { SectionContainer } from '../../components/layout/SectionContainer';
import { PanelHeader } from '../../components/layout/PanelHeader';
import { StatCard } from '../../components/data-display/StatCard';
import { Toast } from '../../components/ui/Toast';
import { LoadingPanel } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Navbar } from '../../components/navigation/Navbar';
import { Activity, Beaker, Bell, Settings } from 'lucide-react';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pb-24">
        <div className="text-center py-16 border-b border-border/50 bg-surface/50">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-4">JAL PULSE Design System</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            A premium environmental intelligence command center visual foundation.
          </p>
        </div>

        <SectionContainer title="1. Colors & Typography" eyebrow="FOUNDATION" description="Base semantic colors and technical typography styles.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Background', bg: 'bg-background', text: 'text-text-primary' },
              { label: 'Surface', bg: 'bg-surface', text: 'text-text-primary' },
              { label: 'Surface Elevated', bg: 'bg-surface-elevated', text: 'text-text-primary' },
              { label: 'Accent', bg: 'bg-accent', text: 'text-background' },
              { label: 'Success', bg: 'bg-success', text: 'text-background' },
              { label: 'Warning', bg: 'bg-warning', text: 'text-background' },
              { label: 'Critical', bg: 'bg-critical', text: 'text-text-primary' },
              { label: 'Info', bg: 'bg-info', text: 'text-text-primary' },
            ].map((color) => (
              <div key={color.label} className="flex flex-col gap-2">
                <div className={`h-16 rounded-md border border-border ${color.bg}`} />
                <span className="text-xs font-medium text-text-secondary">{color.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-text-primary">Display / H1</h1>
              <p className="text-sm text-text-muted mt-1">Geist Sans, 48px, Bold, Tight Tracking</p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-text-primary">Section Heading / H2</h2>
              <p className="text-sm text-text-muted mt-1">Geist Sans, 30px, Semibold</p>
            </div>
            <div>
              <p className="text-base text-text-secondary leading-relaxed">
                Body text. This is a comfortable reading size for descriptions and general information 
                panels in the dashboard.
              </p>
              <p className="text-sm text-text-muted mt-1">Geist Sans, 16px, Regular, Relaxed Line Height</p>
            </div>
            <div>
              <p className="text-technical text-accent">TECHNICAL METADATA LABEL</p>
              <p className="text-sm text-text-muted mt-1">Geist Mono, 12px, Uppercase, Wide Tracking</p>
            </div>
          </div>
        </SectionContainer>

        <SectionContainer title="2. Buttons" eyebrow="COMPONENTS" description="Interactive elements with hover and focus states.">
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="success">Success Button</Button>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <IconButton icon={<Settings className="h-5 w-5" />} label="Settings" variant="outline" />
            <IconButton icon={<Bell className="h-5 w-5" />} label="Notifications" variant="ghost" />
            <IconButton icon={<Activity className="h-5 w-5" />} label="Activity" variant="primary" />
          </div>
        </SectionContainer>

        <SectionContainer title="3. Badges & Status" eyebrow="COMPONENTS" description="Small visual indicators for state and metadata.">
          <div className="flex flex-wrap gap-4 items-center mb-8">
            <Badge variant="default">Default</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="critical">Critical</Badge>
            <Badge variant="technical">TECHNICAL</Badge>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center mb-8 bg-surface-elevated p-6 rounded-lg border border-border">
            <StatusBadge status="ONLINE" />
            <StatusBadge status="WARNING" />
            <StatusBadge status="CRITICAL" />
            <StatusBadge status="CONNECTING" />
            <StatusBadge status="OFFLINE" />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <DataSourceBadge isSimulated={true} />
            <DataSourceBadge isSimulated={false} />
          </div>
        </SectionContainer>

        <SectionContainer title="4. Cards & Panels" eyebrow="COMPONENTS" description="Container primitives for layout building.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <h3 className="text-lg font-medium text-text-primary mb-2">Standard Card</h3>
              <p className="text-text-secondary">Solid background color (surface). Used for standard content areas that don&apos;t need a premium glass treatment.</p>
            </Card>
            
            <GlassCard>
              <h3 className="text-lg font-medium text-text-primary mb-2">Glass Card</h3>
              <p className="text-text-secondary">Translucent background with backdrop blur. Used for dashboard widgets and overlay panels.</p>
            </GlassCard>
            
            <GlassCard interactive elevated>
              <h3 className="text-lg font-medium text-text-primary mb-2">Interactive Elevated Glass Card</h3>
              <p className="text-text-secondary">Hover state enabled with deeper shadow. Used for clickable widgets or station selection.</p>
            </GlassCard>
          </div>

          <GlassPanel padding="none" className="mb-8">
            <PanelHeader 
              title="STATION MONITORING" 
              description="Real-time water quality telemetry" 
              status={<StatusBadge status="LIVE" />}
              action={<Button variant="outline" size="sm">View All</Button>}
            />
            <div className="p-6">
              <p className="text-text-secondary">Panel content goes here. The header is separated by a subtle border.</p>
            </div>
          </GlassPanel>
        </SectionContainer>

        <SectionContainer title="5. Data Display" eyebrow="COMPONENTS" description="Specialized components for environmental data.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatCard 
              label="pH LEVEL" 
              value="7.42" 
              status="ONLINE" 
              trend={0.5} 
              icon={<Beaker className="h-4 w-4" />} 
            />
            <StatCard 
              label="DISSOLVED OXYGEN" 
              value="6.8" 
              unit="mg/L" 
              status="WARNING" 
              trend={-2.1} 
              icon={<Activity className="h-4 w-4" />} 
            />
            <StatCard 
              label="BOD" 
              value="2.4" 
              unit="mg/L" 
              status="ONLINE" 
              trend={-1.2} 
            />
            <StatCard 
              label="TEMPERATURE" 
              value="24.5" 
              unit="°C" 
              status="CRITICAL" 
              trend={5.4} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 relative rounded-lg overflow-hidden">
              <LoadingPanel text="Calibrating sensors..." />
            </div>
            <div className="h-64 relative rounded-lg overflow-hidden">
              <EmptyState />
            </div>
            <div className="h-64 relative rounded-lg overflow-hidden">
              <ErrorState />
            </div>
          </div>
        </SectionContainer>

        <SectionContainer title="6. Toasts & Notifications" eyebrow="COMPONENTS" description="Simulated notification system.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Toast 
              type="INFO" 
              title="System Update" 
              message="New forecasting model has been deployed to the simulation engine."
              timestamp="Just now"
            />
            <Toast 
              type="SUCCESS" 
              title="Calibration Complete" 
              message="Haridwar monitoring station sensors successfully calibrated."
              timestamp="2 mins ago"
            />
            <Toast 
              type="WARNING" 
              title="Anomalous Reading" 
              message="Sudden drop in Dissolved Oxygen detected at Kanpur station."
              timestamp="15 mins ago"
            />
            <Toast 
              type="CRITICAL" 
              title="Critical Pollution Event" 
              message="BOD levels exceeded maximum safety threshold. Response team notified."
              timestamp="1 hour ago"
            />
          </div>
        </SectionContainer>
      </main>
    </div>
  );
}
