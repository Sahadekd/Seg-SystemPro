import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- 1. LOGIN BYPASS & ENUMERATION ---
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password, isVulnerable } = req.body;
  let sql = '';
  let result;

  try {
    if (isVulnerable) {
      // VULNERÁVEL: Concatenação direta de string
      sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
      result = await query(sql);
    } else {
      // PROTEGIDO: Query parametrizada
      sql = `SELECT * FROM users WHERE email = $1 AND password = $2`;
      result = await query(sql, [email, password]);
    }

    if (result.rows.length > 0) {
      res.json({
        success: true,
        user: result.rows[0],
        query: sql,
        mode: isVulnerable ? 'VULNERÁVEL' : 'PROTEGIDO'
      });
    } else {
      // DEMONSTRAÇÃO DE ENUMERAÇÃO DE USUÁRIOS
      if (isVulnerable) {
        const checkUserSql = `SELECT * FROM users WHERE email = '${email}'`;
        const userExists = await query(checkUserSql);
        
        if (userExists.rows.length > 0) {
          res.status(401).json({
            success: false,
            message: 'Senha incorreta',
            query: sql,
            mode: 'VULNERÁVEL'
          });
        } else {
          res.status(401).json({
            success: false,
            message: 'Usuário não encontrado',
            query: sql,
            mode: 'VULNERÁVEL'
          });
        }
      } else {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas',
          query: sql,
          mode: 'PROTEGIDO'
        });
      }
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: isVulnerable ? error.message : 'Erro Interno do Servidor',
      query: sql,
      mode: isVulnerable ? 'VULNERÁVEL' : 'PROTEGIDO',
      error: isVulnerable ? error : undefined
    });
  }
});

// --- 2. UNION SELECT & ERROR-BASED ---
app.get('/api/users/search', async (req: Request, res: Response) => {
  const { name, isVulnerable } = req.query;
  let sql = '';
  
  try {
    if (isVulnerable === 'true') {
      sql = `SELECT name, email, role FROM users WHERE name LIKE '%${name}%'`;
      const result = await query(sql);
      res.json({ success: true, data: result.rows, query: sql });
    } else {
      sql = `SELECT name, email, role FROM users WHERE name LIKE $1`;
      const result = await query(sql, [`%${name}%`]);
      res.json({ success: true, data: result.rows, query: sql });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: isVulnerable === 'true' ? error.message : 'Erro Interno do Servidor',
      query: sql,
      mode: isVulnerable === 'true' ? 'VULNERÁVEL' : 'PROTEGIDO',
      error: isVulnerable === 'true' ? error : undefined
    });
  }
});

// --- 3. BLIND & TIME-BASED ---
app.get('/api/check-email', async (req: Request, res: Response) => {
  const { email, isVulnerable } = req.query;
  let sql = '';
  
  try {
    if (isVulnerable === 'true') {
      sql = `SELECT email FROM users WHERE email = '${email}'`;
      const startTime = Date.now();
      const result = await query(sql);
      const duration = Date.now() - startTime;

      res.json({ 
        success: result.rows.length > 0, 
        query: sql,
        duration 
      });
    } else {
      sql = `SELECT email FROM users WHERE email = $1`;
      const result = await query(sql, [email]);
      res.json({ success: result.rows.length > 0, query: sql });
    }
  } catch (error: any) {
    res.status(500).json({
        success: false,
        message: isVulnerable === 'true' ? error.message : 'Erro Interno do Servidor',
        query: sql
    });
  }
});

// --- 4. BYPASS DE AUTORIZAÇÃO ---
app.get('/api/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isVulnerable } = req.query;
  let sql = '';

  try {
    if (isVulnerable === 'true') {
      sql = `SELECT * FROM users WHERE id = '${id}'`;
      const result = await query(sql);
      res.json({ success: true, data: result.rows[0], query: sql });
    } else {
      sql = `SELECT id, name, email, role FROM users WHERE id = $1`;
      const result = await query(sql, [id]);
      res.json({ success: true, data: result.rows[0], query: sql });
    }
  } catch (error: any) {
    res.status(500).json({
        success: false,
        message: isVulnerable === 'true' ? error.message : 'Erro Interno do Servidor',
        query: sql
    });
  }
});

// --- 5. SIMULAÇÃO DE DROP TABLE ---
app.post('/api/simulate-drop', async (req: Request, res: Response) => {
    const { isVulnerable, payload } = req.body;
    
    if (isVulnerable) {
        res.json({
            success: true,
            message: "SIMULADO: A tabela 'users' teria sido deletada!",
            query: `DROP TABLE users; -- ${payload}`,
            impact: "CRÍTICO: Perda total de dados e interrupção do serviço."
        });
    } else {
        res.json({
            success: false,
            message: "PROTEGIDO: Comando DROP TABLE bloqueado pela query parametrizada.",
            query: "SELECT * FROM users WHERE email = $1",
            mitigation: "A entrada foi tratada como texto puro, não como comando SQL."
        });
    }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
