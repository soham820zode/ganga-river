import React from 'react';

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionContainer({ 
  eyebrow,
  title,
  description,
  action,
  className = '', 
  children, 
  ...props 
}: SectionContainerProps) {
  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${className}`} {...props}>
      {(eyebrow || title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            {eyebrow && <p className="text-technical text-accent">{eyebrow}</p>}
            {title && <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">{title}</h2>}
            {description && <p className="text-text-secondary max-w-2xl">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}