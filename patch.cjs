const fs = require('fs');
let code = fs.readFileSync('src/db.ts', 'utf8');

const prefix = `import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: any;
export const usePostgres = !!process.env.POSTGRES_URL;

if (usePostgres) {
  console.log('Using PostgreSQL Database...');
  const pgPool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool = {
    query: async (sql: string, params: any[] = []) => {
      let pgSql = sql;
      let pCount = 1;
      let inString = false;
      let outSql = '';
      for (let i = 0; i < pgSql.length; i++) {
        if (pgSql[i] === "'") inString = !inString;
        if (pgSql[i] === '?' && !inString) {
          outSql += \`$\${pCount++}\`;
        } else {
          outSql += pgSql[i];
        }
      }
      pgSql = outSql;

      // Handle SQLite specific stuff
      pgSql = pgSql.replace(/\`([a-zA-Z0-9_]+)\`/g, '"$1"'); // \`table\` to "table"

      try {
        const result = await pgPool.query(pgSql, params);
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
           return [result.rows, null];
        } else {
           return [{
              insertId: result.rows && result.rows.length ? result.rows[0].id : null,
              affectedRows: result.rowCount
           }, null];
        }
      } catch (err) {
         console.error('PostgreSQL Error:', err);
         console.error('Query:', pgSql);
         throw err;
      }
    },
    execute: async (sql: string, params: any[] = []) => {
      return pool.query(sql, params);
    },
    getConnection: async () => {
      const client = await pgPool.connect();
      return {
        query: async (sql: string, params: any[] = []) => {
          let pgSql = sql;
          let pCount = 1;
          let inString = false;
          let outSql = '';
          for (let i = 0; i < pgSql.length; i++) {
            if (pgSql[i] === "'") inString = !inString;
            if (pgSql[i] === '?' && !inString) {
              outSql += \`$\${pCount++}\`;
            } else {
              outSql += pgSql[i];
            }
          }
           pgSql = outSql.replace(/\`([a-zA-Z0-9_]+)\`/g, '"$1"');
           const result = await client.query(pgSql, params);
           if (sql.trim().toUpperCase().startsWith('SELECT')) {
             return [result.rows, null];
           } else {
             return [{ insertId: result.rows && result.rows.length ? result.rows[0].id : null, affectedRows: result.rowCount }, null];
           }
        },
        release: () => client.release()
      };
    }
  };
} else {
  console.log('Using SQLite Database as fallback...');
`;

code = code.replace(/import path from 'path';\n/g, '');
code = code.replace(/import fs from 'fs';\n/g, '');

// Change the `export default pool` with the closing block
code = code.replace('export default pool;', '}\nexport default pool;');

// Change the `const pool =` inside sqlite to `pool =`
code = code.replace('const pool = {', 'pool = {');
code = code.replace('const db ', 'let db ');

// Dynamically require so Vercel edge doesn't break
code = code.replace("import Database from 'better-sqlite3';", "const Database = typeof process !== 'undefined' && process.env.POSTGRES_URL ? null : require('better-sqlite3');");

fs.writeFileSync('src/db.ts', prefix + code);
