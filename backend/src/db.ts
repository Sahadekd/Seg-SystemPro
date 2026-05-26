import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    return {
      rows: res.rows,
      rowCount: res.rowCount,
      query: text,
      params,
      duration
    };
  } catch (err: any) {
    console.error('Database query error', err);
    throw {
        message: err.message,
        query: text,
        params
    };
  }
};

export default pool;
