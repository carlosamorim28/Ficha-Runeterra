import React from 'react';
import { Trash2, Dices, GripVertical } from 'lucide-react';
import { Spell } from '../types';
import { AttrSelect } from './AttrSelect';
import { BonusList } from './BonusList';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSpellItemProps {
  spell: Spell;
  updateSpell: (id: string, field: keyof Spell, value: any) => void;
  removeSpell: (id: string) => void;
  rollDice: (label: string, formula: string | number, type?: 'damage' | 'check') => void;
  calculateSpellCastValue: (spell: Spell) => number;
  calculateSpellEffectBonus: (spell: Spell) => number;
}

export const SortableSpellItem = ({ 
  spell, 
  updateSpell, 
  removeSpell, 
  rollDice, 
  calculateSpellCastValue, 
  calculateSpellEffectBonus 
}: SortableSpellItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: spell.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const castValue = calculateSpellCastValue(spell);
  const effectBonus = calculateSpellEffectBonus(spell);
  const effectFormula = `${spell.effectDice}${effectBonus > 0 ? '+' + effectBonus : (effectBonus < 0 ? effectBonus : '')}`;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-white border border-slate-200 rounded-lg p-3 shadow-sm relative group transition-all flex gap-2 ${spell.type === 'damage' ? 'border-l-4 border-l-red-500' : spell.type === 'defense' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-purple-500'}`}
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 flex items-center"
      >
        <GripVertical size={14} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-grow flex flex-col">
            <input 
              type="text" 
              value={spell.name} 
              onChange={(e) => updateSpell(spell.id, 'name', e.target.value)} 
              className="w-full bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none text-sm font-bold text-slate-900" 
              placeholder="Nome da Magia" 
            />
            <div className="flex gap-2 mt-1">
              <select 
                value={spell.type} 
                onChange={(e) => updateSpell(spell.id, 'type', e.target.value)} 
                className="text-[10px] uppercase font-bold text-slate-500 bg-transparent focus:outline-none cursor-pointer hover:text-cyan-700"
              >
                <option value="damage">Dano</option>
                <option value="defense">Defesa</option>
                <option value="utility">Utilidade</option>
              </select>
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Ciclo</span>
                <input 
                  type="number" 
                  className="w-6 text-center text-[10px] font-bold bg-slate-100 rounded" 
                  value={spell.cycle} 
                  onChange={(e) => updateSpell(spell.id, 'cycle', parseInt(e.target.value)||1)} 
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-cyan-600">Mana</span>
                <input 
                  type="number" 
                  className="w-6 text-center text-[10px] font-bold bg-cyan-50 rounded text-cyan-800" 
                  value={spell.manaCost} 
                  onChange={(e) => updateSpell(spell.id, 'manaCost', parseInt(e.target.value)||0)} 
                />
              </div>
            </div>
          </div>
          <button onClick={() => removeSpell(spell.id)} className="text-slate-300 hover:text-red-500 p-1">
            <Trash2 size={14} />
          </button>
        </div>
        <div className="bg-slate-50 rounded border border-slate-100 p-2 mb-2">
          {(spell.type === 'damage' || spell.type === 'utility') && (
            <div className="mb-3 pb-2 border-b border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <div className="flex gap-2">
                  <button onClick={() => updateSpell(spell.id, 'castMode', 'save')} className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${spell.castMode === 'save' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>CD</button>
                  <button onClick={() => updateSpell(spell.id, 'castMode', 'attack')} className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${spell.castMode === 'attack' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Ataque</button>
                </div>
                <div className="flex items-center gap-1">
                  {spell.castMode === 'save' && <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">CD</span>}
                  <button onClick={spell.castMode === 'attack' ? () => rollDice(`Ataque Magia: ${spell.name}`, castValue) : undefined} className={`flex items-center gap-1 font-tech font-bold text-base text-slate-800 bg-white px-2 rounded border border-slate-200 ${spell.castMode === 'attack' ? 'hover:text-cyan-600 hover:border-cyan-500 cursor-pointer group/btn' : 'cursor-default'}`}>
                    {spell.castMode === 'attack' && <Dices size={12} className="text-slate-400 group-hover/btn:text-cyan-500" />}
                    {spell.castMode === 'attack' && (castValue >= 0 ? '+' : '')}{castValue}
                  </button>
                </div>
              </div>
              <div className="flex gap-1 mb-1">
                <AttrSelect value={spell.attr1} onChange={(v) => updateSpell(spell.id, 'attr1', v)} />
                <div className="flex items-center gap-1 pl-2">
                  <input type="checkbox" checked={spell.hasProficiency} onChange={(e) => updateSpell(spell.id, 'hasProficiency', e.target.checked)} className="w-3 h-3 rounded text-cyan-600 focus:ring-cyan-500"/>
                  <span className="text-[9px] font-bold uppercase text-slate-500">Prof.</span>
                </div>
              </div>
              <BonusList title="Bônus" bonuses={spell.bonuses} onChange={(b) => updateSpell(spell.id, 'bonuses', b)} />
            </div>
          )}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold uppercase text-slate-600">{spell.type === 'damage' ? 'Dano' : (spell.type === 'defense' ? 'CA' : 'Efeito')}</span>
              <div className="flex items-center gap-1">
                <span className="font-tech font-bold text-sm text-slate-800">{spell.effectDice} {effectBonus > 0 ? `+ ${effectBonus}` : (effectBonus < 0 ? effectBonus : '')}</span>
                <button onClick={() => rollDice(`Efeito: ${spell.name}`, effectFormula, 'damage')} className="text-slate-400 hover:text-cyan-600 p-0.5 rounded transition-colors">
                  <Dices size={12} />
                </button>
              </div>
            </div>
            <div className="flex gap-1 mb-1">
              <input type="text" className="w-1/3 bg-white border border-slate-300 rounded px-1 py-0.5 text-xs text-center font-tech" value={spell.effectDice} onChange={(e) => updateSpell(spell.id, 'effectDice', e.target.value)} placeholder="1d6" />
              <input type="text" className="flex-grow bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px]" value={spell.effectType} onChange={(e) => updateSpell(spell.id, 'effectType', e.target.value)} placeholder="Tipo" />
            </div>
            <BonusList title="Bônus Extra" bonuses={spell.effectBonuses} onChange={(b) => updateSpell(spell.id, 'effectBonuses', b)} />
          </div>
        </div>
        <textarea className="w-full bg-transparent border-t border-slate-100 pt-2 text-xs text-slate-600 focus:outline-none resize-none" rows={2} value={spell.description || ''} onChange={(e) => updateSpell(spell.id, 'description', e.target.value)} placeholder="Descrição..." />
      </div>
    </div>
  );
};
