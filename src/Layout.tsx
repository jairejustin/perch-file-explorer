import React, { ReactNode } from 'react';
import './App.css';
import { Sidebar } from './components/ui/sidebar/Sidebar';
import { Navbar } from './components/ui/navbar/Navbar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};