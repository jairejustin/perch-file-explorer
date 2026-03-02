import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import * as tauriPath from '@tauri-apps/api/path';
import { useExplorerStore, type FileEntry } from '../../store/explorerStore';
import { HugeiconsIcon } from '@hugeicons/react';
import { ICON_SIZES, STROKE_SIZES } from '../../lib/constants';
import { Folder01Icon } from '@hugeicons/core-free-icons';
import './FileList.css';
import { formatSize, formatDate, getFileIcon } from '../../lib/utils';

export function FileList() {
  const { currentPath, files, setFiles, navigate, openFile } =
    useExplorerStore();

  const handleOpen = (file: FileEntry) => {
    if (file.isDir) {
      navigate(file.path);
    } else {
      openFile(file.path);
    }
  };

  useEffect(() => {
    tauriPath.homeDir().then(navigate).catch(console.error);
  }, []);

  useEffect(() => {
    if (!currentPath) return;
    invoke<FileEntry[]>('get_files', { path: currentPath })
      .then(setFiles)
      .catch(console.error);
  }, [currentPath]);

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
    </div>
  );
}

export default FileList;
