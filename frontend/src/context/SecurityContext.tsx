import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface SecurityContextType {
  isVulnerable: boolean;
  toggleSecurity: () => void;
  lastQuery: string;
  setLastQuery: (query: string) => void;
  logs: string[];
  addLog: (log: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [lastQuery, setLastQuery] = useState('');
  const [logs, setLogs] = useState<string[]>(['Sistema inicializado. Modo: VULNERÁVEL']);

  const toggleSecurity = () => {
    setIsVulnerable((prev) => !prev);
    addLog(`Modo de segurança alterado para: ${!isVulnerable ? 'VULNERÁVEL' : 'PROTEGIDO'}`);
  };

  const addLog = (log: string) => {
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${log}`,
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  };

  return (
    <SecurityContext.Provider value={{ isVulnerable, toggleSecurity, lastQuery, setLastQuery, logs, addLog }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
