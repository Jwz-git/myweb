import pg from 'pg'
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
export async function query<T extends pg.QueryResultRow>(text: string, values: unknown[] = []) { return pool.query<T>(text, values) }
