import React from 'react';
import { Plus, Trash2, Backpack } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { EquipmentEntry } from '../types';
import { SectionHeader } from './SectionHeader';
import { ATTRIBUTE_LABELS, INITIAL_SKILLS } from '../constants';

export const EquipmentList = ({ 
  title,
  icon: Icon,
  items, 
  onAdd, 
  onRemove, 
  onUpdate, 
  className = "h-64",
  addButtonLabel = "Adicionar"
}: { 
  title: string;
  icon: any;
  items: EquipmentEntry[]; 
  onAdd: () => void; 
  onRemove: (id: string) => void; 
  onUpdate: (id: string, field: keyof EquipmentEntry, val: any) => void;
  className?: string;
  addButtonLabel?: string;
}) => (
  <div className={`flex-grow border border-slate-300 rounded-lg p-1 bg-white flex flex-col ${className}`}>
    <SectionHeader title={title} icon={Icon} />
    <div className="flex-grow flex flex-col gap-2 p-2 overflow-y-auto min-h-[100px]">
      {items.map(item => (
        <div key={item.id} className="bg-slate-50 border border-slate-200 rounded p-2 relative group hover:border-cyan-300 transition-all">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2 flex-grow">
              <input 
                type="checkbox" 
                checked={item.isEquipped} 
                onChange={(e) => onUpdate(item.id, 'isEquipped', e.target.checked)}
                className="w-3 h-3 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                title="Ativo/Equipado"
              />
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-slate-200 focus:border-cyan-500 focus:outline-none text-[11px] font-bold font-tech uppercase text-slate-800 placeholder-slate-400"
                placeholder="Título"
                value={item.title}
                onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
              />
            </div>
            <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 ml-2 transition-colors shrink-0"><Trash2 size={12}/></button>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1 mt-1">
            <select 
              value={item.bonusType} 
              onChange={(e) => onUpdate(item.id, 'bonusType', e.target.value)}
              className="text-[9px] uppercase font-bold text-slate-500 bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none max-w-[80px]"
            >
              <option value="none">Sem Bônus</option>
              <option value="attack">Acerto</option>
              <option value="damage">Dano</option>
              <option value="spellDC">CD Magia</option>
              <option value="ac">Armadura</option>
              <option value="hp">Vida (PV)</option>
              <option value="skill">Perícia</option>
              <option value="save">Resistência</option>
            </select>
            
            {item.bonusType !== 'none' && (
              <>
                {(item.bonusType === 'skill' || item.bonusType === 'save') && (
                  <select
                    value={item.bonusTarget || ''}
                    onChange={(e) => onUpdate(item.id, 'bonusTarget', e.target.value)}
                    className="text-[9px] uppercase font-bold text-slate-500 bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none max-w-[80px]"
                  >
                    <option value="">Alvo...</option>
                    {item.bonusType === 'skill' && Object.entries(INITIAL_SKILLS).map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                    {item.bonusType === 'save' && Object.entries(ATTRIBUTE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                )}

                <select 
                  value={item.bonusSource} 
                  onChange={(e) => onUpdate(item.id, 'bonusSource', e.target.value)}
                  className="text-[9px] uppercase font-bold text-slate-500 bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none"
                >
                  <option value="flat">Fixo</option>
                  <option value="prof">Prof.</option>
                  <option value="for">FOR</option>
                  <option value="des">DES</option>
                  <option value="con">CON</option>
                  <option value="int">INT</option>
                  <option value="sab">SAB</option>
                  <option value="car">CAR</option>
                </select>
                
                {item.bonusSource === 'flat' && (
                  <input 
                    type="number" 
                    className="w-10 text-[10px] text-center font-bold bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none"
                    value={item.bonusValue}
                    onChange={(e) => onUpdate(item.id, 'bonusValue', parseInt(e.target.value) || 0)}
                  />
                )}
              </>
            )}
          </div>

          <TextareaAutosize 
            className="w-full bg-transparent resize-none text-[10px] text-slate-600 focus:outline-none placeholder-slate-300 mt-1"
            minRows={1}
            placeholder="Descrição..."
            value={item.description}
            onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          />
        </div>
      ))}
      <button onClick={onAdd} className="w-full border-2 border-dashed border-slate-200 rounded-lg py-2 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-all text-[9px] font-bold uppercase tracking-wider gap-2 group shrink-0">
        <Plus size={12} className="group-hover:scale-110" /> {addButtonLabel}
      </button>
    </div>
  </div>
);
