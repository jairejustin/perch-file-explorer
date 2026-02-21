import React from 'react';
import { Layout } from './Layout';
import { useExplorerStore } from './store/explorerStore';
import './App.css';

export const App: React.FC = () => {
  const { currentPath } = useExplorerStore();
  
  const currentFolder = currentPath[currentPath.length - 1];

  return (
    <Layout>
      <div className="media-stage">
        <div className="empty-state">
          <h2>{currentFolder}</h2>
          <p>No media files found in this folder.</p>
        </div>
      </div>
    </Layout>
  );
};

export default App;