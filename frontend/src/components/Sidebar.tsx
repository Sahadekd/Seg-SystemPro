import React from 'react';
import InjectionCard from './InjectionCard';

const sidebarData = [
  {
    title: "1. Bypass de Login",
    description: "O mais clássico SQLi. Usa operadores lógicos para fazer a query retornar verdadeiro, pulando a verificação de senha.",
    impact: "Acesso total não autorizado a contas de usuários ou painéis administrativos.",
    payload: "' OR 1=1 --",
    explanation: "No modo vulnerável, a query se torna 'SELECT * FROM users WHERE email = '' OR 1=1 --' AND password = '...'. O -- comenta o resto da query, e 1=1 é sempre verdade.",
    mitigation: "Queries parametrizadas tratam o payload como uma string simples, procurando por um email literal chamado \"' OR 1=1 --\", que não existe."
  },
  {
    title: "2. Enumeração de Usuários",
    description: "Revelar se um usuário existe no banco analisando mensagens de erro diferentes ou tempos de resposta.",
    impact: "Ajuda atacantes a mapear emails válidos para ataques direcionados ou phishing.",
    payload: "admin@lab.com",
    explanation: "Aplicações vulneráveis retornam erros específicos como 'Usuário não encontrado' vs 'Senha incorreta', vazando informações.",
    mitigation: "Sempre retorne uma mensagem genérica como 'Credenciais inválidas', independentemente do usuário existir ou não."
  },
  {
    title: "3. Injeção UNION SELECT",
    description: "Usa o operador UNION para combinar resultados da query original com uma nova query escolhida pelo atacante.",
    impact: "Exfiltração de dados sensíveis de outras tabelas, como senhas, tokens ou info do sistema.",
    payload: "' UNION SELECT name, password, role FROM users --",
    explanation: "Isso permite que o atacante 'anexe' linhas da tabela de usuários aos resultados de uma busca comum.",
    mitigation: "Ao usar placeholders ($1, $2), toda a string UNION é tratada como termo de busca, não como comando SQL."
  },
  {
    title: "4. Injeção Baseada em Erro",
    description: "Causar erros propositais no banco para extrair informações das mensagens de erro retornadas pelo servidor.",
    impact: "Vaza versão do banco, nomes de tabelas, estruturas de colunas e dados.",
    payload: "' AND 1=(SELECT COUNT(*) FROM users) --",
    explanation: "No modo vulnerável, o servidor retorna erros brutos do banco (ex: erros de sintaxe) diretamente para o usuário.",
    mitigation: "Tratamento de erros genérico e queries parametrizadas impedem que sub-queries maliciosas sejam executadas."
  },
  {
    title: "5. Blind SQL Injection",
    description: "Fazer perguntas de verdadeiro/falso ao banco e observar a resposta da aplicação (baseado em booleano).",
    impact: "Extração lenta mas constante de dados adivinhando caracteres um por um.",
    payload: "' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE email='admin@lab.com')='a' --",
    explanation: "O atacante observa se a página carrega 'normalmente' ou com erro para confirmar seu palpite.",
    mitigation: "Tipagem estrita e parametrização garantem que operadores lógicos não possam ser injetados."
  },
  {
    title: "6. Injeção Baseada em Tempo",
    description: "Um tipo de Blind SQLi onde o atacante mede quanto tempo o servidor leva para responder.",
    impact: "Extração de dados mesmo quando a aplicação não retorna erros ou mudanças visíveis.",
    payload: "' AND (SELECT 1 FROM users WHERE email='admin@lab.com' AND pg_sleep(5)) --",
    explanation: "Se o servidor demorar 5 segundos para responder, o atacante sabe que a condição testada é verdadeira.",
    mitigation: "Sanitização e parametrização impedem a execução de funções do banco como pg_sleep."
  },
  {
    title: "7. Simulação de DROP TABLE",
    description: "Um ataque destrutivo onde o atacante tenta deletar tabelas inteiras ou o banco de dados.",
    impact: "Perda irreparável de dados, queda do sistema e interrupção do negócio.",
    payload: "'; DROP TABLE users; --",
    explanation: "No modo vulnerável, o ponto e vírgula permite executar múltiplos comandos em uma única requisição.",
    mitigation: "Queries parametrizadas não permitem múltiplos statements e tratam o payload como texto literal."
  },
  {
    title: "8. Bypass de Autorização",
    description: "Manipular identificadores (como IDs na URL) para acessar dados de outros usuários.",
    impact: "Escalação de privilégios e vazamento massivo de dados.",
    payload: "/api/users/id_do_admin",
    explanation: "Acessar um recurso diretamente via ID sem verificar se o usuário atual tem permissão para vê-lo.",
    mitigation: "Sempre verifique as permissões da sessão e use queries parametrizadas para buscar o recurso."
  }
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
