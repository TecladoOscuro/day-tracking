import { useEffect, useState } from 'react';
import { db } from '../db/database';
import type { Profile } from '../types';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.profile.toArray().then((items) => {
      setProfile(items[0] || null);
      setLoading(false);
    });
  }, []);

  const saveProfile = async (p: Profile) => {
    const existing = await db.profile.toArray();
    if (existing.length > 0) {
      await db.profile.update(existing[0].id!, p as any);
    } else {
      await db.profile.add(p as any);
    }
    setProfile(p);
  };

  const hasProfile = !loading && profile !== null;

  return { profile, loading, hasProfile, saveProfile };
}
