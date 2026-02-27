import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { useExplorerStore } from '../../../store/explorerStore';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Search01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { STROKE_SIZES, ICON_SIZES } from '../../../lib/constants';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, goBack, goForward, canGoBack, canGoForward } =
    useExplorerStore();

  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // parse path into individual clickable segments
  const segments = currentPath
    .split('/')
    .filter(Boolean)
    .map((seg, i, arr) => ({
      label: seg,
      path: '/' + arr.slice(0, i + 1).join('/'),
    }));

  // ctrl+F to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape' && searchFocused) {
        setSearchValue('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [searchFocused]);

  return (
    <header className="navbar">
      <div className="nav-controls">
        <button
          className="nav-btn"
          onClick={goBack}
          disabled={!canGoBack}
          title="Back (Alt+←)"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={ICON_SIZES.l}
            color="currentColor"
            strokeWidth={STROKE_SIZES.default}
          />
        </button>
        <button
          className="nav-btn"
          onClick={goForward}
          disabled={!canGoForward}
          title="Forward (Alt+→)"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={ICON_SIZES.l}
            color="currentColor"
            strokeWidth={STROKE_SIZES.default}
          />
        </button>
      </div>

      <nav className="breadcrumb-bar" aria-label="Current path">
        <button
          className="breadcrumb-seg breadcrumb-root"
          onClick={() => navigate('/')}
          title="/"
        >
          root
        </button>

        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <React.Fragment key={seg.path}>
              <span className="breadcrumb-chevron" aria-hidden>
                /
              </span>
              <button
                className={`breadcrumb-seg${isLast ? ' breadcrumb-seg--active' : ''}`}
                onClick={() => !isLast && navigate(seg.path)}
                disabled={isLast}
                title={seg.path}
              >
                {seg.label}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div
        className={`search-wrap${searchFocused ? ' search-wrap--focused' : ''}`}
      >
        <span className="search-icon">
          <HugeiconsIcon
            icon={Search01Icon}
            size={ICON_SIZES.m}
            color="currentColor"
            strokeWidth={STROKE_SIZES.default}
          />
        </span>
        <input
          ref={searchRef}
          type="text"
          className="search-input"
          placeholder="Search…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          aria-label="Search files"
          spellCheck={false}
        />
        {searchValue && (
          <button
            className="search-clear"
            onMouseDown={(e) => {
              e.preventDefault();
              setSearchValue('');
            }}
            tabIndex={-1}
            aria-label="Clear search"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={ICON_SIZES.m}
              color="currentColor"
              strokeWidth={STROKE_SIZES.default}
            />
          </button>
        )}
        <kbd
          className={`search-kbd${searchFocused || searchValue ? ' search-kbd--hidden' : ''}`}
        >
          ⌘F
        </kbd>
      </div>
    </header>
  );
};
