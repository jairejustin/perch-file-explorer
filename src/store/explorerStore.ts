import { create } from 'zustand';
export interface FileEntry {
  name: string;
  isDir: boolean;
  path: string;
  size?: number;
  modified?: number | null;
}

interface ExplorerState {
  // current location
  currentPath: string;
  files: FileEntry[];

  // nav history
  history: string[]; // visited paths, oldest to newest
  historyIndex: number; // pointer into history[]
  canGoBack: boolean;
  canGoForward: boolean;

  // search
  searchQuery: string;

  // async state
  isLoading: boolean;
  error: string | null;

  // ACTIONS

  navigate: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  setFiles: (files: FileEntry[]) => void;
  setSearchQuery: (query: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

function deriveNavFlags(history: string[], index: number) {
  return {
    canGoBack: index > 0,
    canGoForward: index < history.length - 1,
  };
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  // init
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

    // truncate any forward history when branching to a new path
    const newHistory = [...history.slice(0, historyIndex + 1), path];
    const newIndex = newHistory.length - 1;

    set({
      currentPath: path,
      history: newHistory,
      historyIndex: newIndex,
      ...deriveNavFlags(newHistory, newIndex),
      // clear stale state
      files: [],
      searchQuery: '',
      error: null,
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

  setFiles: (files) => set({ files }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
