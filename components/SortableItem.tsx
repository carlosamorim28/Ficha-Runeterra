import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SortableItem = ({ id, children, className = "" }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative flex items-start gap-1 ${className}`}>
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-3 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors no-print shrink-0"
        title="Arraste para reordenar"
      >
        <GripVertical size={16} />
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};
