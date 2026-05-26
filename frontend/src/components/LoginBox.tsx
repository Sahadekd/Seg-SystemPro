import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, LogIn, RefreshCcw, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

const LoginBox: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { isVulnerable, setLastQuery, addLog } = useSecurity();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    addLog(`Tentativa de login com email: ${email}`);
    
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
        isVulnerable
      });
      
      setResult({
        success: true,
        data: response.data
      });
      setLastQuery(response.data.query);
      addLog(`Login bem-sucedido para ${response.data.user?.name || email}`);
    } catch (error: any) {
      const errorData = error.response?.data;
      setResult({
        success: false,
        data: errorData || { message: 'Erro de Conexão' }
      });
      if (errorData?.query) setLastQuery(errorData.query);
      addLog(`Falha no login: ${errorData?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setResult(null);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className={`p-8 rounded-2xl border glass-panel transition-all duration-500 ${
          isVulnerable ? 'border-vulnerable/20' : 'border-protected/20'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <LogIn className={isVulnerable ? 'text-vulnerable' : 'text-protected'} />
              Teste de SQLi
            </h2>
            <button 
              onClick={resetForm}
              className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
              title="Resetar Formulário"
            >
              <RefreshCcw size={18} />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <User size={14} /> Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lab.com"
                className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all ${
                  isVulnerable 
                    ? 'border-vulnerable/30 focus:ring-vulnerable/50' 
                    : 'border-protected/30 focus:ring-protected/50'
                }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Lock size={14} /> Senha
              </label>
              <input
                type="text" // Mostrado como texto para fins educativos
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white outline-none focus:ring-2 transition-all ${
                  isVulnerable 
                    ? 'border-vulnerable/30 focus:ring-vulnerable/50' 
                    : 'border-protected/30 focus:ring-protected/50'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                isVulnerable 
                  ? 'bg-vulnerable text-white hover:bg-vulnerable/80 vulnerable-glow' 
                  : 'bg-protected text-white hover:bg-protected/80 protected-glow'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? <RefreshCcw className="animate-spin" /> : <LogIn size={20} />}
              {isVulnerable ? 'EXECUTAR LOGIN VULNERÁVEL' : 'EXECUTAR LOGIN PROTEGIDO'}
            </button>
          </form>

          {result && (
            <div className={`mt-8 p-6 rounded-xl border animate-in fade-in slide-in-from-top-4 duration-500 ${
              result.success 
                ? 'bg-protected/10 border-protected/30 text-protected' 
                : 'bg-vulnerable/10 border-vulnerable/30 text-vulnerable'
            }`}>
              <div className="flex items-start gap-4">
                {result.success ? <CheckCircle2 className="mt-1" /> : <AlertCircle className="mt-1" />}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {result.success ? 'Sucesso!' : 'Acesso Negado'}
                  </h3>
                  <p className="text-slate-300 mb-4">
                    {result.success 
                      ? `Bem-vindo, ${result.data.user.name}. Você conseguiu burlar ou validar as credenciais.`
                      : result.data.message || 'O sistema bloqueou esta tentativa.'
                    }
                  </p>
                  
                  <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2 uppercase">
                      <Database size={12} /> Metadados do Banco
                    </div>
                    <pre className="text-xs text-slate-400 overflow-x-auto">
                      {JSON.stringify(result.data.user || result.data.error || {}, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginBox;
