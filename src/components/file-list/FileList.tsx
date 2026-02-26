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
  Note01Icon
} from '@hugeicons/core-free-icons';
import './FileList.css';

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    // images
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
    case 'webp':
      return Image01Icon;

    // audio
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
    case 'ogg':
    case 'm4a':
      return MusicNote01Icon;
    
    // video
    case 'mp4':
    case 'mkv':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
      return Video01Icon;

    // code/web
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
    // to do: add more
      return CodeIcon;

    //archives
    case 'zip':
    case 'rar':
    case 'gz':
    case 'rar':
      return Zip01Icon;

    case 'txt':
    case 'md':
    case 'csv':
      return Note01Icon;

    default:
      return File01Icon;

  }
}

export function FileList() {
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
              )
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