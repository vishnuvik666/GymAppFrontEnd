import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AvailabilityPayload = {
  sessionName: string;
  firstDate: string;
  startTime: string;
  endTime: string;
  repeatSessions: boolean;
  rangeStart?: string | null;
  rangeEnd?: string | null;
};

type AvailabilityState = {
  pendingAvailabilities: AvailabilityPayload[];
  addPending: (payload: AvailabilityPayload) => void;
  removePending: (index: number) => void;
  clearAll: () => void;
};

export const useAvailabilityStore = create<AvailabilityState>()(
  persist(
    set => ({
      pendingAvailabilities: [],

      addPending: payload =>
        set(state => ({
          pendingAvailabilities: [...state.pendingAvailabilities, payload],
        })),

      removePending: index =>
        set(state => ({
          pendingAvailabilities: state.pendingAvailabilities.filter(
            (_, i) => i !== index,
          ),
        })),

      clearAll: () => set({ pendingAvailabilities: [] }),
    }),
    {
      name: 'availability-storage',
    },
  ),
);
