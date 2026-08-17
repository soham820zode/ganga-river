"use client";
import { NotificationBell } from '../notifications/NotificationBell';
import React, { useState } from 'react';
import { Menu, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { DataSourceBadge } from '../ui/DataSourceBadge';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  React.useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Overview — JAL PULSE',
      '/monitoring': 'Live Monitoring — JAL PULSE',
      '/forecast': '48H Forecast — JAL PULSE',
      '/alerts': 'Alert Intelligence — JAL PULSE',
      '/intelligence': 'Environmental Intelligence — JAL PULSE',
      '/analytics': 'Historical Analytics — JAL PULSE',
      '/demo': 'Demo Scenarios — JAL PULSE',
      '/demo/summary': 'Executive Summary — JAL PULSE',
      '/simulation': 'Simulation Engine — JAL PULSE',
      '/design-system': 'Design System — JAL PULSE',
    };

    const matched = Object.keys(titles).find(path => 
      path === '/' ? pathname === '/' : pathname.startsWith(path)
    );

    document.title = matched ? titles[matched] : 'JAL PULSE — The Pulse of Ganga';
  }, [pathname]);

  return (
    <>
      <nav className="sticky top-0 z-30 w-full backdrop-blur-2xl bg-white/85 border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-sky-50 border border-sky-200/80 shadow-sm group-hover:border-sky-400 group-hover:bg-sky-100/60 transition-all">
                <Activity className="h-4 w-4 text-sky-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.2em] text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">JAL PULSE</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-[0.3em] leading-tight font-medium">The Pulse of Ganga</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-100/70 rounded-2xl border border-slate-200/60">
              {navItems.map((item) => {
                const isActive = isItemActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <DataSourceBadge isSimulated={true} />
              <NotificationBell />
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => router.push('/monitoring')}
              >
                Command Center
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <IconButton 
                icon={<Menu className="h-5 w-5 text-slate-700" />} 
                label="Open menu" 
                onClick={() => setIsMobileMenuOpen(true)} 
              />
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}
