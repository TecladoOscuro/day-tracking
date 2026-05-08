import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setLeftIdx(0);
    setRightIdx(Math.min(allPhotos.length - 1, 1));
  }, [allPhotos.length]);

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
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
        Comparación de progreso
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
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
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
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
  );
}
