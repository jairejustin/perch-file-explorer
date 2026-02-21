import React from 'react';
import './Sidebar.css';
import { HugeiconsIcon } from '@hugeicons/react'
import { 
  DashboardBrowsingIcon, 
  CameraVideoIcon, 
  Home01Icon, 
  DatabaseIcon, 
  SdCardIcon, 
  Album01Icon
} from '@hugeicons/core-free-icons';

export const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <span className="sidebar-heading">Library</span>
        <div className="sidebar-item">
          <span className="icon-placeholder">
             <HugeiconsIcon icon={DashboardBrowsingIcon} size={24} color="currentColor" strokeWidth={1.5} />
        </span>
          <span>All Media</span>
        </div>
        <div className="sidebar-item active">
          <span className="icon-placeholder">
            <HugeiconsIcon icon={Album01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </span>
          <span>Photos</span>
        </div>
        <div className="sidebar-item">
          <span className="icon-placeholder">
            <HugeiconsIcon icon={CameraVideoIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </span>
          <span>Videos</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-heading">Devices</span>
        <div className="sidebar-item">
          <span className="icon-placeholder">
            <HugeiconsIcon icon={Home01Icon} size={24} color="currentColor" strokeWidth={1.5} />
          </span>
          <span>Home</span>
        </div>
        <div className="sidebar-item active">
          <span className="icon-placeholder">
            <HugeiconsIcon icon={DatabaseIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </span>
          <span>Local Disk (C:)</span>
        </div>
        <div className="sidebar-item">
          <span className="icon-placeholder">
            <HugeiconsIcon icon={SdCardIcon} size={24} color="currentColor" strokeWidth={1.5} />
          </span>
          <span>SD Card_01</span>
        </div>
      </div>
    </aside>
  );
};