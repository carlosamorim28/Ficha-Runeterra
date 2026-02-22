import React from 'react';

export const SectionHeader = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
  <div className="flex items-center gap-2 mb-4 border-b-2 border-slate-800 pb-1">
    <Icon size={18} className="text-amber-600" />
    <h2 className="font-tech text-sm font-bold uppercase tracking-wider text-slate-800">{title}</h2>
  </div>
);
