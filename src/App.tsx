import React from 'react';
import { Layout } from './Layout';
import FileList from './components/file-list/FileList';
import ContextMenu from './components/ui/context-menu/ContextMenu';
import './App.css';
import { ContextMenuItem } from './lib/types';

const App: React.FC = () => {
  const fileContextMenuItems: ContextMenuItem[] = [
    {
      label: "Open",
      onClick: () => {}
    },
    {
      label: "Rename",
      onClick: () => {}
    },
    {
      label: "Delete",
      onClick: () => {}
    }
  ]

  return (
    <Layout>
      <div className="media-stage">
        <FileList />
        <ContextMenu items={fileContextMenuItems} position={{ x: 0, y: 0 }} />
      </div>
    </Layout>
  );
};

export default App;
