import React, { useState } from 'react';
import { Save, Trash2, X, Download, Upload } from 'lucide-react';
import { CharacterSheetData } from '../types';

export interface SavedCharacter {
  id: string;
  name: string;
  classLevel: string;
  date: string;
  data: CharacterSheetData;
}

export const SaveLoadModal = ({ 
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
