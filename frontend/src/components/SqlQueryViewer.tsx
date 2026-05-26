import React from 'react';
import { Terminal, Code, Copy, Check } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

const SqlQueryViewer: React.FC = () => {
  const { lastQuery, isVulnerable } = useSecurity();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lastQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!lastQuery) return null;

  return (
    <div className={`mt-auto border-t transition-colors duration-500 ${
      isVulnerable ? 'bg-vulnerable/5 border-vulnerable/20' : 'bg-protected/5 border-protected/20'
    } p-6 glass-panel`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code size={18} className={isVulnerable ? 'text-vulnerable' : 'text-protected'} />
          <h3 className="font-bold text-slate-200">Última Query Executada</h3>
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 transition-colors"
        >
          {copied ? <Check size={14} className="text-protected" /> : <Copy size={14} />}
          {copied ? 'Copiado!' : 'Copiar SQL'}
        </button>
      </div>

      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-black/60 rounded-xl p-4 font-mono text-sm overflow-x-auto border border-white/5">
          <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> users 
          <br />
          <span className="text-blue-400">WHERE</span> 
          {isVulnerable ? (
            <span className="text-vulnerable font-bold"> {lastQuery.split('WHERE')[1]}</span>
          ) : (
            <span className="text-protected font-bold"> {lastQuery.split('WHERE')[1]}</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className={`w-2 h-2 rounded-full ${isVulnerable ? 'bg-vulnerable' : 'bg-protected'}`}></div>
            Método: {isVulnerable ? 'Concatenação Direta' : 'Query Parametrizada'}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            Alvo: Supabase PostgreSQL
        </div>
      </div>
    </div>
  );
};

export const LogConsole: React.FC = () => {
  const { logs } = useSecurity();

  return (
    <div className="fixed bottom-6 right-6 w-80 h-48 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col z-40 hidden xl:flex">
      <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center gap-2">
        <Terminal size={14} className="text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logs do Sistema</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-slate-400 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={i === 0 ? 'text-slate-200' : ''}>
            <span className="text-slate-600 mr-2">$</span> {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SqlQueryViewer;
