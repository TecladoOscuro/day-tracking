import { useState, useMemo } from 'react';
import type { WeightEntry } from '../types';

interface Props {
  weights: WeightEntry[];
}

export default function ProgressPhotos({ weights }: Props) {
  const photos = weights.filter((w) => w.photo);
  const [fullscreen, setFullscreen] = useState<number | null>(null);
  const [view, setView] = useState<'timeline' | 'carousel'>('timeline');

  const grouped = useMemo(() => {
    const map = new Map<number, WeightEntry[]>();
    photos.forEach((w) => {
      const y = new Date(w.date).getFullYear();
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(w);
    });
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [photos]);

  if (photos.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
        Añade fotos a tus registros de peso para ver la galería
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
          Fotos de progreso
        </h3>
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          <button
            onClick={() => setView('timeline')}
            className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${
              view === 'timeline'
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Línea temporal
          </button>
          <button
            onClick={() => setView('carousel')}
            className={`px-2 py-1 rounded-md text-[10px] font-medium transition ${
              view === 'carousel'
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Carrusel
          </button>
        </div>
      </div>

      {view === 'carousel' && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
          {photos.map((w) => (
            <div
              key={w.id}
              onClick={() => setFullscreen(photos.indexOf(w))}
              className="relative shrink-0 w-40 h-56 rounded-xl overflow-hidden snap-center cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={w.photo}
                alt={w.date}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-xs font-medium">
                  {new Date(w.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-white/80 text-[10px]">{w.weight} kg</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'timeline' && (
        <div className="space-y-4">
          {grouped.map(([year, entries]) => (
            <div key={year}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 sticky top-0 bg-white dark:bg-gray-900 py-1">
                {year}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {entries.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setFullscreen(photos.indexOf(w))}
                    className="relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer active:scale-95 transition-transform"
                  >
                    <img
                      src={w.photo}
                      alt={w.date}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium">
                        {new Date(w.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-white/80 text-[10px]">{w.weight} kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {fullscreen !== null && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setFullscreen(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreen(null); }}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center"
          >
            ×
          </button>

          {fullscreen > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setFullscreen(fullscreen - 1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center"
            >
              ‹
            </button>
          )}
          {fullscreen < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setFullscreen(fullscreen + 1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center"
            >
              ›
            </button>
          )}

          <img
            src={photos[fullscreen].photo}
            alt={photos[fullscreen].date}
            className="max-w-full max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white text-sm font-medium">
              {new Date(photos[fullscreen].date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-white/70 text-xs">{photos[fullscreen].weight} kg</p>
            {photos[fullscreen].note && (
              <p className="text-white/50 text-xs mt-1">{photos[fullscreen].note}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
