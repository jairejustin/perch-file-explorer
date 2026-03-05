import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './Sidebar.css';
import { HugeiconsIcon } from '@hugeicons/react';
import { STROKE_SIZES, ICON_SIZES } from '../../../lib/constants';
import {
  Home01Icon,
  ComputerIcon,
  File01Icon,
  Download04Icon,
  MusicNote01Icon,
  Image01Icon,
  CameraVideoIcon,
  Delete02Icon,
  HardDriveIcon,
  DatabaseIcon,
  SdCardIcon,
  UsbConnectedIcon,
  DashboardBrowsingIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import { useExplorerStore } from '../../../store/useExplorerStore';

interface SidebarLocation {
  label: string;
  path: string;
  icon: string;
  category: 'places' | 'devices' | 'network';
}

const ICON_MAP: Record<string, IconSvgElement> = {
  home: Home01Icon,
  desktop: ComputerIcon,
  documents: File01Icon,
  downloads: Download04Icon,
  music: MusicNote01Icon,
  pictures: Image01Icon,
  videos: CameraVideoIcon,
  trash: Delete02Icon,
  filesystem: HardDriveIcon,
  database: DatabaseIcon,
  sdcard: SdCardIcon,
  usb: UsbConnectedIcon,
  hdd: HardDriveIcon,
};

function locationIcon(iconKey: string): IconSvgElement {
  return ICON_MAP[iconKey] ?? DashboardBrowsingIcon;
}

const CATEGORY_META = [
  { key: 'places', heading: 'Places' },
  { key: 'devices', heading: 'Devices' },
  { key: 'network', heading: 'Network' },
] as const;

export const Sidebar: React.FC = () => {
  const { currentPath, navigate } = useExplorerStore();

  const [locations, setLocations] = useState<SidebarLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    invoke<SidebarLocation[]>('get_sidebar_locations')
      .then(setLocations)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const categories = locations.reduce<Record<string, SidebarLocation[]>>(
    (acc, loc) => {
      (acc[loc.category] ??= []).push(loc);
      return acc;
    },
    {},
  );

  return (
    <aside className="sidebar">
      {loading && <div className="sidebar-status">Loading…</div>}

      {error && (
        <div className="sidebar-status sidebar-error">
          Failed to load locations
        </div>
      )}

      {!loading &&
        !error &&
        CATEGORY_META.map(({ key, heading }) => {
          const items = categories[key];
          if (!items?.length) return null;

          return (
            <div className="sidebar-section" key={key}>
              <span className="sidebar-heading">{heading}</span>

              {items.map((loc) => {
                const isActive = loc.path === currentPath;

                return (
                  <div
                    key={loc.path}
                    className={`sidebar-item${isActive ? ' active' : ''}`}
                    onClick={() => navigate(loc.path)}
                    title={loc.path}
                    role="button"
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="icon-placeholder">
                      <HugeiconsIcon
                        icon={locationIcon(loc.icon)}
                        size={ICON_SIZES.m}
                        color="currentColor"
                        strokeWidth={
                          isActive ? STROKE_SIZES.default : STROKE_SIZES.thin
                        }
                      />
                    </span>
                    <span className="sidebar-label">{loc.label}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
    </aside>
  );
};
