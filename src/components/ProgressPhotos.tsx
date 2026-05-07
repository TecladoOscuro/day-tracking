import { useState } from 'react';
import type { WeightEntry } from '../types';

interface Props {
  weights: WeightEntry[];
}

export default function ProgressPhotos({ weights }: Props) {
  const photos = weights.flatMap((w) =>
    (w.photos || []).map((photo, idx) => ({
      photo,
      date: w.date,
      weight: w.weight,
      note: w.note,
      key: `${w.id || w.date}-${idx}`,
    }))
  );

  const [fullscreen, setFullscreen] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
        Añade fotos a tus registros de peso para ver la galería
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
        Galería ({photos.length} fotos)
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p, i) => (
          <div
            key={p.key}
            onClick={() => setFullscreen(i)}
            className="relative rounded-xl overflow-hidden aspect-square cursor-pointer active:scale-95 transition-transform"
          >
            <img src={p.photo} alt={p.date} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
              <p className="text-white text-[10px] font-medium">
                {new Date(p.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-white/70 text-[9px]">{p.weight} kg</p>
            </div>
          </div>
        ))}
      </div>

      {fullscreen !== null && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setFullscreen(null)}>
          <button onClick={(e) => { e.stopPropagation(); setFullscreen(null); }} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center">×</button>
          {fullscreen > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setFullscreen(fullscreen - 1); }} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center">‹</button>
          )}
          {fullscreen < photos.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setFullscreen(fullscreen + 1); }} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center">›</button>
          )}
          <img src={photos[fullscreen].photo} alt={photos[fullscreen].date} className="max-w-full max-h-[90vh] object-contain" />
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white text-sm font-medium">{new Date(photos[fullscreen].date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-white/70 text-xs">{photos[fullscreen].weight} kg</p>
          </div>
        </div>
      )}
    </div>
  );
}
