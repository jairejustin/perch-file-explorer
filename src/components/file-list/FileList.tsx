import { useEffect } from 'react';
import * as tauriPath from '@tauri-apps/api/path';
import { useExplorerStore } from '../../store/useExplorerStore';
import { useContextMenu } from '../../hooks/useContextMenu';
import { useFileOperations } from '../../hooks/useFileOperations';
import ContextMenu from '../ui/context-menu/ContextMenu';
import type { FileEntry, ContextMenuItem } from '../../lib/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { ICON_SIZES, STROKE_SIZES } from '../../lib/constants';
import { Folder01Icon } from '@hugeicons/core-free-icons';
import { formatSize, formatDate, getFileIcon } from '../../lib/utils';
import './FileList.css';

export function FileList() {
  const { currentPath, files, navigate, openFile, refreshFiles } =
    useExplorerStore();

  const {
    isOpen,
    x,
    y,
    data: activeFile,
    openMenu,
    closeMenu,
  } = useContextMenu<FileEntry>();
  const { deletePath } = useFileOperations();

  useEffect(() => {
    tauriPath.homeDir().then(navigate).catch(console.error);
  }, [navigate]);

  useEffect(() => {
    if (currentPath) {
      refreshFiles();
    }
  }, [currentPath, refreshFiles]);

  const handleOpen = (file: FileEntry) => {
    file.isDir ? navigate(file.path) : openFile(file.path);
  };

  const menuItems: ContextMenuItem[] = [
    {
      label: 'Open',
      onClick: () => {
        activeFile && handleOpen(activeFile);
        closeMenu();
      },
    },
    {
      label: 'Rename',
      onClick: () => {
        console.log('Rename logic for:', activeFile?.name);
        closeMenu();
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        activeFile && deletePath(activeFile);
        closeMenu();
      },
    },
  ];

  return (
    <div className="file-list-wrapper">
      <div className="file-list-header">
        <span className="header-col-name">Name</span>
        <span className="header-col-date">Date Modified</span>
        <span className="header-col-size">Size</span>
      </div>

      <ul className="file-list">
        {files.length === 0 ? (
          <li className="file-list__empty">No files found.</li>
        ) : (
          files.map((file) => (
            <li
              key={file.path}
              className={`file-list__item${file.isDir ? ' file-list__item--dir' : ''}`}
              onDoubleClick={() => handleOpen(file)}
              onContextMenu={(e) => {
                e.stopPropagation();
                openMenu(e, file);
              }}
            >
              <div className="file-list__name-col">
                <span className="file-list__icon">
                  {file.isDir ? (
                    <HugeiconsIcon
                      icon={Folder01Icon}
                      size={ICON_SIZES.m}
                      color="currentColor"
                      strokeWidth={STROKE_SIZES.thin}
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={getFileIcon(file.name)}
                      size={ICON_SIZES.m}
                      color="currentColor"
                      strokeWidth={STROKE_SIZES.thin}
                    />
                  )}
                </span>
                <span className="file-list__name">{file.name}</span>
              </div>

              <span className="file-list__date-col">
                {formatDate(file.modified)}
              </span>
              <span className="file-list__size-col">
                {formatSize(file.size, file.isDir)}
              </span>
            </li>
          ))
        )}
      </ul>

      {isOpen && <ContextMenu items={menuItems} position={{ x, y }} />}
    </div>
  );
}

export default FileList;
