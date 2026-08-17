import React from 'react';
import { Drawer } from '../ui/Drawer';
import { DataSourceBadge } from '../ui/DataSourceBadge';
import { Button } from '../ui/Button';
import { Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Overview', href: '/' },
    { label: 'Monitoring', href: '/monitoring' },
    { label: 'Forecast', href: '/forecast' },
    { label: 'Alerts', href: '/alerts' },
    { label: 'Intelligence', href: '/intelligence' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Demo Mode', href: '/demo' },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Navigation" position="left">
      <div className="flex flex-col h-full">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 mb-8 px-2 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 shadow-[0_0_12px_rgba(0,200,255,0.12)] group-hover:border-accent/40 transition-colors">
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.2em] text-text-primary leading-tight text-glow group-hover:text-accent transition-colors">JAL PULSE</span>
            <span className="text-[9px] text-text-muted uppercase tracking-[0.3em] leading-tight">The Pulse of Ganga</span>
          </div>
        </Link>
        
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 rounded-xl text-[11px] tracking-[0.1em] uppercase font-semibold transition-all ${
                  isActive
                    ? 'bg-accent/10 text-accent border border-accent/15'
                    : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-white/[0.06] px-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-text-muted uppercase tracking-[0.2em] font-mono">DATA SOURCE</span>
            <DataSourceBadge isSimulated={true} />
          </div>
          <Button 
            variant="primary" 
            className="w-full"
            onClick={() => {
              onClose();
              router.push('/monitoring');
            }}
          >
            Command Center
          </Button>
        </div>
      </div>
    </Drawer>
  );
}