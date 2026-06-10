import React from 'react';
import InjectionCard from './InjectionCard';

const sidebarData = [
  {
    title: "1. Bypass de Login",
    description: "Manipulação da lógica SQL (OR, --) para autenticar sem senha válida.",
    impact: "Acesso total não autorizado e sequestro de contas.",
    payload: "' OR '1'='1' --",
    explanation: "A query é alterada para retornar sempre 'verdadeiro', ignorando a validação da senha.",
    mitigation: "Uso de Prepared Statements: O banco trata o input como texto puro, impedindo que comandos injetados alterem a lógica da consulta."
  },
  {
    title: "2. Enumeração de Usuários",
    description: "Descoberta de emails válidos através de mensagens de erro ou tempo de resposta.",
    impact: "Vazamento de privacidade e facilitação de ataques de força bruta.",
    payload: "naoexiste@lab.com → Usuário não encontrado /// admin@lab.com → Senha incorreta",
    explanation: "Respostas diferentes para 'usuário inexistente' vs 'senha errada' confirmam a existência de contas.",
    mitigation: "Respostas Genéricas: O sistema deve retornar a mesma mensagem de erro para qualquer falha de login, ocultando a existência do usuário."
  },
  {
    title: "3. Injeção UNION SELECT",
    description: "Uso do UNION para anexar dados de outras tabelas ao resultado original.",
    impact: "Exfiltração em massa de dados sensíveis (senhas, tokens, etc).",
    payload: "' UNION SELECT 1, name, email, password, role, 6 FROM users --    ///   ' UNION SELECT '00000000-0000-0000-0000-000000000000',name,email,password,role,NOW()FROM users --",
    explanation: "Permite 'roubar' colunas de qualquer tabela e exibi-las na interface da aplicação.",
    mitigation: "Parametrização: Ao usar placeholders ($1, $2), palavras-chave como 'UNION' são tratadas como busca literal e nunca executadas como comando."
  },
  {
    title: "4. Injeção Baseada em Erro",
    description: "Extração de dados técnicos através de mensagens de erro detalhadas do banco.",
    impact: "Vaza versões do sistema, nomes de tabelas e metadados estruturais.",
    payload: "' ORDER BY 999 --",
    explanation: "Força um erro de conversão de tipo para que o banco exiba dados internos na própria mensagem de erro.",
    mitigation: "Tratamento de Erros: Desativar mensagens detalhadas em produção e retornar apenas erros genéricos (ex: 500 Internal Error)."
  },
  {
    title: "5. Blind SQL Injection",
    description: "Extração lenta de dados através de perguntas booleanas (verdadeiro/falso).",
    impact: "Recuperação total da base, caractere por caractere, sem feedback visual direto.",
    payload: "admin@lab.com' AND 1=1 --  ///  admin@lab.com' AND 1=2 --",
    explanation: "O atacante deduz a senha observando se a página carrega ou falha para cada letra testada.",
    mitigation: "Validação de Input e Parametrização: Filtrar caracteres especiais e garantir que a query não aceite lógica booleana injetada."
  },
  {
    title: "6. Injeção Baseada em Tempo",
    description: "Ataque 'cego' que confirma dados medindo o tempo de resposta do servidor.",
    impact: "Extração de dados mesmo em sistemas sem retorno visual ou de erro.",
    payload: "admin@lab.com' OR 1=(SELECT 1 FROM pg_sleep(5))--",
    explanation: "Se o servidor demora 5s para responder, o atacante sabe que a condição injetada é verdadeira.",
    mitigation: "Timeouts e Parametrização: Limitar o tempo de execução de queries e impedir a execução de funções de sistema via parâmetros."
  },
  {
    title: "7. Simulação de DROP TABLE",
    description: "Execução de múltiplos comandos (stacking queries) para deletar dados.",
    impact: "Destruição total da base de dados e interrupção do serviço.",
    payload: "'; DROP TABLE lab_temp_users; --",
    explanation: "Tenta encerrar a query legítima e iniciar um comando destrutivo logo em seguida.",
    mitigation: "Desativar Multi-Statements: Configurar o driver do banco para permitir apenas um comando por requisição, bloqueando o uso do ponto e vírgula."
  },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-full lg:w-[450px] flex flex-col h-[calc(100vh-80px)] overflow-y-auto p-6 border-r border-white/10 glass-panel">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-2">Base de Conhecimento</h2>
        <p className="text-sm text-slate-400">Selecione um tipo de injeção para aprender como funciona e testar no laboratório.</p>
      </div>
      
      <div className="flex-1">
        {sidebarData.map((card, index) => (
          <InjectionCard key={index} {...card} />
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Nota Educativa</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Este lab usa um banco PostgreSQL real mas o protege com zonas seguras simuladas. Não use estes payloads em sistemas reais.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
