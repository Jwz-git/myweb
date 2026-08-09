import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pool } from './db.js'
const sql = await readFile(resolve(import.meta.dirname, '../migrations/001_initial.sql'), 'utf8')
await pool.query(sql)
await pool.end()
console.log('Database migration complete')
