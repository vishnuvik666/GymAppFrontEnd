import { useState } from 'react';
import { createWorkoutPlan } from '../api/workout.api';

export function useCreateWorkoutPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitWorkoutPlan = async (payload: any) => {
    try {
      setLoading(true);
      setError(null);
      return await createWorkoutPlan(payload);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitWorkoutPlan, loading, error };
}
