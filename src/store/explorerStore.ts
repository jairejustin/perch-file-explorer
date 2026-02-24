import { create } from 'zustand';

// isDir matches the camelCase Rust sends over
export interface FileEntry {
  name: string;
  isDir: boolean;
  path: string;
}

interface ExplorerState {
  currentPath: string;
  files: FileEntry[];
  setCurrentPath: (path: string) => void;
  setFiles: (files: FileEntry[]) => void;
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  currentPath: '',   // Will be set to homeDir() by FileList on mount
  files: [],
  setCurrentPath: (path) => set({ currentPath: path }),
  setFiles: (files) => set({ files }),
}));