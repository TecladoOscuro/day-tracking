import { useState, useRef } from 'react';
import type { WeightEntry } from '../types';

interface Props {
  onSave: (entry: Omit<WeightEntry, 'id'>) => void;
  onClose: () => void;
  initialDate?: string;
  initialWeight?: number;
  initialPhoto?: string;
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
  onClose,
  initialDate,
  initialWeight,
  initialPhoto,
  initialNote,
}: Props) {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<number | ''>(initialWeight ?? '');
  const [photo, setPhoto] = useState(initialPhoto || '');
  const [note, setNote] = useState(initialNote || '');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    try {
      const base64 = await compressPhoto(file);
      setPhoto(base64);
    } catch {
      setPhotoError('No se pudo cargar la imagen. Intenta con otra.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !date) return;
    const data: Omit<WeightEntry, 'id'> = { date, weight: Number(weight) };
    if (photo) data.photo = photo;
    if (note.trim()) data.note = note.trim();
    onSave(data);
    onClose();
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="px-5 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Registrar peso</h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="weight-date" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Fecha
            </label>
            <input
              id="weight-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass + ' [color-scheme:dark]'}
            />
          </div>
          <div>
            <label htmlFor="weight-kg" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Peso (kg)
            </label>
            <input
              id="weight-kg"
              type="number"
              value={weight}
              onChange={(e) => {
                const val = e.target.value;
                setWeight(val === '' ? '' : Number(val));
              }}
              placeholder="85.5"
              step="0.1"
              min={30}
              max={300}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Foto (opcional)
            </label>
            {photoError && (
              <p className="text-xs text-red-500 mt-1">{photoError}</p>
            )}
            {photo ? (
              <div className="relative inline-block">
                <img
                  src={photo}
                  alt="Progreso"
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setPhoto('')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs shadow"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-400 dark:text-gray-500 hover:border-indigo-400 hover:text-indigo-500 w-full transition-colors"
              >
                📸 Tomar foto o elegir de galería
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Nota (opcional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej. Después de entrenar, en ayunas..."
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all shadow"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
