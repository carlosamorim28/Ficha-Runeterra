import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ATTRIBUTE_LABELS } from '../constants';

export const AttrSelect = ({ value, onChange }: { value: string, onChange: (v: any) => void }) => (
  <div className="relative inline-block w-full">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-slate-50 border border-slate-300 hover:border-amber-500 rounded px-2 py-1 text-[10px] font-bold uppercase text-slate-700 focus:outline-none"
    >
      <option value="none">-</option>
      {Object.entries(ATTRIBUTE_LABELS).map(([k, v]) => (
        <option key={k} value={k}>{v.substring(0,3)}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-500"><ChevronDown size={10} /></div>
  </div>
);
