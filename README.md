# Lab de SQL Injection 🛡️🔓 - Demonstração Acadêmica

Este é um projeto **Full-Stack Educacional** desenvolvido para demonstrar vulnerabilidades de SQL Injection (SQLi) e suas respectivas mitigações. O foco é fornecer uma ferramenta visual e prática para apresentações universitárias e workshops de segurança cibernética.

---

## 🚀 Sobre o Projeto

A aplicação simula um painel de administração onde o usuário pode alternar entre dois estados críticos de segurança:

1.  **Modo Vulnerável (Vermelho):** O backend utiliza concatenação direta de strings para montar queries SQL. Isso permite que entradas maliciosas manipulem a lógica do banco de dados.
2.  **Modo Protegido (Verde):** O backend utiliza **Queries Parametrizadas (Prepared Statements)**. Neste modo, o banco de dados trata toda entrada do usuário estritamente como dado/texto, neutralizando qualquer tentativa de injeção de comandos.

---

## 🛠️ Tecnologias Utilizadas

-   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS 4.0 (Estilização), Framer Motion (Animações).
-   **Backend:** Node.js, Express, TypeScript, `pg` (Driver PostgreSQL).
-   **Banco de Dados:** Supabase (PostgreSQL).
-   **Iconografia:** Lucide React.

---

## 📂 Estrutura do Código

### 1. Backend (`/backend`)
-   `src/server.ts`: Contém as rotas da API. Cada rota possui um `if (isVulnerable)` que altera a forma como a query é enviada ao banco.
-   `src/db.ts`: Gerencia a conexão com o banco de dados usando um Pool de conexões.
-   `src/init-db.ts`: Script utilitário para resetar o banco e criar usuários de teste.

### 2. Frontend (`/frontend`)
-   `src/context/SecurityContext.tsx`: Gerencia o estado global (Vulnerável vs Protegido) e armazena os logs e as últimas queries executadas.
-   `src/components/LoginBox.tsx`: Interface interativa para testar os ataques de bypass de login.
-   `src/components/Sidebar.tsx`: "Base de Conhecimento" com 8 cards interativos explicando cada tipo de ataque.
-   `src/components/SqlQueryViewer.tsx`: Monitor em tempo real que exibe a query exata processada pelo servidor.

---

## 🧪 Guia de Demonstração (Demos)

### Demo 1: Bypass de Login
-   **Objetivo:** Logar sem saber a senha.
-   **Ação:** No Modo Vulnerável, use o email `' OR 1=1 --`.
-   **Explicação:** O `'` fecha a string, `OR 1=1` torna a condição verdadeira e `--` ignora o resto da query original.

### Demo 2: Enumeração de Usuários
-   **Objetivo:** Descobrir emails válidos no sistema.
-   **Ação:** Teste um email que não existe vs. um email real com senha errada.
-   **Explicação:** Observe como as mensagens de erro mudam no modo vulnerável, revelando a existência do usuário.

### Demo 3: Injeção Baseada em Tempo (Time-Based)
-   **Objetivo:** Confirmar vulnerabilidade através do tempo de resposta.
-   **Ação:** Use o payload `' AND pg_sleep(5) --`.
-   **Explicação:** O servidor demorará 5 segundos para responder, provando que o comando foi executado pelo banco.

---

## ⚙️ Instalação e Execução

### 1. Requisitos
- Node.js instalado (v18 ou superior).
- Uma conta no Supabase (ou qualquer PostgreSQL).

### 2. Configuração do Banco
1. No Supabase, execute o script em `supabase/schema.sql`.

### 3. Configuração do Backend
1. Entre na pasta `backend`: `cd backend`
2. Instale: `npm install`
3. Crie um arquivo `.env` com suas credenciais (veja `.env.example`).
4. Inicie: `npm run dev`

### 4. Configuração do Frontend
1. Entre na pasta `frontend`: `cd frontend`
2. Instale: `npm install`
3. Inicie: `npm run dev`
4. Acesse: `http://localhost:5173`

---

## ⚠️ Aviso Legal
Este projeto possui vulnerabilidades **intencionais**. Ele deve ser usado **estritamente para fins educacionais**. Nunca utilize estas técnicas em sistemas reais sem autorização explícita.
