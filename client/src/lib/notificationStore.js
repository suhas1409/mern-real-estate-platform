import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,

  // FETCH NOTIFICATION COUNT
  fetch: async () => {
    try {
      const res = await apiRequest.get(
        "/users/notification"
      );

      set({
        number: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // INCREASE NOTIFICATION
  increase: () => {
    set((state) => ({
      number: state.number + 1,
    }));
  },

  // DECREASE NOTIFICATION
  decrease: () => {
    set((state) => ({
      number: Math.max(
        state.number - 1,
        0
      ),
    }));
  },

  // RESET NOTIFICATIONS
  reset: () => {
    set({
      number: 0,
    });
  },
}));