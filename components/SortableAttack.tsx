import React from 'react';
import { Trash2, Swords, Skull, Dices, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TextareaAutosize from 'react-textarea-autosize';
import { Attack, AttributeKey } from '../types';
import { AttrSelect } from './AttrSelect';
import { BonusList } from './BonusList';

export const SortableAttack = ({ 
  atk, 
  accBonus, 
  dmgBonus, 
  dmgFormula, 
  updateAttack, 
  removeAttack, 
  rollDice 
}: { 
  atk: Attack; 
  accBonus: number; 
  dmgBonus: number; 
  dmgFormula: string; 
  updateAttack: (id: string, field: keyof Attack, value: any) => void;
  removeAttack: (id: string) => void;
  rollDice: (title: string, diceString: string | number, type?: 'd20' | 'damage') => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: atk.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="bg-white border-l-4 border-l-slate-800 border-y border-r border-slate-200 rounded-r-md p-3 shadow-sm relative group hover:border-l-amber-500 transition-all"
    >
      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="flex items-center gap-2 flex-grow">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
            <GripVertical size={16} />
          </div>
          <input 
            type="text" 
            value={atk.name} 
            onChange={(e) => updateAttack(atk.id, 'name', e.target.value)} 
            className="w-full bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none text-base font-bold text-slate-900 placeholder-slate-300" 
            placeholder="Nome da Arma" 
          />
        </div>
        <button onClick={() => removeAttack(atk.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Remover ataque">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3 pl-6">
        <div className="bg-slate-50 rounded border border-slate-200 p-2">
          <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
            <div className="flex items-center gap-1">
              <Swords size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold uppercase text-slate-600">Acerto</span>
            </div>
            <button 
              onClick={() => rollDice(`Acerto: ${atk.name}`, accBonus)} 
              className="flex items-center gap-1 font-tech font-bold text-lg text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-colors group/btn"
            >
              <Dices size={14} className="text-slate-400 group-hover/btn:text-cyan-500" />
              <span>{accBonus >= 0 ? '+' : ''}{accBonus}</span>
            </button>
          </div>
          <div className="flex gap-1 mb-1">
            <AttrSelect value={atk.accAttr1} onChange={(v) => updateAttack(atk.id, 'accAttr1', v)} />
            <AttrSelect value={atk.accAttr2} onChange={(v) => updateAttack(atk.id, 'accAttr2', v)} />
          </div>
          <div className="flex items-center gap-2 mb-1 pl-1">
            <input 
              type="checkbox" 
              checked={atk.accProf} 
              onChange={(e) => updateAttack(atk.id, 'accProf', e.target.checked)} 
              className="w-3 h-3 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="text-[9px] font-bold uppercase text-slate-500">Proficiência</span>
          </div>
          <BonusList title="Bônus Acerto" bonuses={atk.accBonuses} onChange={(b) => updateAttack(atk.id, 'accBonuses', b)} />
        </div>
        <div className="bg-slate-50 rounded border border-slate-200 p-2">
          <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
            <div className="flex items-center gap-1">
              <Skull size={12} className="text-slate-400" />
              <span className="text-[10px] font-bold uppercase text-slate-600">Dano</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-right">
                <span className="font-tech font-bold text-sm text-slate-800 block leading-none">{atk.dmgDice} {dmgBonus > 0 ? `+ ${dmgBonus}` : (dmgBonus < 0 ? dmgBonus : '')}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">{atk.dmgType}</span>
              </div>
              <button onClick={() => rollDice(`Dano: ${atk.name}`, dmgFormula, 'damage')} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors" title="Rolar Dano">
                <Dices size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-1 mb-1">
            <input type="text" className="w-1/3 bg-white border border-slate-300 rounded px-1 py-0.5 text-xs text-center font-tech" placeholder="1d8" value={atk.dmgDice} onChange={(e) => updateAttack(atk.id, 'dmgDice', e.target.value)} />
            <input type="text" className="flex-grow bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px]" placeholder="Tipo" value={atk.dmgType} onChange={(e) => updateAttack(atk.id, 'dmgType', e.target.value)} />
          </div>
          <div className="flex gap-1 mb-1">
            <AttrSelect value={atk.dmgAttr1} onChange={(v) => updateAttack(atk.id, 'dmgAttr1', v)} />
            <AttrSelect value={atk.dmgAttr2} onChange={(v) => updateAttack(atk.id, 'dmgAttr2', v)} />
          </div>
          <BonusList title="Bônus Dano" bonuses={atk.dmgBonuses} onChange={(b) => updateAttack(atk.id, 'dmgBonuses', b)} />
        </div>
      </div>
      <div className="pl-6">
        <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Descrição</label>
        <TextareaAutosize 
          className="w-full bg-slate-50 border border-slate-100 rounded p-2 text-xs text-slate-600 focus:outline-none focus:border-cyan-200 resize-none" 
          minRows={2} 
          value={atk.description || ''} 
          onChange={(e) => updateAttack(atk.id, 'description', e.target.value)} 
          placeholder="Alcance, etc..." 
        />
      </div>
    </div>
  );
};
