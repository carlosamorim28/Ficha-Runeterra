import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { NamedBonus } from '../types';

export const BonusList = ({ 
  title, 
  bonuses, 
  onChange,
  className = ""
}: { 
  title: string; 
  bonuses: NamedBonus[]; 
  onChange: (b: NamedBonus[]) => void;
  className?: string;
}) => (
  <div className={`mt-2 ${className}`}>
    <div className="flex justify-between items-center mb-1">
      <span className="text-[9px] font-bold uppercase text-slate-400">{title}</span>
      <button 
        onClick={() => onChange([...bonuses, { id: Date.now().toString(), name: '', value: 0 }])}
        className="text-cyan-600 hover:text-cyan-700 transition-colors"
      >
        <Plus size={10} />
      </button>
    </div>
    <div className="space-y-1">
      {bonuses.map(b => (
        <div key={b.id} className="flex gap-1 items-center">
          <input 
            type="text" 
            placeholder="Nome" 
            className="flex-grow bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px]" 
            value={b.name} 
            onChange={(e) => onChange(bonuses.map(x => x.id === b.id ? { ...x, name: e.target.value } : x))}
          />
          <input 
            type="number" 
            className="w-8 bg-white border border-slate-200 rounded px-1 py-0.5 text-[9px] text-center font-bold" 
            value={b.value} 
            onChange={(e) => onChange(bonuses.map(x => x.id === b.id ? { ...x, value: parseInt(e.target.value) || 0 } : x))}
          />
          <button onClick={() => onChange(bonuses.filter(x => x.id !== b.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={10}/></button>
        </div>
      ))}
    </div>
  </div>
);
