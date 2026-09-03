import React from 'react';

export const StaticLiquidTag = ({ children, className = "px-4 py-1.5", textClass = "text-xs" }) => (
  <div className={`relative inline-flex items-center justify-center overflow-hidden rounded-full transition-colors duration-300 group ${className}`}
       style={{
         background: 'rgba(10, 10, 10, 0.4)',
         backdropFilter: 'blur(12px)',
         WebkitBackdropFilter: 'blur(12px)',
         boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 -1px 2px rgba(0, 0, 0, 0.8)'
       }}>
    {/* Specular highlight border similar to the Resume button's ::before */}
    <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
    
    <span className={`relative z-10 flex items-center gap-2 font-bold tracking-wide text-[#a3a3a3] group-hover:text-[#e5e5e5] transition-colors duration-300 ${textClass}`}>
      {children}
    </span>
  </div>
);
