export interface ContextMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface FileEntry {
  name: string;
  isDir: boolean;
  path: string;
  size?: number;
  modified?: number | null;
}