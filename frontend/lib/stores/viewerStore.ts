import { create } from "zustand";

interface ViewerState {
  gamma: number;
  brightness: number;
  contrast: number;
  iccCorrectionEnabled: boolean;
  cellAnnotationsVisible: boolean;
  setGamma: (value: number) => void;
  setBrightness: (value: number) => void;
  setContrast: (value: number) => void;
  toggleIccCorrection: () => void;
  toggleCellAnnotations: () => void;
  reset: () => void;
}

const defaultState = {
  gamma: 1,
  brightness: 0,
  contrast: 0,
  iccCorrectionEnabled: true,
  cellAnnotationsVisible: false,
};

export const useViewerStore = create<ViewerState>((set) => ({
  ...defaultState,
  setGamma: (gamma) => set({ gamma }),
  setBrightness: (brightness) => set({ brightness }),
  setContrast: (contrast) => set({ contrast }),
  toggleIccCorrection: () => set((s) => ({ iccCorrectionEnabled: !s.iccCorrectionEnabled })),
  toggleCellAnnotations: () => set((s) => ({ cellAnnotationsVisible: !s.cellAnnotationsVisible })),
  reset: () => set(defaultState),
}));
