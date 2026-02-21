
import React, { useState, useEffect, useCallback } from 'react';
import { AttributeKey, CharacterSheetData, Skill, NamedBonus, Attack, Spell, SpellType, ItemEntry, EquipmentEntry, BonusType } from './types';
import { DEFAULT_CHARACTER, ATTRIBUTE_LABELS } from './constants';
import { Save, Printer, RefreshCw, Shield, Zap, Activity, Skull, Swords, Sparkles, Scroll, Backpack, Brain, Plus, Trash2, X, ChevronDown, Calculator, HandMetal, HeartPulse, ShieldAlert, Dices, Download, Upload } from 'lucide-react';

// --- Utility Components ---

const InputUnderline = ({ 
  value, 
  onChange, 
  placeholder, 
  className = "", 
  centered = false,
  label
}: { 
  value: string | number; 
  onChange: (val: string) => void; 
  placeholder?: string; 
  className?: string;
  centered?: boolean;
  label?: string;
}) => (
  <div className="flex flex-col w-full group">
    {label && <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5 group-focus-within:text-cyan-700 transition-colors">{label}</span>}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-transparent border-b border-slate-300 focus:border-cyan-600 focus:bg-cyan-50/50 focus:outline-none px-1 py-1 w-full text-sm font-tech text-slate-900 transition-all ${centered ? 'text-center' : ''} ${className}`}
    />
  </div>
);

const SectionHeader = ({ title, icon: Icon }: { title: string, icon?: React.ElementType }) => (
  <div className="flex items-center gap-2 border-b-2 border-slate-800 bg-slate-100 px-2 py-1 mb-2 rounded-t-sm">
    {Icon && <Icon size={14} className="text-amber-600" />}
    <h3 className="font-tech uppercase font-bold text-xs tracking-wider text-slate-800">{title}</h3>
  </div>
);

const HexStat = ({ 
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

// Reusable Dynamic List Component
const DynamicList = ({ 
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

const EquipmentList = ({ 
  items, 
  onAdd, 
  onRemove, 
  onUpdate, 
}: { 
  items: EquipmentEntry[]; 
  onAdd: () => void; 
  onRemove: (id: string) => void; 
  onUpdate: (id: string, field: keyof EquipmentEntry, val: any) => void;
}) => (
  <div className="flex-grow border border-slate-300 rounded-lg p-1 bg-white flex flex-col h-64">
    <SectionHeader title="Equipamento" icon={Backpack} />
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
                title="Equipado"
              />
              <input 
                type="text" 
                className="w-full bg-transparent border-b border-slate-200 focus:border-cyan-500 focus:outline-none text-[11px] font-bold font-tech uppercase text-slate-800 placeholder-slate-400"
                placeholder="Item"
                value={item.title}
                onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
              />
            </div>
            <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 ml-2 transition-colors shrink-0"><Trash2 size={12}/></button>
          </div>
          
          <div className="flex gap-1 mb-1 mt-1">
            <select 
              value={item.bonusType} 
              onChange={(e) => onUpdate(item.id, 'bonusType', e.target.value)}
              className="text-[9px] uppercase font-bold text-slate-500 bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none"
            >
              <option value="none">Sem Bônus</option>
              <option value="attack">Acerto</option>
              <option value="damage">Dano</option>
              <option value="spellDC">CD Magia</option>
              <option value="ac">Armadura (CA)</option>
            </select>
            
            {item.bonusType !== 'none' && (
              <>
                <select 
                  value={item.bonusSource} 
                  onChange={(e) => onUpdate(item.id, 'bonusSource', e.target.value)}
                  className="text-[9px] uppercase font-bold text-slate-500 bg-white border border-slate-200 rounded px-1 py-0.5 focus:outline-none"
                >
                  <option value="flat">Fixo</option>
                  <option value="prof">Proficiência</option>
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

          <textarea 
            className="w-full bg-transparent resize-none text-[10px] text-slate-600 focus:outline-none placeholder-slate-300 mt-1"
            rows={1}
            placeholder="Peso, propriedades..."
            value={item.description}
            onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
          />
        </div>
      ))}
      <button onClick={onAdd} className="w-full border-2 border-dashed border-slate-200 rounded-lg py-2 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-all text-[9px] font-bold uppercase tracking-wider gap-2 group shrink-0">
        <Plus size={12} className="group-hover:scale-110" /> Adicionar Equipamento
      </button>
    </div>
  </div>
);

const BonusList = ({ 
  bonuses, 
  onChange,
  title
}: { 
  bonuses: NamedBonus[]; 
  onChange: (bonuses: NamedBonus[]) => void;
  title: string;
}) => {
  const addBonus = () => {
    onChange([...bonuses, { id: Date.now().toString(), name: '', value: 0 }]);
  };

  const updateBonus = (id: string, field: 'name' | 'value', val: string | number) => {
    onChange(bonuses.map(b => b.id === id ? { ...b, [field]: val } : b));
  };

  const removeBonus = (id: string) => {
    onChange(bonuses.filter(b => b.id !== id));
  };

  return (
    <div className="mt-2 text-xs">
       <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-[9px] uppercase text-slate-400">{title} ({bonuses.length})</span>
          <button onClick={addBonus} className="text-cyan-700 hover:text-cyan-900 font-bold text-[9px] uppercase flex items-center gap-1">
            <Plus size={8} /> Add
          </button>
       </div>
       {bonuses.length > 0 && (
         <div className="space-y-1 bg-slate-50 p-1 rounded border border-slate-200">
            {bonuses.map(b => (
              <div key={b.id} className="flex gap-1 items-center">
                 <input 
                   type="text" 
                   className="flex-grow bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px]"
                   placeholder="Nome (ex: Item)" 
                   value={b.name}
                   onChange={(e) => updateBonus(b.id, 'name', e.target.value)}
                 />
                 <input 
                   type="number" 
                   className="w-10 bg-white border border-slate-300 rounded px-1 py-0.5 text-center text-[10px] font-tech font-bold"
                   value={b.value}
                   onChange={(e) => updateBonus(b.id, 'value', parseInt(e.target.value)||0)}
                 />
                 <button onClick={() => removeBonus(b.id)} className="text-red-400 hover:text-red-600"><X size={10} /></button>
              </div>
            ))}
         </div>
       )}
    </div>
  );
};

// --- Modal Component ---

interface RollResult {
  title: string;
  total: number;
  diceRolls: number[];
  modifier: number;
  isCrit: boolean;
  isFumble: boolean;
  formula: string;
}

interface SavedCharacter {
  id: string;
  name: string;
  classLevel: string;
  date: string;
  data: CharacterSheetData;
}

const SaveLoadModal = ({ 
  currentData, 
  onLoad, 
  onClose 
}: { 
  currentData: CharacterSheetData; 
  onLoad: (data: CharacterSheetData) => void; 
  onClose: () => void; 
}) => {
  const [savedChars, setSavedChars] = useState<SavedCharacter[]>(() => {
    const saved = localStorage.getItem('runarcana-saved-chars');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = () => {
    const newChar: SavedCharacter = {
      id: Date.now().toString(),
      name: currentData.info.charName || 'Sem Nome',
      classLevel: currentData.info.classLevel || 'Sem Classe',
      date: new Date().toLocaleString(),
      data: currentData
    };
    
    const existingIndex = savedChars.findIndex(c => c.name === newChar.name && newChar.name !== 'Sem Nome');
    let updatedChars;
    if (existingIndex >= 0) {
      if (confirm(`Já existe uma ficha salva com o nome "${newChar.name}". Deseja sobrescrever?`)) {
        updatedChars = [...savedChars];
        updatedChars[existingIndex] = { ...newChar, id: savedChars[existingIndex].id };
      } else {
        return;
      }
    } else {
      updatedChars = [...savedChars, newChar];
    }
    
    setSavedChars(updatedChars);
    localStorage.setItem('runarcana-saved-chars', JSON.stringify(updatedChars));
    alert('Ficha salva com sucesso!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta ficha salva?')) {
      const updatedChars = savedChars.filter(c => c.id !== id);
      setSavedChars(updatedChars);
      localStorage.setItem('runarcana-saved-chars', JSON.stringify(updatedChars));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(currentData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentData.info.charName || 'personagem'}_runarcana.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        
        // Basic validation
        if (parsedData && typeof parsedData === 'object' && 'info' in parsedData && 'attributes' in parsedData) {
          onLoad(parsedData);
          onClose();
          alert('Ficha importada com sucesso!');
        } else {
          alert('Arquivo de ficha inválido.');
        }
      } catch (error) {
        alert('Erro ao ler o arquivo. Certifique-se de que é um arquivo JSON válido exportado deste sistema.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white border-2 border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        
        <h2 className="font-tech text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Save size={20} /> Gerenciar Fichas
        </h2>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={handleSave} className="col-span-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors">
            <Save size={16} /> Salvar Ficha Atual no Navegador
          </button>
          
          <button onClick={handleExport} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors text-xs">
            <Download size={14} /> Exportar Arquivo
          </button>
          
          <label className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs">
            <Upload size={14} /> Importar Arquivo
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>

        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">Fichas Salvas no Navegador</h3>
        
        <div className="flex-grow overflow-y-auto space-y-2 pr-2">
          {savedChars.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-4">Nenhuma ficha salva.</p>
          ) : (
            savedChars.map(char => (
              <div key={char.id} className="border border-slate-200 rounded p-3 flex justify-between items-center bg-slate-50 hover:border-cyan-300 transition-colors">
                <div>
                  <div className="font-bold text-slate-800">{char.name}</div>
                  <div className="text-xs text-slate-500">{char.classLevel}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{char.date}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { onLoad(char.data); onClose(); }} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors">
                    Carregar
                  </button>
                  <button onClick={() => handleDelete(char.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const RollModal = ({ result, onClose }: { result: RollResult | null, onClose: () => void }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white border-2 border-slate-800 rounded-xl p-6 w-full max-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
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

// --- Main App ---

export default function App() {
  // Load initial state from local storage or default
  const [data, setData] = useState<CharacterSheetData>(() => {
    const saved = localStorage.getItem('runarcana-sheet-v1');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_CHARACTER;
    
    // Migration logic for older string fields
    const listFields: Array<keyof CharacterSheetData> = ['features', 'languages', 'proficiencies', 'notes'];
    listFields.forEach(field => {
      if (typeof parsed[field] === 'string') {
        parsed[field] = [];
      }
    });

    if (typeof parsed.equipment === 'string') {
      parsed.equipment = [];
    } else if (Array.isArray(parsed.equipment)) {
      parsed.equipment = parsed.equipment.map((eq: any) => ({
        ...eq,
        isEquipped: eq.isEquipped ?? false,
        bonusType: eq.bonusType ?? 'none',
        bonusSource: eq.bonusSource ?? 'flat',
        bonusValue: eq.bonusValue ?? 0,
      }));
    } else {
      parsed.equipment = [];
    }
    
    if (parsed.info.level === undefined) {
      parsed.info.level = 1;
    }
    
    return parsed;
  });

  const [rollResult, setRollResult] = useState<RollResult | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Calculate Modifiers
  const getModifier = (score: number) => Math.floor((score - 10) / 2);

  // Recalculate derived stats
  useEffect(() => {
    setData(prev => {
      const newAttrs = { ...prev.attributes };
      let changed = false;

      (Object.keys(newAttrs) as AttributeKey[]).forEach(key => {
        const mod = getModifier(newAttrs[key].value);
        if (newAttrs[key].modifier !== mod) {
          newAttrs[key].modifier = mod;
          changed = true;
        }
      });

      const level = Number(prev.info.level) || 1;
      const newProficiencyBonus = Math.max(2, Math.ceil(level / 4) + 1);

      if (prev.vitals.proficiencyBonus !== newProficiencyBonus) {
        changed = true;
      }

      const dexMod = newAttrs.des.modifier;
      const wisMod = newAttrs.sab.modifier;
      const prof = newProficiencyBonus;

      const newPassivePerception = 10 + (prev.skills.percepcao.proficient ? (prev.skills.percepcao.attr === 'sab' ? wisMod + prof : 0) : wisMod);
      const newPassiveInsight = 10 + (prev.skills.intuicao.proficient ? (prev.skills.intuicao.attr === 'sab' ? wisMod + prof : 0) : wisMod);

      if (prev.vitals.initiative !== dexMod || 
          prev.vitals.passivePerception !== newPassivePerception || 
          prev.vitals.passiveInsight !== newPassiveInsight) {
        changed = true;
      }

      if (!changed) return prev;

      return {
        ...prev,
        attributes: newAttrs,
        vitals: {
          ...prev.vitals,
          proficiencyBonus: prof,
          initiative: dexMod, 
          passivePerception: newPassivePerception, 
          passiveInsight: newPassiveInsight,
        }
      };
    });
  }, [
    data.attributes.for.value, data.attributes.des.value, data.attributes.con.value,
    data.attributes.int.value, data.attributes.sab.value, data.attributes.car.value,
    data.info.level,
    data.skills.percepcao.proficient, data.skills.percepcao.attr,
    data.skills.intuicao.proficient, data.skills.intuicao.attr
  ]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('runarcana-sheet-v1', JSON.stringify(data));
  }, [data]);

  const updateInfo = (field: keyof typeof data.info, val: string | number) => {
    setData(prev => ({ ...prev, info: { ...prev.info, [field]: val } }));
  };

  const getProficiencyTier = (level: number) => {
    if (level >= 17) return 'Épico';
    if (level >= 13) return 'Mestre';
    if (level >= 5) return 'Regional';
    return 'Local';
  };

  const updateAttribute = (attr: AttributeKey, val: string) => {
    const num = parseInt(val) || 0;
    setData(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: { ...prev.attributes[attr], value: num } }
    }));
  };

  const toggleSkillProficiency = (skillKey: string) => {
    setData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skillKey]: { ...prev.skills[skillKey], proficient: !prev.skills[skillKey].proficient } }
    }));
  };
  
  const toggleSaveProficiency = (attr: AttributeKey) => {
    setData(prev => ({
      ...prev,
      savingThrows: { ...prev.savingThrows, [attr]: !prev.savingThrows[attr] }
    }));
  };

  const handlePrint = () => window.print();
  const handleReset = () => {
    if (confirm('Tem certeza que deseja limpar a ficha?')) {
      setData(DEFAULT_CHARACTER);
    }
  };

  const calculateSkillTotal = (skill: Skill) => {
    const attrMod = data.attributes[skill.attr].modifier;
    const profBonus = data.vitals.proficiencyBonus;
    return attrMod + (skill.proficient ? profBonus : 0) + (skill.expertise ? profBonus : 0);
  };
  
  const calculateSaveTotal = (attr: AttributeKey) => {
    const attrMod = data.attributes[attr].modifier;
    const profBonus = data.vitals.proficiencyBonus;
    const isProficient = data.savingThrows[attr];
    return attrMod + (isProficient ? profBonus : 0);
  };

  const rollDice = (title: string, diceString: string | number, type: 'd20' | 'damage' = 'd20') => {
    let total = 0;
    let diceRolls: number[] = [];
    let modifier = 0;
    let isCrit = false;
    let isFumble = false;
    let formula = '';

    if (type === 'd20') {
      const roll = Math.floor(Math.random() * 20) + 1;
      diceRolls.push(roll);
      modifier = typeof diceString === 'number' ? diceString : parseInt(diceString) || 0;
      total = roll + modifier;
      isCrit = roll === 20;
      isFumble = roll === 1;
      formula = `1d20 (${roll}) + ${modifier}`;
    } else {
      const str = String(diceString).toLowerCase().replace(/\s/g, '');
      const parts = str.split('+');
      parts.forEach(part => {
        if (part.includes('d')) {
          const [count, faces] = part.split('d').map(n => parseInt(n) || 1);
          for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * faces) + 1;
            diceRolls.push(r);
            total += r;
          }
        } else {
           const val = parseInt(part) || 0;
           modifier += val;
           total += val;
        }
      });
      formula = `${diceString}`;
    }

    setRollResult({ title, total, diceRolls, modifier, isCrit, isFumble, formula });
  };

  const addAttack = () => {
    const newId = Date.now().toString();
    const newAttack: Attack = {
      id: newId, name: '', description: '',
      accAttr1: 'for', accAttr2: 'none', accProf: true, accBonuses: [],
      dmgAttr1: 'for', dmgAttr2: 'none', dmgDice: '1d6', dmgType: 'Cortante', dmgBonuses: []
    };
    setData(prev => ({ ...prev, attacks: [...prev.attacks, newAttack] }));
  };

  const removeAttack = (id: string) => {
    setData(prev => ({ ...prev, attacks: prev.attacks.filter(a => a.id !== id) }));
  };

  const updateAttack = (id: string, field: keyof Attack, value: any) => {
    setData(prev => ({ ...prev, attacks: prev.attacks.map(a => a.id === id ? { ...a, [field]: value } : a) }));
  };

  const addSpell = () => {
    const newId = Date.now().toString();
    const newSpell: Spell = {
      id: newId, name: '', description: '', type: 'damage', cycle: 1, manaCost: 2,
      attr1: 'int', attr2: 'none', hasProficiency: true, castMode: 'save',
      bonuses: [], effectDice: '', effectType: 'Dano', effectBonuses: []
    };
    setData(prev => ({ ...prev, spells: [...prev.spells, newSpell] }));
  };

  const removeSpell = (id: string) => {
    setData(prev => ({ ...prev, spells: prev.spells.filter(s => s.id !== id) }));
  };

  const updateSpell = (id: string, field: keyof Spell, value: any) => {
    setData(prev => ({ ...prev, spells: prev.spells.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  };

  // Reusable generic list management
  const addListItem = (field: keyof CharacterSheetData) => {
    if (field === 'equipment') {
      const newItem: EquipmentEntry = { id: Date.now().toString(), title: '', description: '', isEquipped: false, bonusType: 'none', bonusSource: 'flat', bonusValue: 0 };
      setData(prev => ({ ...prev, equipment: [...prev.equipment, newItem] }));
      return;
    }
    const newItem: ItemEntry = { id: Date.now().toString(), title: '', description: '' };
    setData(prev => ({ ...prev, [field]: [...(prev[field] as ItemEntry[]), newItem] }));
  };

  const removeListItem = (field: keyof CharacterSheetData, id: string) => {
    if (field === 'equipment') {
      setData(prev => ({ ...prev, equipment: prev.equipment.filter(item => item.id !== id) }));
      return;
    }
    setData(prev => ({ ...prev, [field]: (prev[field] as ItemEntry[]).filter(item => item.id !== id) }));
  };

  const updateListItem = (field: keyof CharacterSheetData, id: string, itemField: keyof ItemEntry, val: string) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as ItemEntry[]).map(item => item.id === id ? { ...item, [itemField]: val } : item)
    }));
  };

  const updateEquipment = (id: string, field: keyof EquipmentEntry, val: any) => {
    setData(prev => ({
      ...prev,
      equipment: prev.equipment.map(item => item.id === id ? { ...item, [field]: val } : item)
    }));
  };

  // Helper to get attribute modifier by key
  const getAttrMod = (attrKey: AttributeKey | 'none') => {
    if (attrKey === 'none') return 0;
    return data.attributes[attrKey].modifier;
  };

  const getEquipmentBonus = (type: BonusType) => {
    return data.equipment.filter(eq => eq.isEquipped && eq.bonusType === type).reduce((sum, eq) => {
      let val = 0;
      if (eq.bonusSource === 'flat') val = eq.bonusValue;
      else if (eq.bonusSource === 'prof') val = data.vitals.proficiencyBonus;
      else val = getAttrMod(eq.bonusSource as AttributeKey);
      return sum + val;
    }, 0);
  };

  const calculateAttackBonus = (atk: Attack) => {
    let total = 0;
    total += getAttrMod(atk.accAttr1);
    total += getAttrMod(atk.accAttr2);
    if (atk.accProf) total += data.vitals.proficiencyBonus;
    atk.accBonuses.forEach(b => total += b.value);
    total += getEquipmentBonus('attack');
    return total;
  };

  const calculateDamageBonus = (atk: Attack) => {
    let total = 0;
    total += getAttrMod(atk.dmgAttr1);
    total += getAttrMod(atk.dmgAttr2);
    atk.dmgBonuses.forEach(b => total += b.value);
    total += getEquipmentBonus('damage');
    return total;
  };

  const calculateSpellCastValue = (spell: Spell) => {
    let total = 0;
    total += getAttrMod(spell.attr1);
    total += getAttrMod(spell.attr2);
    if (spell.hasProficiency) total += data.vitals.proficiencyBonus;
    spell.bonuses.forEach(b => total += b.value);
    
    if (spell.castMode === 'save') {
        return 8 + total + getEquipmentBonus('spellDC');
    }
    return total + getEquipmentBonus('attack');
  };

  const calculateSpellEffectBonus = (spell: Spell) => {
      let total = 0;
      total += getAttrMod(spell.attr1); 
      spell.effectBonuses.forEach(b => total += b.value);
      return total;
  };

  const AttrSelect = ({ value, onChange }: { value: string, onChange: (v: any) => void }) => (
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

  return (
    <div className="min-h-screen p-2 md:p-8 flex justify-center items-start">
      <RollModal result={rollResult} onClose={() => setRollResult(null)} />
      {showSaveModal && <SaveLoadModal currentData={data} onLoad={setData} onClose={() => setShowSaveModal(false)} />}
      
      <div className="w-full max-w-[1200px] bg-[#fdfbf7] shadow-2xl border border-slate-300 relative overflow-hidden">
        <div className="h-2 w-full bg-slate-900 flex">
           <div className="w-1/3 h-full bg-amber-500/80"></div>
           <div className="w-1/3 h-full bg-slate-900"></div>
           <div className="w-1/3 h-full bg-cyan-600/80"></div>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex justify-end gap-2 mb-6 no-print">
            <button onClick={() => setShowSaveModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-sm font-bold text-xs font-tech transition-colors">
              <Save size={14} /> SALVAR / CARREGAR
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-amber-500 hover:bg-slate-700 rounded-sm font-bold text-xs font-tech transition-colors border border-slate-900">
              <Printer size={14} /> IMPRIMIR
            </button>
            <button onClick={handleReset} className="flex items-center gap-2 px-3 py-1.5 bg-red-900/10 text-red-700 hover:bg-red-900/20 border border-red-200 rounded-sm font-bold text-xs font-tech transition-colors">
              <RefreshCw size={14} /> LIMPAR
            </button>
          </div>

          <header className="flex flex-col md:flex-row gap-6 mb-8 border-b-2 border-slate-900/20 pb-6">
            <div className="md:w-1/3 flex flex-col justify-center">
              <h1 className="text-5xl lg:text-6xl font-black italic tracking-tighter uppercase font-fantasy text-slate-900 leading-none">
                RUN<span className="text-amber-600">ARCANA</span>
              </h1>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mt-1 pl-1">Ficha de Personagem</span>
            </div>
            
            <div className="md:w-2/3 grid grid-cols-6 gap-x-4 gap-y-3">
               <div className="col-span-3">
                 <InputUnderline label="Personagem" value={data.info.charName} onChange={(v) => updateInfo('charName', v)} className="text-lg font-bold text-slate-900" />
               </div>
               <div className="col-span-3">
                 <InputUnderline label="Jogador" value={data.info.playerName} onChange={(v) => updateInfo('playerName', v)} />
               </div>
               <div className="col-span-2"><InputUnderline label="Origem" value={data.info.origin} onChange={(v) => updateInfo('origin', v)} /></div>
               <div className="col-span-2"><InputUnderline label="Região" value={data.info.region} onChange={(v) => updateInfo('region', v)} /></div>
               <div className="col-span-2"><InputUnderline label="Passado" value={data.info.background} onChange={(v) => updateInfo('background', v)} /></div>
               <div className="col-span-3"><InputUnderline label="Essência" value={data.info.essence} onChange={(v) => updateInfo('essence', v)} /></div>
               <div className="col-span-2"><InputUnderline label="Classe" value={data.info.classLevel} onChange={(v) => updateInfo('classLevel', v)} className="font-bold" /></div>
               <div className="col-span-1"><InputUnderline label="Nível" value={data.info.level} onChange={(v) => updateInfo('level', parseInt(v) || '')} className="font-bold text-center" /></div>
            </div>
          </header>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-3 flex flex-col gap-6">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 shadow-sm relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Atributos</div>
                 <div className="flex flex-wrap justify-center gap-1 mt-2">
                    {(Object.keys(data.attributes) as AttributeKey[]).map(key => (
                      <div key={key} className="scale-90 transform -my-2">
                        <HexStat label={ATTRIBUTE_LABELS[key]} value={data.attributes[key].value} modifier={data.attributes[key].modifier} onChange={(v) => updateAttribute(key, v)} onRoll={() => rollDice(ATTRIBUTE_LABELS[key], data.attributes[key].modifier)} />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center relative bg-white shadow-sm">
                   <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center mb-1">
                      <span className="text-2xl font-bold font-tech text-slate-800">+{data.vitals.proficiencyBonus}</span>
                   </div>
                   <span className="text-[9px] font-bold uppercase text-center leading-tight text-slate-500">Proficiência</span>
                   <span className="text-[8px] font-bold uppercase text-center text-amber-600 mt-0.5">{getProficiencyTier(data.info.level || 1)}</span>
                </div>
                <div className="border border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center bg-white shadow-sm hover:border-amber-400 transition-colors cursor-pointer" onClick={() => setData(prev => ({...prev, vitals: {...prev.vitals, inspiration: !prev.vitals.inspiration}}))}>
                   <div className={`w-10 h-10 flex items-center justify-center transition-colors rounded-full ${data.vitals.inspiration ? 'bg-amber-100 text-amber-600' : 'text-slate-200'}`}><Sparkles size={24} fill={data.vitals.inspiration ? "currentColor" : "none"} /></div>
                   <span className="text-[9px] font-bold uppercase text-center leading-tight mt-2 text-slate-500">Inspiração</span>
                </div>
              </div>

              <div className="space-y-2">
                 <div className="border border-slate-300 rounded px-3 py-2 flex items-center justify-between bg-white">
                    <div className="flex flex-col"><span className="text-[9px] uppercase font-bold text-slate-400">Percepção Passiva</span><span className="font-bold text-sm text-slate-700">Sabedoria</span></div>
                    <span className="text-2xl font-bold font-tech text-slate-900">{10 + calculateSkillTotal(data.skills.percepcao)}</span>
                 </div>
                 <div className="border border-slate-300 rounded px-3 py-2 flex items-center justify-between bg-white">
                    <div className="flex flex-col"><span className="text-[9px] uppercase font-bold text-slate-400">Intuição Passiva</span><span className="font-bold text-sm text-slate-700">Sabedoria</span></div>
                    <span className="text-2xl font-bold font-tech text-slate-900">{10 + calculateSkillTotal(data.skills.intuicao)}</span>
                 </div>
              </div>
              
              <div className="border border-slate-300 rounded-md overflow-hidden bg-white">
                <div className="bg-slate-900 text-amber-500 py-1.5 text-center"><h3 className="font-tech uppercase font-bold text-xs tracking-widest">Perícias</h3></div>
                <div className="divide-y divide-slate-100">
                  {(Object.entries(data.skills) as [string, Skill][]).map(([key, skill], idx) => {
                    const total = calculateSkillTotal(skill);
                    return (
                      <div key={key} className={`flex items-center text-sm px-2 py-1 hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50/50' : ''}`}>
                        <button onClick={() => toggleSkillProficiency(key)} className={`w-3 h-3 rounded-full border border-slate-400 mr-2 flex-shrink-0 transition-colors ${skill.proficient ? 'bg-slate-800 border-slate-800' : 'bg-transparent'}`}/>
                        <span className="font-bold font-tech w-6 text-right text-slate-900 mr-3">{total >= 0 ? '+' : ''}{total}</span>
                        <span className="flex-grow font-medium text-xs text-slate-700">{skill.name}</span>
                        <span className="text-slate-400 text-[9px] uppercase font-bold w-6 text-right">({skill.attr.substring(0,3)})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
              <div className="flex gap-4 items-end justify-center py-2 relative">
                 <div className="absolute top-1/2 left-0 w-full h-px bg-slate-300 -z-10"></div>
                 <div className="relative group">
                     <Shield className="w-24 h-28 text-slate-800 fill-white drop-shadow-md" strokeWidth={1.5} />
                     <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                       <input type="text" className="w-12 text-center text-4xl font-bold bg-transparent font-tech focus:outline-none text-slate-900" value={data.vitals.ac + getEquipmentBonus('ac')} onChange={(e) => setData(prev => ({...prev, vitals: {...prev.vitals, ac: (parseInt(e.target.value)||10) - getEquipmentBonus('ac')}}))}/>
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-[-2px]">CA</span>
                     </div>
                 </div>
                 <div className="bg-white border-2 border-slate-800 rounded-lg w-20 h-20 flex flex-col items-center justify-center p-1 shadow-md mb-2 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-0.5 text-slate-200"><Zap size={12} /></div>
                     <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Inic.</span>
                     <span className="text-3xl font-bold font-tech text-slate-900">{(data.vitals.initiative >= 0 ? '+' : '') + data.vitals.initiative}</span>
                 </div>
                 <div className="bg-white border-2 border-slate-800 rounded-lg w-20 h-20 flex flex-col items-center justify-center p-1 shadow-md mb-2 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-0.5 text-slate-200"><Activity size={12} /></div>
                     <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Desl.</span>
                     <InputUnderline value={data.vitals.speed} onChange={(v) => setData(prev => ({...prev, vitals: {...prev.vitals, speed: v}}))} centered className="text-xl font-bold font-tech border-none text-slate-900 p-0 h-8"/>
                 </div>
              </div>

              <div className="bg-slate-100 p-3 rounded-lg border border-slate-300 shadow-inner">
                <div className="flex justify-between items-end mb-2 border-b border-slate-300 pb-1">
                   <div className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1"><Activity size={14} className="text-red-600" />Pontos de Vida</div>
                   <div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase text-slate-400">Máximo</span><input type="text" className="w-12 border-b border-slate-400 bg-transparent text-right font-tech font-bold text-slate-700" value={data.vitals.hpMax} onChange={(e) => setData(p => ({...p, vitals: {...p.vitals, hpMax: e.target.value}}))} /></div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-grow relative"><textarea className="w-full h-16 text-5xl font-tech text-center bg-transparent resize-none focus:outline-none text-slate-800 leading-none py-1" value={data.vitals.hpCurrent} onChange={(e) => setData(p => ({...p, vitals: {...p.vitals, hpCurrent: e.target.value}}))} placeholder="--"></textarea><div className="absolute top-0 right-0 text-[10px] font-bold text-slate-300 uppercase rotate-90 origin-top-right mt-2 mr-[-10px]">Atual</div></div>
                  <div className="w-px bg-slate-300 self-stretch"></div>
                  <div className="w-20 flex flex-col items-center justify-center"><span className="text-[9px] font-bold uppercase text-slate-400 mb-1">Temp</span><input type="text" className="w-full text-center text-2xl font-bold bg-transparent focus:outline-none text-cyan-700 font-tech" value={data.vitals.hpTemp} onChange={(e) => setData(p => ({...p, vitals: {...p.vitals, hpTemp: e.target.value}}))} placeholder="-"/></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="border border-slate-300 rounded p-2 bg-white">
                    <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400 border-b border-slate-100 mb-1"><span>Dados de Vida</span><div className="flex gap-1"><span>Total</span><input type="text" className="w-8 border-b border-slate-300 bg-transparent text-right font-bold text-slate-600 h-3" value={data.vitals.hitDiceTotal} onChange={(e) => setData(p => ({...p, vitals: {...p.vitals, hitDiceTotal: e.target.value}}))} /></div></div>
                    <input type="text" className="w-full text-center text-xl font-bold bg-transparent focus:outline-none text-slate-800 font-tech" value={data.vitals.hitDice} onChange={(e) => setData(p => ({...p, vitals: {...p.vitals, hitDice: e.target.value}}))}/>
                 </div>
                 <div className="border border-slate-300 rounded p-2 bg-white"><div className="flex justify-between items-center mb-1"><span className="text-[9px] font-bold uppercase text-slate-500">Exaustão</span><span className="text-[10px] font-bold text-red-600 font-tech">{data.exhaustion}</span></div><div className="flex justify-between gap-1">{[1,2,3,4,5,6].map(i => (<button key={i} onClick={() => setData(prev => ({...prev, exhaustion: i === prev.exhaustion ? i - 1 : i}))} className={`flex-1 h-4 rounded-sm border border-slate-300 transition-colors ${i <= data.exhaustion ? 'bg-red-600 border-red-700 shadow-[0_0_5px_rgba(220,38,38,0.5)]' : 'bg-slate-100'}`}/>))}</div></div>
              </div>

              <div className="border border-slate-300 rounded-lg p-2 bg-slate-100 shadow-sm">
                <SectionHeader title="Ataques & Armas" icon={Swords} />
                <div className="space-y-3 pb-2">
                  {data.attacks.map((atk, i) => {
                    const accBonus = calculateAttackBonus(atk);
                    const dmgBonus = calculateDamageBonus(atk);
                    const dmgFormula = `${atk.dmgDice}${dmgBonus > 0 ? '+' + dmgBonus : (dmgBonus < 0 ? dmgBonus : '')}`;
                    return (
                    <div key={atk.id} className="bg-white border-l-4 border-l-slate-800 border-y border-r border-slate-200 rounded-r-md p-3 shadow-sm relative group hover:border-l-amber-500 transition-all">
                       <div className="flex justify-between items-start gap-3 mb-2"><div className="flex-grow"><input type="text" value={atk.name} onChange={(e) => updateAttack(atk.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none text-base font-bold text-slate-900 placeholder-slate-300" placeholder="Nome da Arma" /></div><button onClick={() => removeAttack(atk.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="Remover ataque"><Trash2 size={16} /></button></div>
                       <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="bg-slate-50 rounded border border-slate-200 p-2"><div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1"><div className="flex items-center gap-1"><Swords size={12} className="text-slate-400" /><span className="text-[10px] font-bold uppercase text-slate-600">Acerto</span></div><button onClick={() => rollDice(`Acerto: ${atk.name}`, accBonus)} className="flex items-center gap-1 font-tech font-bold text-lg text-slate-800 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition-colors group/btn"><Dices size={14} className="text-slate-400 group-hover/btn:text-cyan-500" /><span>{accBonus >= 0 ? '+' : ''}{accBonus}</span></button></div><div className="flex gap-1 mb-1"><AttrSelect value={atk.accAttr1} onChange={(v) => updateAttack(atk.id, 'accAttr1', v)} /><AttrSelect value={atk.accAttr2} onChange={(v) => updateAttack(atk.id, 'accAttr2', v)} /></div><div className="flex items-center gap-2 mb-1 pl-1"><input type="checkbox" checked={atk.accProf} onChange={(e) => updateAttack(atk.id, 'accProf', e.target.checked)} className="w-3 h-3 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"/><span className="text-[9px] font-bold uppercase text-slate-500">Proficiência</span></div><BonusList title="Bônus Acerto" bonuses={atk.accBonuses} onChange={(b) => updateAttack(atk.id, 'accBonuses', b)} /></div>
                          <div className="bg-slate-50 rounded border border-slate-200 p-2"><div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1"><div className="flex items-center gap-1"><Skull size={12} className="text-slate-400" /><span className="text-[10px] font-bold uppercase text-slate-600">Dano</span></div><div className="flex items-center gap-1"><div className="text-right"><span className="font-tech font-bold text-sm text-slate-800 block leading-none">{atk.dmgDice} {dmgBonus > 0 ? `+ ${dmgBonus}` : (dmgBonus < 0 ? dmgBonus : '')}</span><span className="text-[9px] text-slate-400 font-bold uppercase">{atk.dmgType}</span></div><button onClick={() => rollDice(`Dano: ${atk.name}`, dmgFormula, 'damage')} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors" title="Rolar Dano"><Dices size={14} /></button></div></div><div className="flex gap-1 mb-1"><input type="text" className="w-1/3 bg-white border border-slate-300 rounded px-1 py-0.5 text-xs text-center font-tech" placeholder="1d8" value={atk.dmgDice} onChange={(e) => updateAttack(atk.id, 'dmgDice', e.target.value)} /><input type="text" className="flex-grow bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px]" placeholder="Tipo" value={atk.dmgType} onChange={(e) => updateAttack(atk.id, 'dmgType', e.target.value)} /></div><div className="flex gap-1 mb-1"><AttrSelect value={atk.dmgAttr1} onChange={(v) => updateAttack(atk.id, 'dmgAttr1', v)} /><AttrSelect value={atk.dmgAttr2} onChange={(v) => updateAttack(atk.id, 'dmgAttr2', v)} /></div><BonusList title="Bônus Dano" bonuses={atk.dmgBonuses} onChange={(b) => updateAttack(atk.id, 'dmgBonuses', b)} /></div>
                       </div>
                       <div><label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">Descrição</label><textarea className="w-full bg-slate-50 border border-slate-100 rounded p-2 text-xs text-slate-600 focus:outline-none focus:border-cyan-200 resize-none" rows={2} value={atk.description || ''} onChange={(e) => updateAttack(atk.id, 'description', e.target.value)} placeholder="Alcance, etc..." /></div>
                    </div>
                  )})}
                  <button onClick={addAttack} className="w-full mt-2 border-2 border-dashed border-slate-300 rounded-lg py-2 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:border-amber-400 hover:bg-amber-50 transition-all text-xs font-bold uppercase tracking-wider gap-2 group"><Plus size={14} className="group-hover:scale-110 transition-transform" /> Adicionar Arma</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2 border border-slate-300 rounded-lg p-1 bg-white">
                   <div className="flex justify-between items-center mb-2 px-1"><SectionHeader title="Grimório" icon={Sparkles} /><div className="flex items-center gap-1 bg-slate-100 rounded px-2 py-1"><span className="text-[8px] font-bold uppercase text-slate-400">Mana Total</span><input type="text" className="w-10 bg-transparent text-center font-bold text-cyan-700 font-tech" value={data.mana.current} onChange={(e) => setData(p => ({...p, mana: {...p.mana, current: e.target.value}}))} placeholder="MAX" /></div></div>
                   <div className="space-y-3 px-1 pb-2">
                     {data.spells.map((spell, i) => {
                       const castValue = calculateSpellCastValue(spell);
                       const effectBonus = calculateSpellEffectBonus(spell);
                       const effectFormula = `${spell.effectDice}${effectBonus > 0 ? '+' + effectBonus : (effectBonus < 0 ? effectBonus : '')}`;
                       return (
                         <div key={spell.id} className={`bg-white border border-slate-200 rounded-lg p-3 shadow-sm relative group transition-all ${spell.type === 'damage' ? 'border-l-4 border-l-red-500' : spell.type === 'defense' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-purple-500'}`}>
                           <div className="flex justify-between items-start mb-2"><div className="flex-grow flex flex-col"><input type="text" value={spell.name} onChange={(e) => updateSpell(spell.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-cyan-500 focus:outline-none text-sm font-bold text-slate-900" placeholder="Nome da Magia" /><div className="flex gap-2 mt-1"><select value={spell.type} onChange={(e) => updateSpell(spell.id, 'type', e.target.value)} className="text-[10px] uppercase font-bold text-slate-500 bg-transparent focus:outline-none cursor-pointer hover:text-cyan-700"><option value="damage">Dano</option><option value="defense">Defesa</option><option value="utility">Utilidade</option></select><div className="flex items-center gap-1"><span className="text-[10px] uppercase font-bold text-slate-500">Ciclo</span><input type="number" className="w-6 text-center text-[10px] font-bold bg-slate-100 rounded" value={spell.cycle} onChange={(e) => updateSpell(spell.id, 'cycle', parseInt(e.target.value)||1)} /></div><div className="flex items-center gap-1"><span className="text-[10px] uppercase font-bold text-cyan-600">Mana</span><input type="number" className="w-6 text-center text-[10px] font-bold bg-cyan-50 rounded text-cyan-800" value={spell.manaCost} onChange={(e) => updateSpell(spell.id, 'manaCost', parseInt(e.target.value)||0)} /></div></div></div><button onClick={() => removeSpell(spell.id)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14} /></button></div>
                           <div className="bg-slate-50 rounded border border-slate-100 p-2 mb-2">
                              {(spell.type === 'damage' || spell.type === 'utility') && (
                                 <div className="mb-3 pb-2 border-b border-slate-200"><div className="flex justify-between items-center mb-1"><div className="flex gap-2"><button onClick={() => updateSpell(spell.id, 'castMode', 'save')} className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${spell.castMode === 'save' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>CD</button><button onClick={() => updateSpell(spell.id, 'castMode', 'attack')} className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${spell.castMode === 'attack' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Ataque</button></div><div className="flex items-center gap-1">{spell.castMode === 'save' && <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">CD</span>}<button onClick={spell.castMode === 'attack' ? () => rollDice(`Ataque Magia: ${spell.name}`, castValue) : undefined} className={`flex items-center gap-1 font-tech font-bold text-base text-slate-800 bg-white px-2 rounded border border-slate-200 ${spell.castMode === 'attack' ? 'hover:text-cyan-600 hover:border-cyan-500 cursor-pointer group/btn' : 'cursor-default'}`}>{spell.castMode === 'attack' && <Dices size={12} className="text-slate-400 group-hover/btn:text-cyan-500" />}{spell.castMode === 'attack' && (castValue >= 0 ? '+' : '')}{castValue}</button></div></div><div className="flex gap-1 mb-1"><AttrSelect value={spell.attr1} onChange={(v) => updateSpell(spell.id, 'attr1', v)} /><div className="flex items-center gap-1 pl-2"><input type="checkbox" checked={spell.hasProficiency} onChange={(e) => updateSpell(spell.id, 'hasProficiency', e.target.checked)} className="w-3 h-3 rounded text-cyan-600 focus:ring-cyan-500"/><span className="text-[9px] font-bold uppercase text-slate-500">Prof.</span></div></div><BonusList title="Bônus" bonuses={spell.bonuses} onChange={(b) => updateSpell(spell.id, 'bonuses', b)} /></div>
                              )}
                              <div><div className="flex justify-between items-center mb-1"><span className="text-[9px] font-bold uppercase text-slate-600">{spell.type === 'damage' ? 'Dano' : (spell.type === 'defense' ? 'CA' : 'Efeito')}</span><div className="flex items-center gap-1"><span className="font-tech font-bold text-sm text-slate-800">{spell.effectDice} {effectBonus > 0 ? `+ ${effectBonus}` : (effectBonus < 0 ? effectBonus : '')}</span><button onClick={() => rollDice(`Efeito: ${spell.name}`, effectFormula, 'damage')} className="text-slate-400 hover:text-cyan-600 p-0.5 rounded transition-colors"><Dices size={12} /></button></div></div><div className="flex gap-1 mb-1"><input type="text" className="w-1/3 bg-white border border-slate-300 rounded px-1 py-0.5 text-xs text-center font-tech" value={spell.effectDice} onChange={(e) => updateSpell(spell.id, 'effectDice', e.target.value)} placeholder="1d6" /><input type="text" className="flex-grow bg-white border border-slate-300 rounded px-1 py-0.5 text-[10px]" value={spell.effectType} onChange={(e) => updateSpell(spell.id, 'effectType', e.target.value)} placeholder="Tipo" /></div><BonusList title="Bônus Extra" bonuses={spell.effectBonuses} onChange={(b) => updateSpell(spell.id, 'effectBonuses', b)} /></div>
                           </div>
                           <textarea className="w-full bg-transparent border-t border-slate-100 pt-2 text-xs text-slate-600 focus:outline-none resize-none" rows={2} value={spell.description || ''} onChange={(e) => updateSpell(spell.id, 'description', e.target.value)} placeholder="Descrição..." />
                         </div>
                       );
                     })}
                     <button onClick={addSpell} className="w-full mt-2 border-2 border-dashed border-slate-300 rounded-lg py-2 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-400 hover:bg-cyan-50 transition-all text-xs font-bold uppercase tracking-wider gap-2 group"><Plus size={14} className="group-hover:scale-110 transition-transform" /> Nova Magia</button>
                   </div>
                 </div>
                 <div className="col-span-2 border border-slate-300 rounded-lg p-1 bg-white flex flex-col"><SectionHeader title="Runas" icon={Scroll} /><div className="mb-2 grid grid-cols-2 gap-1 px-1"><div className="bg-slate-100 rounded p-1 flex flex-col items-center"><span className="text-[8px] font-bold uppercase text-slate-400">CD Runa</span><input type="text" className="w-full bg-transparent text-center font-bold text-slate-700 font-tech" value={data.runeDC} onChange={(e) => setData(p => ({...p, runeDC: e.target.value}))} /></div><div className="bg-slate-100 rounded p-1 flex flex-col items-center"><span className="text-[8px] font-bold uppercase text-slate-400">Atk Runa</span><input type="text" className="w-full bg-transparent text-center font-bold text-slate-700 font-tech" value={data.runeAttack} onChange={(e) => setData(p => ({...p, runeAttack: e.target.value}))} /></div></div><textarea className="flex-grow w-full resize-none text-xs bg-slate-50 focus:bg-white rounded p-2 focus:outline-none border border-transparent focus:border-cyan-500 transition-colors" value={data.runes} onChange={(e) => setData(prev => ({...prev, runes: e.target.value}))} placeholder="Runas..."></textarea></div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
              <div className="border border-slate-900 rounded-lg p-4 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                 <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3"><h3 className="font-tech uppercase font-bold text-sm text-slate-800">Salvaguardas</h3><Shield size={16} className="text-slate-400" /></div>
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                    {(Object.keys(data.savingThrows) as AttributeKey[]).map(key => {
                       const total = calculateSaveTotal(key);
                       return (
                        <div key={key} className="flex items-center text-sm">
                          <button onClick={() => toggleSaveProficiency(key)} className={`w-3 h-3 rounded-full border border-slate-400 mr-2 transition-colors ${data.savingThrows[key] ? 'bg-slate-900 border-slate-900' : 'bg-transparent'}`}/>
                          <button onClick={() => rollDice(`Teste de ${ATTRIBUTE_LABELS[key]}`, total)} className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-slate-100 transition-all group/save mr-2" title={`Rolar Salvaguarda de ${ATTRIBUTE_LABELS[key]}`}><div className="bg-slate-100 group-hover/save:bg-cyan-100 border border-slate-300 rounded-full p-0.5 transition-colors"><Dices size={10} className="text-slate-400 group-hover/save:text-cyan-600" /></div><span className="font-bold font-tech w-5 text-right text-slate-900 group-hover/save:text-cyan-700">{total >= 0 ? '+' : ''}{total}</span></button>
                          <span className="flex-grow font-medium text-xs text-slate-600 uppercase">{ATTRIBUTE_LABELS[key].substring(0,3)}</span>
                        </div>
                       );
                    })}
                 </div>
                 <div className="pt-3 border-t border-slate-200 bg-slate-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg"><div className="flex justify-between items-center mb-2"><span className="text-[10px] font-bold uppercase text-slate-500">Sucessos</span><div className="flex gap-2">{[0,1,2].map(i => (<button key={i} onClick={() => setData(prev => ({...prev, deathSaves: {...prev.deathSaves, success: i < prev.deathSaves.success ? i : i + 1}}))} className={`w-4 h-4 rounded-full border border-slate-400 transition-all ${i < data.deathSaves.success ? 'bg-green-600 border-green-700 shadow-[0_0_5px_rgba(22,163,74,0.6)]' : 'bg-white'}`}/>))}</div></div><div className="flex justify-between items-center"><span className="text-[10px] font-bold uppercase text-slate-500">Falhas</span><div className="flex gap-2">{[0,1,2].map(i => (<button key={i} onClick={() => setData(prev => ({...prev, deathSaves: {...prev.deathSaves, failure: i < prev.deathSaves.failure ? i : i + 1}}))} className={`w-4 h-4 rounded-full border border-slate-400 transition-all ${i < data.deathSaves.failure ? 'bg-red-600 border-red-700 shadow-[0_0_5px_rgba(220,38,38,0.6)]' : 'bg-white'}`}/>))}</div></div></div>
              </div>
              
              <DynamicList title="Características & Talentos" icon={Brain} items={data.features} onAdd={() => addListItem('features')} onRemove={(id) => removeListItem('features', id)} onUpdate={(id, f, v) => updateListItem('features', id, f, v)} className="min-h-[300px]" />
            </div>
          </div>

          <div className="mt-8 border-t-2 border-slate-900/10 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <EquipmentList items={data.equipment} onAdd={() => addListItem('equipment')} onRemove={(id) => removeListItem('equipment', id)} onUpdate={updateEquipment} />
              <DynamicList title="Idiomas & Ofícios" icon={Scroll} items={data.languages} onAdd={() => addListItem('languages')} onRemove={(id) => removeListItem('languages', id)} onUpdate={(id, f, v) => updateListItem('languages', id, f, v)} className="h-64" placeholderTitle="Idioma/Ofício"/>
              <DynamicList title="Outras Proficiências" icon={Shield} items={data.proficiencies} onAdd={() => addListItem('proficiencies')} onRemove={(id) => removeListItem('proficiencies', id)} onUpdate={(id, f, v) => updateListItem('proficiencies', id, f, v)} className="h-64" placeholderTitle="Proficiência"/>
              <DynamicList title="Anotações" icon={Scroll} items={data.notes} onAdd={() => addListItem('notes')} onRemove={(id) => removeListItem('notes', id)} onUpdate={(id, f, v) => updateListItem('notes', id, f, v)} className="h-64" placeholderTitle="Nota"/>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
             <div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase text-slate-400">XP Atual:</span><input type="text" className="bg-transparent border-b border-slate-300 text-sm font-tech focus:outline-none w-32" value={data.info.xp} onChange={(e) => updateInfo('xp', e.target.value)}/></div>
             <div className="text-slate-400 text-[10px] no-print">Design Runarcana | Salvo Automático</div>
          </div>
        </div>
      </div>
    </div>
  );
}
