"use client";
import { NotificationBell } from '../notifications/NotificationBell';
import React, { useState } from 'react';
import { Menu, Activity } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { DataSourceBadge } from '../ui/DataSourceBadge';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-30 w-full backdrop-blur-2xl bg-background/40 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 shadow-[0_0_15px_rgba(0,200,255,0.15)]">
                <Activity className="h-4 w-4 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-[0.2em] text-text-primary leading-tight text-glow">AETHERIS</span>
                <span className="text-[9px] text-text-muted uppercase tracking-[0.3em] leading-tight">Water Matrix</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-1">
                {[
                  { label: 'Dashboard', href: '#', active: true },
                  { label: 'Monitoring', href: '/monitoring' },
                  { label: 'Forecast', href: '/forecast' },
                  { label: 'Alerts', href: '/alerts' },
                  { label: 'Intelligence', href: '/intelligence' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`px-4 py-2 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-xl transition-all duration-200 ${
                      item.active
                        ? 'text-accent bg-accent/8 border border-accent/15'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <DataSourceBadge isSimulated={true} />
              <NotificationBell />
              <Button variant="primary" size="sm">Command Center</Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <IconButton 
                icon={<Menu className="h-5 w-5" />} 
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
