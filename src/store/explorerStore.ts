import { create } from 'zustand';

interface ExplorerState {
  currentPath: string[];
  activeSidebarTab: string;
  setPath: (path: string[]) => void;
  setActiveSidebarTab: (tab: string) => void;
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  currentPath: ['Locations', 'SD Card_01', 'Local Disk (C:)', 'User', 'Home', 'Photos'],
  activeSidebarTab: 'All Media',
  setPath: (path) => set({ currentPath: path }),
  setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
}));