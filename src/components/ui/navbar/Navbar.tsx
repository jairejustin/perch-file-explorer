import React from 'react';
import './Navbar.css';

export const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <div className="breadcrumbs">
        <span className="breadcrumb-segment">/ Local Disk (C:)</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-segment">User</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-segment">Home</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Photos</span>
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search files (.jpg, .mp4)..." 
        />
      </div>
    </header>
  );
};