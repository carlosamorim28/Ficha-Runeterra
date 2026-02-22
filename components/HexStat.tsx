import React from 'react';
import { Dices } from 'lucide-react';

export const HexStat = ({ 
  label, 
  value, 
  modifier, 
  onChange,
  onRoll
}: { 
  label: string; 
  value: number; 
  modifier: number; 
  onChange: (val: string) => void;
  onRoll: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center relative mb-2 group">
      <div className="font-bold text-[10px] uppercase tracking-wider mb-1 text-slate-600 group-hover:text-amber-700 transition-colors">{label}</div>
      <div className="relative w-24 h-28 flex items-center justify-center filter drop-shadow-sm group-hover:drop-shadow-md transition-all">
        {/* Hexagon Shape SVG - Styled */}
        <svg viewBox="0 0 100 115" className="absolute w-full h-full text-slate-200 fill-current">
          <path d="M50 0 L100 28.8 L100 86.6 L50 115.4 L0 86.6 L0 28.8 Z" stroke="#334155" strokeWidth="2.5" className="group-hover:stroke-amber-600 transition-colors duration-300" />
          <path d="M50 5 L95 31 L95 84 L50 110 L5 84 L5 31 Z" stroke="#cbd5e1" strokeWidth="1" fill="white" />
        </svg>
        
        <div className="z-10 flex flex-col items-center justify-center mt-[-6px]">
          {/* Modifier (Big) - CLICKABLE AREA */}
          <button 
            onClick={onRoll}
            className="group/btn relative flex items-center justify-center w-14 h-10 mb-1 cursor-pointer"
            title={`Rolar Teste de ${label}`}
          >
             <span className="text-3xl font-bold font-tech text-slate-800 tracking-tighter group-hover/btn:text-cyan-700 group-hover/btn:scale-110 transition-all">
                {modifier >= 0 ? '+' : ''}{modifier}
             </span>
             <div className="absolute -right-2 top-0 opacity-0 group-hover/btn:opacity-100 transition-opacity text-cyan-600 bg-white rounded-full p-0.5 shadow-sm border border-cyan-100">
               <Dices size={12} />
             </div>
          </button>

          {/* Score (Small in bubble) */}
          <div className="mt-0 bg-white border border-slate-400 rounded-md w-12 h-7 flex items-center justify-center shadow-inner relative z-20">
             <input 
               type="text" 
               inputMode="numeric"
               className="w-full h-full text-center bg-transparent text-sm font-bold focus:outline-none text-slate-600"
               value={value}
               onChange={(e) => onChange(e.target.value)}
             />
          </div>
        </div>
      </div>
    </div>
  );
};
