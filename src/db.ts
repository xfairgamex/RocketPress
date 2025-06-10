import { Pool } from 'pg';

let pool: Pool;

if (process.env.NODE_ENV === 'test') {
  const { newDb } = require('pg-mem');
  const mem = newDb();
  const { Pool: MemPool } = mem.adapters.createPg();
  pool = new MemPool();
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT PRIMARY KEY,
      data JSONB NOT NULL,
      fulfillment_status TEXT
    )
  `);
}

export default pool;
