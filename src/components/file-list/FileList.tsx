import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import * as tauriPath from '@tauri-apps/api/path';
import { useExplorerStore, type FileEntry } from '../../store/explorerStore';
import { HugeiconsIcon } from '@hugeicons/react';
import { ICON_SIZES, STROKE_SIZES } from '../../lib/constants';
import { 
  File01Icon,
  Folder01Icon
} from '@hugeicons/core-free-icons';
import './FileList.css';

function FileList() {
  const { currentPath, files, setFiles, navigate } = useExplorerStore();

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
    <ul className="file-list">
      {files.length === 0 ? (
        <li className="file-list__empty">No files found.</li>
      ) : (
        files.map((file) => (
          <li
            key={file.path}
            className={`file-list__item${file.isDir ? ' file-list__item--dir' : ''}`}
            onClick={() => file.isDir && navigate(file.path)}
          >
            <span className="file-list__icon">
              {file.isDir ? 
                <HugeiconsIcon icon={Folder01Icon} size={ICON_SIZES.m} color="currentColor" strokeWidth={STROKE_SIZES.thin} />
                : <HugeiconsIcon icon={File01Icon} size={24} color="currentColor" strokeWidth={STROKE_SIZES.thin} />
              }
            </span>
            <span className="file-list__name">{file.name}</span>
          </li>
        ))
      )}
    </ul>
  );
}

export default FileList;