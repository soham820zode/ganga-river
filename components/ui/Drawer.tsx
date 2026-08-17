"use client";
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export function Drawer({ isOpen, onClose, title, children, position = 'right' }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div 
        className="absolute inset-0 bg-background/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        role="dialog"
        aria-modal="true"
        className={`relative z-50 flex h-full w-full max-w-md flex-col bg-background/80 backdrop-blur-2xl border-r border-white/[0.08] shadow-[0_0_60px_rgba(0,0,0,0.5)] transition-transform ${
          position === 'right' ? 'ml-auto border-l border-r-0' : 'mr-auto'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
          <h2 className="text-sm font-bold text-text-primary tracking-[0.15em] uppercase">{title}</h2>
          <IconButton 
            icon={<X className="h-5 w-5" />} 
            label="Close drawer" 
            onClick={onClose}
            size="sm"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
