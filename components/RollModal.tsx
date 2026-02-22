import React from 'react';
import { X } from 'lucide-react';

export interface RollResult {
  title: string;
  total: number;
  diceRolls: number[];
  modifier: number;
  isCrit: boolean;
  isFumble: boolean;
  formula: string;
}

export const RollModal = ({ result, onClose }: { result: RollResult | null, onClose: () => void }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white border-2 border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        
        <div className="text-center mb-4">
          <h3 className="font-tech text-slate-500 uppercase tracking-widest text-sm font-bold mb-1">{result.title}</h3>
          <div className="text-xs text-slate-400 font-mono">{result.formula}</div>
        </div>

        <div className="flex justify-center items-center mb-6">
          <div className={`relative w-32 h-32 flex items-center justify-center rounded-full border-4 ${result.isCrit ? 'border-amber-500 bg-amber-50 text-amber-600' : result.isFumble ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-800 bg-slate-50 text-slate-900'}`}>
             <span className="text-6xl font-black font-tech tracking-tighter">
               {result.total}
             </span>
             {result.isCrit && <div className="absolute -top-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Crítico!</div>}
             {result.isFumble && <div className="absolute -top-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Falha!</div>}
          </div>
        </div>

        <div className="bg-slate-100 rounded p-3 text-center border border-slate-200">
           <div className="text-xs text-slate-500 font-bold uppercase mb-1">Detalhes</div>
           <div className="flex flex-wrap justify-center gap-2 text-sm font-mono text-slate-700">
              <span>[{result.diceRolls.join(', ')}]</span>
              <span>{result.modifier >= 0 ? '+' : ''}{result.modifier}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
