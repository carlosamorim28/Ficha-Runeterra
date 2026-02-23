import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItemEntry } from '../types';
import { SectionHeader } from './SectionHeader';

const SortableItem = ({ 
  item, 
  onRemove, 
  onUpdate,
  placeholderTitle,
  placeholderDesc
}: { 
  item: ItemEntry; 
  onRemove: (id: string) => void; 
  onUpdate: (id: string, field: keyof ItemEntry, val: string) => void;
  placeholderTitle: string;
  placeholderDesc: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

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
      className="bg-slate-50 border border-slate-200 rounded p-2 relative group hover:border-cyan-300 transition-all"
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2 flex-grow">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
            <GripVertical size={14} />
          </div>
          <input 
            type="text" 
            className="w-full bg-transparent border-b border-slate-200 focus:border-cyan-500 focus:outline-none text-[11px] font-bold font-tech uppercase text-slate-800 placeholder-slate-400"
            placeholder={placeholderTitle}
            value={item.title}
            onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
          />
        </div>
        <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 ml-2 transition-colors shrink-0"><Trash2 size={12}/></button>
      </div>
      <TextareaAutosize 
        className="w-full bg-transparent resize-none text-[10px] text-slate-600 focus:outline-none placeholder-slate-300 pl-5"
        minRows={2}
        placeholder={placeholderDesc}
        value={item.description}
        onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
      />
    </div>
  );
};

export const DynamicList = ({ 
  items, 
  title, 
  icon, 
  onAdd, 
  onRemove, 
  onUpdate, 
  onReorder,
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
  onReorder?: (items: ItemEntry[]) => void;
  placeholderTitle?: string;
  placeholderDesc?: string;
  className?: string;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className={`flex-grow border border-slate-300 rounded-lg p-1 bg-white flex flex-col ${className}`}>
      <SectionHeader title={title} icon={icon} />
      <div className="flex-grow flex flex-col gap-2 p-2 overflow-y-auto min-h-[100px]">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map(item => (
              <SortableItem 
                key={item.id} 
                item={item} 
                onRemove={onRemove} 
                onUpdate={onUpdate}
                placeholderTitle={placeholderTitle}
                placeholderDesc={placeholderDesc}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button onClick={onAdd} className="w-full border-2 border-dashed border-slate-200 rounded-lg py-2 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-all text-[9px] font-bold uppercase tracking-wider gap-2 group shrink-0">
          <Plus size={12} className="group-hover:scale-110" /> Adicionar {title}
        </button>
      </div>
    </div>
  );
};
