"use client";
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
        aria-hidden="true"
      />
      
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-50 w-full max-w-lg overflow-hidden glass-panel-elevated rounded-xl shadow-2xl sm:w-full mx-4"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 id="modal-title" className="text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <IconButton 
            icon={<X className="h-5 w-5" />} 
            label="Close modal" 
            onClick={onClose}
            size="sm"
          />
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
        </div>
        
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-border bg-surface/50 p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
