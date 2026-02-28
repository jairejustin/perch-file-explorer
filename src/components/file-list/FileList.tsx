import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import * as tauriPath from '@tauri-apps/api/path';
import { useExplorerStore, type FileEntry } from '../../store/explorerStore';
import { HugeiconsIcon } from '@hugeicons/react';
import { ICON_SIZES, STROKE_SIZES } from '../../lib/constants';
import {
  File01Icon,
  Folder01Icon,
  Image01Icon,
  Video01Icon,
  MusicNote01Icon,
  CodeIcon,
  Zip01Icon,
  Note01Icon,
} from '@hugeicons/core-free-icons';
import './FileList.css';

const formatSize = (bytes?: number, isDir?: boolean) => {
  if (isDir || bytes === undefined) return '--';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return '--';
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
    case 'webp':
      return Image01Icon;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'm4a':
      return MusicNote01Icon;
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
      return Video01Icon;
    case 'html':
    case 'css':
    case 'js':
    case 'ts':
    case 'json':
    case 'tsx':
    case 'jsx':
    case 'xml':
    case 'yaml':
    case 'rs':
    case 'py':
      return CodeIcon;
    case 'zip':
    case 'rar':
    case 'gz':
      return Zip01Icon;
    case 'txt':
    case 'md':
    case 'csv':
      return Note01Icon;
    default:
      return File01Icon;
  }
};

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
