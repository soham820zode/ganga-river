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

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Navigation" position="left">
      <div className="flex flex-col h-full bg-white">
        <Link href="/" onClick={onClose} className="flex items-center gap-3 mb-6 px-2 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 shadow-sm group-hover:border-sky-400 transition-colors">
            <Activity className="h-4 w-4 text-sky-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.2em] text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">JAL PULSE</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] leading-tight font-medium">The Pulse of Ganga</span>
          </div>
        </Link>
        
        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = isItemActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs tracking-[0.1em] uppercase font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-slate-200 px-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-mono font-bold">DATA SOURCE</span>
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