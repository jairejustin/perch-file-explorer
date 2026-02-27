import React from 'react';
import { Layout } from './Layout';
import FileList from './components/file-list/FileList';
import './App.css';

const App: React.FC = () => {
  return (
    <Layout>
      <div className="media-stage">
        <FileList />
      </div>
    </Layout>
  );
};

export default App;
