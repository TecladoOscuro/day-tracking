import { useState, useEffect } from 'react';
import type { Period, FoodPreset } from '../types';
import { getPeriodLabel } from '../utils/dates';
import FoodPresetPicker from './FoodPresetPicker';

interface Props {
  initialPeriod?: Period;
  initialDescription?: string;
  initialCalories?: number;
  onSave: (data: { period: Period; description: string; calories: number }) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const PERIODS: Period[] = ['morning', 'midday', 'afternoon', 'night'];

export default function MealForm({
  initialPeriod,
  initialDescription = '',
  initialCalories = 0,
  onSave,
  onDelete,
  onClose,
}: Props) {
  const [period, setPeriod] = useState<Period>(initialPeriod || 'morning');
  const [description, setDescription] = useState(initialDescription);
  const [calories, setCalories] = useState<number | ''>(initialCalories ?? '');
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (initialPeriod) setPeriod(initialPeriod);
    setDescription(initialDescription);
    setCalories(initialCalories ?? '');
  }, [initialPeriod, initialDescription, initialCalories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || calories === '' || Number(calories) < 0) return;
    onSave({ period, description: description.trim(), calories: Number(calories) });
    onClose();
  };

  const selectPreset = (preset: FoodPreset) => {
    setDescription(preset.name);
    setCalories(preset.calories);
    setShowPresets(false);
  };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in">
      <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl px-5 pt-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {initialCalories ? 'Editar comida' : 'Añadir comida'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Momento del día
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                    period === p
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {getPeriodLabel(p)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="meal-desc" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Descripción
            </label>
            <div className="relative">
              <input
                id="meal-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Tortilla francesa, arroz con pollo..."
                className={inputClass}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:underline"
              >
                {showPresets ? 'ocultar' : 'frecuentes'}
              </button>
            </div>
            {showPresets && <FoodPresetPicker onSelect={selectPreset} />}
          </div>

          <div>
            <label htmlFor="meal-cal" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Calorías (kcal)
            </label>
            <input
              id="meal-cal"
              type="number"
              value={calories}
              onChange={(e) => {
                const val = e.target.value;
                setCalories(val === '' ? '' : Number(val));
              }}
              placeholder="300"
              min={0}
              className={inputClass}
            />
          </div>

          <div className="flex gap-2 pt-2">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all flex-1"
              >
                Eliminar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all flex-1 shadow"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
