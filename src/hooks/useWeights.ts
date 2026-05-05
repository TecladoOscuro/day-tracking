import { useEffect, useState, useCallback } from 'react';
import { db } from '../db/database';
import type { WeightEntry } from '../types';

export function useWeights() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const all = await db.weights.orderBy('date').toArray();
    setWeights(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addWeight = async (w: Omit<WeightEntry, 'id'>) => {
    const existing = weights.find((x) => x.date === w.date);
    if (existing) {
      await db.weights.update(existing.id!, w);
    } else {
      await db.weights.add(w);
    }
    await load();
  };

  const deleteWeight = async (id: number) => {
    await db.weights.delete(id);
    await load();
  };

  const getLatestWeight = (): number | null => {
    if (weights.length === 0) return null;
    return weights[weights.length - 1].weight;
  };

  return { weights, loading, addWeight, deleteWeight, getLatestWeight, refresh: load };
}
