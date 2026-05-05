import { useState, useEffect } from 'react';
import type { WeightEntry } from '../types';

interface Props {
  weights: WeightEntry[];
}

export default function PhotoCompare({ weights }: Props) {
  const photos = weights.filter((w) => w.photo);
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(Math.min(photos.length - 1, 1));

  useEffect(() => {
    setLeftIdx(0);
    setRightIdx(Math.min(photos.length - 1, 1));
  }, [photos.length]);

  if (photos.length < 2) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        Añade al menos 2 registros con foto para comparar
      </div>
    );
  }

  const left = photos[leftIdx];
  const right = photos[rightIdx];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">
        Comparación de progreso
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={left.photo}
              alt={left.date}
              className="w-full h-full object-cover"
            />
          </div>
          <select
            value={leftIdx}
            onChange={(e) => setLeftIdx(Number(e.target.value))}
            className="w-full mt-1 text-xs rounded-lg border-gray-200 py-1 px-2"
          >
            {photos.map((p, i) => (
              <option key={i} value={i}>
                {new Date(p.date).toLocaleDateString('es-ES')} - {p.weight}kg
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
            <img
              src={right.photo}
              alt={right.date}
              className="w-full h-full object-cover"
            />
          </div>
          <select
            value={rightIdx}
            onChange={(e) => setRightIdx(Number(e.target.value))}
            className="w-full mt-1 text-xs rounded-lg border-gray-200 py-1 px-2"
          >
            {photos.map((p, i) => (
              <option key={i} value={i}>
                {new Date(p.date).toLocaleDateString('es-ES')} - {p.weight}kg
              </option>
            ))}
          </select>
        </div>
      </div>
      {left && right && (
        <p className="text-center text-sm text-gray-600">
          De {left.weight}kg a {right.weight}kg →{' '}
          <span
            className={`font-bold ${right.weight <= left.weight ? 'text-emerald-600' : 'text-red-500'}`}
          >
            {right.weight <= left.weight ? '↓' : '↑'}{' '}
            {Math.abs(right.weight - left.weight).toFixed(1)} kg
          </span>
        </p>
      )}
    </div>
  );
}
