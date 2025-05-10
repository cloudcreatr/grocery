import { create } from "zustand/react";

interface ConnectionStatus {
  status: "connected" | "disconnected" | "error";
  setStatus: (status: "connected" | "disconnected" | "error") => void;
}

export const useConnectionStatusStore = create<ConnectionStatus>((set) => ({
  status: "disconnected",
  setStatus: (status) => set({ status }),
}));
