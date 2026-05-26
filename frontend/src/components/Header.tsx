import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

const Header: React.FC = () => {
  const { isVulnerable, toggleSecurity } = useSecurity();

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-colors duration-500 ${
      isVulnerable ? 'bg-vulnerable/10 border-vulnerable/30' : 'bg-protected/10 border-protected/30'
    } glass-panel px-6 py-4 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isVulnerable ? 'bg-vulnerable/20' : 'bg-protected/20'}`}>
          <Shield className={isVulnerable ? 'text-vulnerable' : 'text-protected'} size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Lab SQLi <span className="text-sm font-normal text-slate-400">Painel Educativo</span></h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Ambiente de Demonstração Acadêmica</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className={`text-sm font-bold ${isVulnerable ? 'text-vulnerable' : 'text-slate-500'}`}>VULNERÁVEL</span>
          <button
            onClick={toggleSecurity}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
              isVulnerable ? 'bg-vulnerable' : 'bg-protected'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isVulnerable ? 'translate-x-1' : 'translate-x-7'
              }`}
            />
          </button>
          <span className={`text-sm font-bold ${!isVulnerable ? 'text-protected' : 'text-slate-500'}`}>PROTEGIDO</span>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
          isVulnerable 
            ? 'bg-vulnerable/20 border-vulnerable/50 text-vulnerable vulnerable-glow' 
            : 'bg-protected/20 border-protected/50 text-protected protected-glow'
        }`}>
          {isVulnerable ? (
            <>
              <ShieldAlert size={14} />
              SISTEMA EM RISCO
            </>
          ) : (
            <>
              <ShieldCheck size={14} />
              SISTEMA SEGURO
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
