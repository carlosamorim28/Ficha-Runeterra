import React from 'react';

export const InputUnderline = ({ 
  label, 
  value, 
  onChange, 
  className = "", 
  centered = false,
  placeholder = ""
}: { 
  label?: string, 
  value: string | number, 
  onChange: (v: string) => void, 
  className?: string,
  centered?: boolean,
  placeholder?: string
}) => (
  <div className={`flex flex-col w-full ${className}`}>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent border-b border-slate-300 focus:border-cyan-500 focus:outline-none py-1 text-sm font-medium text-slate-800 placeholder-slate-300 ${centered ? 'text-center' : ''}`}
    />
    {label && <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</label>}
  </div>
);
