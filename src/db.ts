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

  await pool.query(`
    CREATE TABLE IF NOT EXISTS shops (
      shop TEXT PRIMARY KEY,
      access_token TEXT NOT NULL
    )
  `);
}

export async function saveShopToken(shop: string, accessToken: string) {
  await pool.query(
    `INSERT INTO shops (shop, access_token)
     VALUES ($1, $2)
     ON CONFLICT (shop)
     DO UPDATE SET access_token = EXCLUDED.access_token`,
    [shop, accessToken]
  );
}

export async function getShopToken(shop: string): Promise<string | null> {
  const result = await pool.query('SELECT access_token FROM shops WHERE shop = $1', [shop]);
  return result.rows[0]?.access_token || null;
}

export default pool;
