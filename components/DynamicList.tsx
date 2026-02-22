import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ItemEntry } from '../types';
import { SectionHeader } from './SectionHeader';

export const DynamicList = ({ 
  items, 
  title, 
  icon, 
  onAdd, 
  onRemove, 
  onUpdate, 
  placeholderTitle = "Título", 
  placeholderDesc = "Descrição...",
  className = ""
}: { 
  items: ItemEntry[]; 
  title: string; 
  icon: React.ElementType; 
  onAdd: () => void; 
  onRemove: (id: string) => void; 
  onUpdate: (id: string, field: keyof ItemEntry, val: string) => void;
  placeholderTitle?: string;
  placeholderDesc?: string;
  className?: string;
}) => (
  <div className={`flex-grow border border-slate-300 rounded-lg p-1 bg-white flex flex-col ${className}`}>
    <SectionHeader title={title} icon={icon} />
    <div className="flex-grow flex flex-col gap-2 p-2 overflow-y-auto min-h-[100px]">
      {items.map(item => (
        <div key={item.id} className="bg-slate-50 border border-slate-200 rounded p-2 relative group hover:border-cyan-300 transition-all">
          <div className="flex justify-between items-start mb-1">
            <input 
              type="text" 
              className="w-full bg-transparent border-b border-slate-200 focus:border-cyan-500 focus:outline-none text-[11px] font-bold font-tech uppercase text-slate-800 placeholder-slate-400"
              placeholder={placeholderTitle}
              value={item.title}
              onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
            />
            <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 ml-2 transition-colors shrink-0"><Trash2 size={12}/></button>
          </div>
          <textarea 
            className="w-full bg-transparent resize-none text-[10px] text-slate-600 focus:outline-none placeholder-slate-300"
            rows={2}
            placeholder={placeholderDesc}
            value={item.description}
            onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          />
        </div>
      ))}
      <button onClick={onAdd} className="w-full border-2 border-dashed border-slate-200 rounded-lg py-2 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-all text-[9px] font-bold uppercase tracking-wider gap-2 group shrink-0">
        <Plus size={12} className="group-hover:scale-110" /> Adicionar {title}
      </button>
    </div>
  </div>
);
