import { create } from 'zustand';

export const useMasterStore = create((set) => ({
  activeMode: 'MASTER', // మూడు మోడ్‌లు: 'MASTER', 'DAILY', 'MOBILE'
  masterLayouts: {},
  currentWorkingPage: null,

  // మోడ్‌ను మార్చడం
  setActiveMode: (mode) => set({ activeMode: mode }),

  // మాస్టర్ లేఅవుట్‌ను సేవ్ చేయడం
  saveMasterLayout: (id, layoutData) => set((state) => ({
    masterLayouts: { ...state.masterLayouts, [id]: layoutData }
  })),

  // డైలీ వర్క్ కోసం ఒరిజినల్ మాస్టర్ చెక్కుచెదరకుండా డూప్లికేట్ ఓపెన్ చేయడం
  openDailyLayout: (id) => set((state) => {
    const original = state.masterLayouts[id];
    if (!original) return {};
    const duplicateCopy = JSON.parse(JSON.stringify(original)); // Deep Clone
    return {
      currentWorkingPage: duplicateCopy,
      activeMode: 'DAILY'
    };
  }),

  // మొబైల్ మోడ్‌కి మారడం
  enableMobileMode: () => set({ activeMode: 'MOBILE' })
}));
