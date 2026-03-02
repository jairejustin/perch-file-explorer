import {
  File01Icon,
  Image01Icon,
  Video01Icon,
  MusicNote01Icon,
  CodeIcon,
  Zip01Icon,
  Note01Icon,
} from '@hugeicons/core-free-icons';

export const formatSize = (bytes?: number, isDir?: boolean) => {
  if (isDir || bytes === undefined) return '--';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const formatDate = (timestamp?: number | null) => {
  if (!timestamp) return '--';
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getFileIcon = (filename: string) => {
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
