import { create } from 'zustand';

export const useNewsStore = create((set) => ({
  newsBoxes: [],

  // కొత్త వార్తను జోడించడం
  addNewsBox: (boxData) => set((state) => ({
    newsBoxes: [...state.newsBoxes, boxData]
  })),

  // వార్తను అప్‌డేట్ చేయడం (హెడ్‌లైన్, టెక్స్ట్, కలర్స్ మారినప్పుడు)
  updateNewsBox: (id, updatedFields) => set((state) => ({
    newsBoxes: state.newsBoxes.map((box) => 
      box.id === id ? { ...box, ...updatedFields } : box
    )
  })),

  // వార్తను తొలగించడం
  removeNewsBox: (id) => set((state) => ({
    newsBoxes: state.newsBoxes.filter((box) => box.id !== id)
  }))
}));
                                   
