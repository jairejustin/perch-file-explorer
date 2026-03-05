import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { FileEntry } from '../lib/types';

interface ExplorerState {
  currentPath: string;
  files: FileEntry[];
  history: string[];
  historyIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  navigate: (path: string) => void;
  openFile: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  setFiles: (files: FileEntry[]) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshFiles: () => Promise<void>;
}

function deriveNavFlags(history: string[], index: number) {
  return {
    canGoBack: index > 0,
    canGoForward: index < history.length - 1,
  };
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  currentPath: '',
  files: [],
  history: [],
  historyIndex: -1,
  canGoBack: false,
  canGoForward: false,
  searchQuery: '',
  isLoading: false,
  error: null,

  navigate: (path) => {
    const { history, historyIndex, currentPath } = get();
    if (path === currentPath) return;

    const newHistory = [...history.slice(0, historyIndex + 1), path];
    const newIndex = newHistory.length - 1;

    set({
      currentPath: path,
      history: newHistory,
      historyIndex: newIndex,
      ...deriveNavFlags(newHistory, newIndex),
      files: [],
      searchQuery: '',
      error: null,
    });
  },

  openFile: (path) => {
    if (!path) return;
    invoke('open_file', { path }).catch((err) => {
      console.error('Failed to open file:', err);
      set({ error: 'Failed to open file' });
    });
  },

  goBack: () => {
    const { history, historyIndex, canGoBack } = get();
    if (!canGoBack) return;

    const newIndex = historyIndex - 1;
    const path = history[newIndex];

    set({
      currentPath: path,
      historyIndex: newIndex,
      ...deriveNavFlags(history, newIndex),
      files: [],
      error: null,
    });
  },

  goForward: () => {
    const { history, historyIndex, canGoForward } = get();
    if (!canGoForward) return;

    const newIndex = historyIndex + 1;
    const path = history[newIndex];

    set({
      currentPath: path,
      historyIndex: newIndex,
      ...deriveNavFlags(history, newIndex),
      files: [],
      error: null,
    });
  },

  refreshFiles: async () => {
    const { currentPath } = get();
    if (!currentPath) return;

    set({ isLoading: true });
    try {
      const files = await invoke<FileEntry[]>('get_files', {
        path: currentPath,
      });
      set({ files, error: null });
    } catch (err) {
      console.error('Failed to fetch files:', err);
      set({ error: 'Failed to read directory' });
    } finally {
      set({ isLoading: false });
    }
  },

  setFiles: (files) => set({ files }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
