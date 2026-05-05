import { useFoodPresets } from '../hooks/useFoodPresets';
import type { FoodPreset } from '../types';

interface Props {
  onSelect: (preset: FoodPreset) => void;
}

export default function FoodPresetPicker({ onSelect }: Props) {
  const { presets, loading } = useFoodPresets();

  if (loading) {
    return (
      <p className="text-xs text-gray-300 py-2">Cargando...</p>
    );
  }

  if (presets.length === 0) {
    return (
      <p className="text-xs text-gray-400 py-2">
        No hay comidas frecuentes. Al guardar una comida se añadirá aquí automáticamente.
      </p>
    );
  }

  return (
    <div className="mt-1 max-h-32 overflow-y-auto border border-gray-100 rounded-xl">
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p)}
          className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 flex justify-between border-b border-gray-50 last:border-0"
        >
          <span className="text-gray-700 truncate mr-2">{p.name}</span>
          <span className="text-indigo-600 font-medium shrink-0">
            {p.calories} kcal
          </span>
        </button>
      ))}
    </div>
  );
}
