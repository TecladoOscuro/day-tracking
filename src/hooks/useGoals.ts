import { useEffect, useState } from 'react';
import { db } from '../db/database';
import type { Goals } from '../types';

const DEFAULT_GOALS: Goals = {
  kcalTarget: 1000,
  weightTarget: 75,
  orangePct: 150,
  redPct: 200,
};

export function useGoals() {
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.goals.toArray().then((items) => {
      if (items.length > 0) {
        setGoals({ ...DEFAULT_GOALS, ...items[0] });
      }
      setLoading(false);
    });
  }, []);

  const saveGoals = async (g: Goals) => {
    const existing = await db.goals.toArray();
    if (existing.length > 0) {
      await db.goals.update(existing[0].id!, g as any);
    } else {
      await db.goals.add(g as any);
    }
    setGoals(g);
  };

  return { goals, loading, saveGoals };
}
