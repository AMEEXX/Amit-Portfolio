import React from 'react';
import { cn } from '@/lib/utils';

export const StaticLiquidTag = ({
  children,
  className = "px-4 py-1.5",
  textClass = "text-xs",
  rounded = "rounded-full",
}: {
  children: React.ReactNode;
  className?: string;
  textClass?: string;
  rounded?: string;
}) => {
  const isBoxy = rounded.includes('rounded-none') || className.includes('rounded-none');
  const roundedClass = isBoxy ? 'rounded-none' : rounded;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden transition-colors duration-300 group",
        roundedClass,
        className
      )}
      style={{
        background: 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow:
          '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 -1px 2px rgba(0, 0, 0, 0.8)',
        borderRadius: isBoxy ? 0 : undefined,
      }}
    >
      {/* Specular highlight border */}
      <div
        className={cn("absolute inset-0 border border-white/5 pointer-events-none", roundedClass)}
        style={{ borderRadius: isBoxy ? 0 : undefined }}
      />

      <span
        className={cn(
          "relative z-10 flex items-center gap-2 font-bold tracking-wide text-[#a3a3a3] group-hover:text-[#e5e5e5] transition-colors duration-300",
          textClass
        )}
      >
        {children}
      </span>
    </div>
  );
};
