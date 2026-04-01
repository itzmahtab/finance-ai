import { create } from 'zustand'

interface FilterState {
  selectedMonth: number | null; // 0-11, where 0 is Jan. null = 'All Time'
  selectedYear: number | null;
  setMonthFilter: (month: number | null, year: number | null) => void;
}

export const useFilterStore = create<FilterState>((set) => {
  const now = new Date();
  
  return {
    selectedMonth: now.getMonth(),
    selectedYear: now.getFullYear(),
    
    setMonthFilter: (month, year) => set({ 
      selectedMonth: month, 
      selectedYear: year 
    }),
  };
});
