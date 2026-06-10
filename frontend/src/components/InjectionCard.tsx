import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info, Code } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

interface InjectionCardProps {
  title: string;
  description: string;
  impact: string;
  payload: string;
  explanation: string;
  mitigation: string;
}

const InjectionCard: React.FC<InjectionCardProps> = ({ 
  title, description, impact, payload, explanation, mitigation 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isVulnerable } = useSecurity();

  return (
    <div className={`mb-4 overflow-hidden border rounded-xl transition-all duration-300 ${
      isVulnerable 
        ? 'border-vulnerable/20 bg-vulnerable/5 hover:border-vulnerable/40' 
        : 'border-protected/20 bg-protected/5 hover:border-protected/40'
    }`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isVulnerable ? 'bg-vulnerable/20 text-vulnerable' : 'bg-protected/20 text-protected'}`}>
            <AlertTriangle size={18} />
          </div>
          <span className="font-bold text-slate-200">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-1">
                  <Info size={14} /> O QUE É?
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-vulnerable mb-1">
                  <AlertTriangle size={14} /> IMPACTO
                </h4>
                <p className="text-sm text-slate-300">{impact}</p>
              </div>

              <div className={`p-4 rounded-lg bg-black/40 border ${isVulnerable ? 'border-vulnerable/30' : 'border-protected/30'}`}>
                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  <Code size={14} /> Payload Educativo
                </h4>
                <code className="text-sm text-white break-all block font-mono bg-black/30 p-2 rounded">
                  {payload}
                </code>
              </div>

              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-1 uppercase tracking-wider">
                   {isVulnerable ? 'Explicação Técnica' : 'Como foi Corrigido?'}
                </h4>
                <p className="text-sm text-slate-400 italic">
                  {isVulnerable ? explanation : mitigation}
                </p>
              </div>

              {!isVulnerable && (
                <div className="flex items-center gap-2 text-xs font-bold text-protected bg-protected/10 p-2 rounded border border-protected/20">
                  <CheckCircle size={14} /> DEFESA ATIVA NO BACKEND
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InjectionCard;
