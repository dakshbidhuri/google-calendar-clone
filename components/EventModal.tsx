"use client";
import { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, Check, Trash } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: any) => void;
  onDelete?: (id: number) => void; // Optional delete button inside modal
  selectedDate: Date | null;
  defaultEvent?: any; // The event being edited
}

const COLORS = [
  { name: 'blue',   hex: '#3b82f6' },
  { name: 'red',    hex: '#ef4444' },
  { name: 'green',  hex: '#22c55e' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'yellow', hex: '#eab308' },
];

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  selectedDate, 
  defaultEvent 
}: EventModalProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  // Load data when modal opens or defaultEvent changes
  useEffect(() => {
    if (isOpen) {
      if (defaultEvent) {
        setTitle(defaultEvent.title);
        setDesc(defaultEvent.description || '');
        setSelectedColor(defaultEvent.color || 'blue');
      } else {
        // Reset for new event
        setTitle('');
        setDesc('');
        setSelectedColor('blue');
      }
    }
  }, [isOpen, defaultEvent]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateToUse = defaultEvent ? new Date(defaultEvent.startTime) : selectedDate;
    
    onSave({ 
      id: defaultEvent?.id, // Pass ID if editing
      title, 
      description: desc, 
      startTime: dateToUse, 
      endTime: dateToUse,
      color: selectedColor 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[450px] p-4 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between bg-gray-100/50 p-2 -m-4 mb-4 rounded-t-lg">
           {/* If editing, show a delete icon in the header too */}
           {defaultEvent && onDelete ? (
            <button 
              type="button"
              onClick={() => { onDelete(defaultEvent.id); onClose(); }}
              className="hover:bg-gray-200 p-1 rounded text-gray-600"
            >
              <Trash className="w-5 h-5" />
            </button>
           ) : <div></div>}
           
          <button onClick={onClose} className="hover:bg-gray-200 p-1 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <input 
            autoFocus
            type="text" 
            placeholder="Add title" 
            className="w-full text-2xl border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-1 placeholder:text-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <Clock className="w-5 h-5" />
            <span>
              {defaultEvent 
                ? new Date(defaultEvent.startTime).toDateString() 
                : selectedDate?.toDateString()}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <AlignLeft className="w-5 h-5 text-gray-600 mt-1" />
            <textarea 
              placeholder="Add description" 
              className="w-full bg-gray-100 rounded p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            {COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                style={{ backgroundColor: c.hex }} 
                className={`w-6 h-6 rounded-full flex items-center justify-center hover:ring-2 ring-offset-1 ring-gray-300 transition-all`}
              >
                {selectedColor === c.name && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2 gap-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}