import { useEffect, useState } from 'react';
import { db } from '../db/database';
import type { Meal } from '../types';

interface Props {
  onSelect: (data: { name: string; calories: number }) => void;
}

export default function FoodPresetPicker({ onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<{ name: string; calories: number }[]>([]);

  useEffect(() => {
    (async () => {
      const all = await db.meals.orderBy('id').reverse().limit(200).toArray();
      const seen = new Map<string, Meal>();
      for (const m of all) {
        const key = m.description.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.set(key, m);
        }
      }
      const unique = Array.from(seen.values()).slice(0, 12);
      setSuggestions(
        unique.map((m) => ({ name: m.description, calories: m.calories }))
      );
    })();
  }, []);

  if (suggestions.length === 0) {
    return (
      <p className="text-xs text-gray-400 dark:text-gray-500 py-2">
        Registra tus primeras comidas y aparecerán aquí como sugerencias.
      </p>
    );
  }

  return (
    <div className="mt-1 max-h-32 overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-xl">
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(s)}
          className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 flex justify-between border-b border-gray-50 dark:border-gray-800 last:border-0"
        >
          <span className="text-gray-700 dark:text-gray-200 truncate mr-2">{s.name}</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
            {s.calories} kcal
          </span>
        </button>
      ))}
    </div>
  );
}
