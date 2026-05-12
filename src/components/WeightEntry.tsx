import { useState, useRef } from 'react';
import type { WeightEntry } from '../types';

interface Props {
  onSave: (entry: Omit<WeightEntry, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
  initialDate?: string;
  initialWeight?: number;
  initialPhotos?: string[];
  initialNote?: string;
}

function compressPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxW) {
          h = (h * maxW) / w;
          w = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function WeightEntry({
  onSave,
  onDelete,
  onClose,
  initialDate,
  initialWeight,
  initialPhotos = [],
  initialNote,
}: Props) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState(initialWeight != null ? String(initialWeight) : '');
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [note, setNote] = useState(initialNote || '');
  const [photoError, setPhotoError] = useState('');
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    try {
      const base64 = await compressPhoto(file);
      setPhotos((prev) => [...prev, base64]);
    } catch {
      setPhotoError('No se pudo cargar la imagen. Intenta con otra.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight) || !date) return;
    const data: Omit<WeightEntry, 'id'> = { date, weight: numWeight };
    if (photos.length > 0) data.photos = photos;
    if (note.trim()) data.note = note.trim();
    onSave(data);
    onClose();
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="px-5 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {onDelete ? 'Editar peso' : 'Registrar peso'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="weight-date" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
            <div className="overflow-hidden rounded-xl">
              <input id="weight-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass + ' min-w-0 [color-scheme:dark]'} style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div>
            <label htmlFor="weight-kg" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Peso (kg)</label>
            <input id="weight-kg" type="text" inputMode="decimal" value={weight} onChange={(e) => { const val = e.target.value.replace(',', '.'); if (val === '' || /^\d*\.?\d*$/.test(val)) setWeight(val); }} placeholder="85.5" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fotos ({photos.length})</label>
            {photoError && <p className="text-xs text-red-500 mb-1">{photoError}</p>}
            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {photos.map((p, i) => (
                  <div key={i} className="relative">
                    <img src={p} alt={`Foto ${i + 1}`} className="w-16 h-16 object-cover rounded-xl cursor-pointer active:scale-95 transition-transform" onClick={() => setViewerIdx(i)} />
                    <button type="button" onClick={() => removePhoto(i)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center shadow">×</button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:border-indigo-400 hover:text-indigo-500 w-full transition-colors">
              📸 Añadir foto
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nota (opcional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Después de entrenar, en ayunas..." className={inputClass} />
          </div>

          <div className="flex gap-2 pt-2">
            {onDelete && (
              <button type="button" onClick={onDelete} className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all flex-1">
                Eliminar
              </button>
            )}
            <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all flex-1 shadow">
              Guardar
            </button>
          </div>
        </form>
      </div>

      {viewerIdx !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black flex flex-col"
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            const dy = e.changedTouches[0].clientY - touchStartY.current;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
              if (dx < 0 && viewerIdx < photos.length - 1) setViewerIdx(viewerIdx + 1);
              else if (dx > 0 && viewerIdx > 0) setViewerIdx(viewerIdx - 1);
            }
          }}
        >
          <div className="flex justify-end p-4 shrink-0" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
            <button
              onClick={() => setViewerIdx(null)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-xl active:scale-90 transition-all"
            >
              ×
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative min-h-0" onClick={() => setViewerIdx(null)}>
            {viewerIdx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setViewerIdx(viewerIdx - 1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl active:scale-90 transition-all z-10"
              >
                ‹
              </button>
            )}
            <img
              src={photos[viewerIdx]}
              alt={`Foto ${viewerIdx + 1}`}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />
            {viewerIdx < photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setViewerIdx(viewerIdx + 1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white text-2xl active:scale-90 transition-all z-10"
              >
                ›
              </button>
            )}
          </div>
          <div className="text-center pb-8 shrink-0" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
            <p className="text-white/40 text-[10px]">{viewerIdx + 1} / {photos.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
