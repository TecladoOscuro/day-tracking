import { useEffect, useState, useCallback } from 'react';
import { db } from '../db/database';
import type { FoodPreset } from '../types';

export function useFoodPresets() {
  const [presets, setPresets] = useState<FoodPreset[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await db.foodPresets.toArray();
    setPresets(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addPreset = async (p: Omit<FoodPreset, 'id'>) => {
    await db.foodPresets.add(p);
    await load();
  };

  const deletePreset = async (id: number) => {
    await db.foodPresets.delete(id);
    await load();
  };

  return { presets, loading, addPreset, deletePreset, refresh: load };
}
