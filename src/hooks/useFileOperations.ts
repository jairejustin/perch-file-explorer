import { invoke } from '@tauri-apps/api/core';
import { useExplorerStore } from '../store/explorerStore';
import type { FileEntry } from '../lib/types';

export function useFileOperations() {
  const refreshFiles = useExplorerStore((state) => state.refreshFiles);

  const deleteFile = async (file: FileEntry) => {
    try {
      await invoke('delete_file', { path: file.path });
      await refreshFiles();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const renameFile = async (file: FileEntry, newName: string) => {
    try {
      await invoke('rename_file', { old_path: file.path, new_name: newName });
      await refreshFiles();
    } catch (err) {
      console.error('Failed to rename:', err);
    }
  };

  return { deleteFile, renameFile };
}
