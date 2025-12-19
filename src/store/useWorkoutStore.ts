import { create } from 'zustand';

interface OfflineWorkout {
  id: number;
  payload: any;
}

interface WorkoutState {
  offlineWorkouts: OfflineWorkout[];
  addOfflineWorkout: (workout: OfflineWorkout) => void;
  removeOfflineWorkout: (id: number) => void;
  clearOfflineWorkouts: () => void;
}

export const useWorkoutStore = create<WorkoutState>(set => ({
  offlineWorkouts: [],

  addOfflineWorkout: workout =>
    set(state => ({
      offlineWorkouts: [...state.offlineWorkouts, workout],
    })),

  removeOfflineWorkout: id =>
    set(state => ({
      offlineWorkouts: state.offlineWorkouts.filter(w => w.id !== id),
    })),

  clearOfflineWorkouts: () => set({ offlineWorkouts: [] }),
}));
