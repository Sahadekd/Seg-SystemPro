import React from 'react';
import { SecurityProvider } from './context/SecurityContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginBox from './components/LoginBox';
import SqlQueryViewer, { LogConsole } from './components/SqlQueryViewer';

const App: React.FC = () => {
  return (
    <SecurityProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <Sidebar />
          
          <div className="flex-1 flex flex-col bg-dark-bg/50">
            <LoginBox />
            <SqlQueryViewer />
          </div>
        </main>
        
        <LogConsole />
      </div>
    </SecurityProvider>
  );
};

export default App;
