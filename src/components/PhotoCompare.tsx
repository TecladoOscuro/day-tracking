import { useState, useEffect, useRef } from 'react';
import type { WeightEntry } from '../types';

interface Props {
  weights: WeightEntry[];
}

export default function PhotoCompare({ weights }: Props) {
  const allPhotos = weights.flatMap((w) =>
    (w.photos || []).map((photo, idx) => ({
      photo,
      date: w.date,
      weight: w.weight,
      note: w.note,
      key: `${w.date}-${idx}`,
    }))
  );

  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(Math.min(allPhotos.length - 1, 1));
  const [viewerIdx, setViewerIdx] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    setLeftIdx(0);
    setRightIdx(Math.min(allPhotos.length - 1, 1));
  }, [allPhotos.length]);

  const openViewer = (idx: number) => setViewerIdx(idx);
  const closeViewer = () => setViewerIdx(null);

  const goPrev = () => {
    setViewerIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  };

  const goNext = () => {
    setViewerIdx((prev) => (prev !== null && prev < allPhotos.length - 1 ? prev + 1 : prev));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  if (allPhotos.length < 2) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm text-center py-6 text-gray-400 text-sm">
        Necesitas al menos 2 fotos en total para comparar
      </div>
    );
  }

  const left = allPhotos[leftIdx];
  const right = allPhotos[rightIdx];

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          Comparación de progreso
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <div
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => openViewer(leftIdx)}
            >
              <img src={left.photo} alt={left.date} className="w-full h-full object-cover" />
            </div>
            <select
              value={leftIdx}
              onChange={(e) => setLeftIdx(Number(e.target.value))}
              className="w-full mt-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 py-1 px-2"
            >
              {allPhotos.map((p, i) => (
                <option key={i} value={i}>
                  {new Date(p.date).toLocaleDateString('es-ES')} - {p.weight.toFixed(1)} kg
                </option>
              ))}
            </select>
          </div>
          <div>
            <div
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => openViewer(rightIdx)}
            >
              <img src={right.photo} alt={right.date} className="w-full h-full object-cover" />
            </div>
            <select
              value={rightIdx}
              onChange={(e) => setRightIdx(Number(e.target.value))}
              className="w-full mt-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 py-1 px-2"
            >
              {allPhotos.map((p, i) => (
                <option key={i} value={i}>
                  {new Date(p.date).toLocaleDateString('es-ES')} - {p.weight.toFixed(1)} kg
                </option>
              ))}
            </select>
          </div>
        </div>
        {left && right && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            De {left.weight.toFixed(1)} kg a {right.weight.toFixed(1)} kg →{' '}
            <span className={`font-bold ${right.weight <= left.weight ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {right.weight <= left.weight ? '↓' : '↑'} {Math.abs(right.weight - left.weight).toFixed(1)} kg
            </span>
          </p>
        )}
      </div>

      {viewerIdx !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          onClick={closeViewer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={closeViewer}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none z-10"
          >
            ×
          </button>

          {viewerIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl leading-none z-10 px-2"
            >
              ‹
            </button>
          )}

          <img
            src={allPhotos[viewerIdx].photo}
            alt={allPhotos[viewerIdx].date}
            className="max-w-full max-h-[90vh] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
          />

          {viewerIdx < allPhotos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl leading-none z-10 px-2"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-8 left-0 right-0 text-center">
            <p className="text-white/80 text-sm">
              {new Date(allPhotos[viewerIdx].date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-white/60 text-xs">{allPhotos[viewerIdx].weight.toFixed(1)} kg</p>
            <p className="text-white/40 text-[10px] mt-1">{viewerIdx + 1} / {allPhotos.length}</p>
          </div>
        </div>
      )}
    </>
  );
}
