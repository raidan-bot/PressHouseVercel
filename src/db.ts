import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

dotenv.config();

let pool: any;
export const usePostgres = !!process.env.POSTGRES_URL;

const initDbSchema = async (dbPool: any, isPostgres: boolean) => {
  const schemaPath = path.join(process.cwd(), 'schema.sql');
  if (!fs.existsSync(schemaPath)) return;

  let schema = fs.readFileSync(schemaPath, 'utf8');
  console.log(`Initializing database schema (${isPostgres ? 'PostgreSQL' : 'SQLite'}). Original schema length:`, schema.length);

  if (!isPostgres) {
    // SQLite adjustments
    schema = schema.replace(/id INT AUTO_INCREMENT PRIMARY KEY/gi, 'id INTEGER PRIMARY KEY AUTOINCREMENT');
    schema = schema.replace(/id INTEGER AUTO_INCREMENT PRIMARY KEY/gi, 'id INTEGER PRIMARY KEY AUTOINCREMENT');
    schema = schema.replace(/\sJSON/gi, ' TEXT');
    schema = schema.replace(/\sENUM\([^)]+\)/gi, ' TEXT');
    schema = schema.replace(/\sVARCHAR\(\d+\)/gi, ' TEXT');
    schema = schema.replace(/\sDECIMAL\(\d+,\s*\d+\)/gi, ' REAL');
    schema = schema.replace(/\sINT([\s,])/gi, ' INTEGER$1');
    schema = schema.replace(/DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'DATETIME DEFAULT CURRENT_TIMESTAMP');
    schema = schema.replace(/CREATE TABLE/gi, 'CREATE TABLE IF NOT EXISTS');
    schema = schema.replace(/CREATE TABLE IF NOT EXISTS IF NOT EXISTS/gi, 'CREATE TABLE IF NOT EXISTS');
    schema = schema.replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
    schema = schema.replace(/UNIQUE KEY /gi, 'UNIQUE ');
  } else {
    // PostgreSQL adjustments
    schema = schema.replace(/id\s+INT\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'id SERIAL PRIMARY KEY');
    schema = schema.replace(/id\s+INTEGER\s+AUTO_INCREMENT\s+PRIMARY\s+KEY/gi, 'id SERIAL PRIMARY KEY');
    schema = schema.replace(/id\s+INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi, 'id SERIAL PRIMARY KEY');
    schema = schema.replace(/INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
    schema = schema.replace(/DATETIME\s+DEFAULT\s+CURRENT_TIMESTAMP\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP/gi, 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    schema = schema.replace(/DATETIME/gi, 'TIMESTAMP');
    // PG uses VARCHAR instead of ENUM inline if not created as a type, so let's simplify ENUMs to VARCHAR for PG to avoid complex type creation in simple scripts
    schema = schema.replace(/\s+ENUM\([^)]+\)/gi, ' VARCHAR(255)');
    schema = schema.replace(/CREATE\s+TABLE/gi, 'CREATE TABLE IF NOT EXISTS');
    schema = schema.replace(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+IF\s+NOT\s+EXISTS/gi, 'CREATE TABLE IF NOT EXISTS');
    schema = schema.replace(/UNIQUE\s+KEY\s+/gi, 'UNIQUE ');
    // Replace MySQL/SQLite backticks with standard SQL double quotes
    schema = schema.replace(/`/g, '"');
  }

  const statements = schema
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      if (isPostgres) {
        await dbPool.execute(statement);
      } else {
        dbPool.exec(statement); // SQLite raw db object
      }
      successCount++;
    } catch (stmtError: any) {
      errorCount++;
      if (!stmtError.message.includes('already exists') && !stmtError.message.includes('duplicate')) {
        console.error(`Statement execution error:`, statement, stmtError.message);
      }
    }
  }
  console.log(`Database schema initialization complete. ${successCount} successful, ${errorCount} errors skipped.`);
};

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
          outSql += `$${pCount++}`;
        } else {
          outSql += pgSql[i];
        }
      }
      pgSql = outSql.replace(/`([a-zA-Z0-9_]+)`/g, '"$1"');

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
      return pgPool.query(sql, params);
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
              outSql += `$${pCount++}`;
            } else {
              outSql += pgSql[i];
            }
          }
           pgSql = outSql.replace(/`([a-zA-Z0-9_]+)`/g, '"$1"');
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

  // Run schema initialization for Postgres on boot
  initDbSchema(pool, true).catch(err => console.error('PG init schema error:', err));
  
} else {
  console.log('Using SQLite Database as fallback...');
  let Database: any = null;
  try {
    Database = require('better-sqlite3');
  } catch (e) {
    console.warn('better-sqlite3 not available. DB fallback failed. Are you on Vercel without POSTGRES_URL?');
  }

  if (Database) {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    let db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    pool = {
      query: async (sql: string, params: any[] = []) => {
        try {
          const trimmedSql = sql.trim().toUpperCase();
          if (trimmedSql.startsWith('SELECT')) {
            const stmt = db.prepare(sql);
            const rows = stmt.all(...params);
            return [rows, null];
          } else {
            const stmt = db.prepare(sql);
            const result = stmt.run(...params);
            return [{
              insertId: result.lastInsertRowid,
              affectedRows: result.changes
            }, null];
          }
        } catch (error) {
          console.error('Database Error:', error);
          throw error;
        }
      },
      execute: async (sql: string, params: any[] = []) => {
        return pool.query(sql, params);
      },
      getConnection: async () => {
        return {
          query: pool.query,
          release: () => {}
        };
      }
    };

    initDbSchema(db, false);
    
    // Run SQLite dynamic migrations
    const runSqliteMigrations = () => {
      try { db.exec("ALTER TABLE violations ADD COLUMN latitude REAL;"); } catch (e) {}
      try { db.exec("ALTER TABLE violations ADD COLUMN longitude REAL;"); } catch (e) {}
      try { db.exec("ALTER TABLE projects ADD COLUMN isFeatured INTEGER DEFAULT 0;"); } catch (e) {}
      try { db.exec("ALTER TABLE articles ADD COLUMN subcategory TEXT;"); } catch (e) {}
      
      const tables = ['articles', 'jobs', 'courses', 'projects', 'events'];
      tables.forEach(table => {
        try { db.exec(`ALTER TABLE ${table} ADD COLUMN show_in_slider INTEGER DEFAULT 0;`); } catch(e) {}
        try { db.exec(`ALTER TABLE ${table} ADD COLUMN slider_caption TEXT;`); } catch(e) {}
        try { db.exec(`ALTER TABLE ${table} ADD COLUMN slider_button_text TEXT;`); } catch(e) {}
        try { db.exec(`ALTER TABLE ${table} ADD COLUMN slider_image TEXT;`); } catch(e) {}
      });

      // Clear existing demo data for events, tenders, and jobs as requested by user
      try { db.exec("DELETE FROM events;"); } catch (e) {}
      try { db.exec("DELETE FROM tenders;"); } catch (e) {}
      try { db.exec("DELETE FROM jobs;"); } catch (e) {}
    };
    runSqliteMigrations();
  } else {
    // Mock pool for Vercel build process to not crash if POSTGRES_URL is missing during build
    pool = {
      query: async () => [[], null],
      execute: async () => [],
      getConnection: async () => ({ query: async () => [[], null], release: () => {} })
    };
  }
}

// PostgreSQL Dynamic Schema initialization helper (if active)
if (usePostgres) {
  pool.query(`
    CREATE TABLE IF NOT EXISTS "api_tokens" (
      "id" SERIAL PRIMARY KEY,
      "token" VARCHAR(255) UNIQUE NOT NULL,
      "name" VARCHAR(255) NOT NULL,
      "role" VARCHAR(50) DEFAULT 'admin',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `).catch((e: any) => console.error('PG api_tokens migration error:', e.message));

  const addPgCol = async (col: string, type: string) => {
    try {
      await pool.query(`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "${col}" ${type};`);
    } catch(e: any) {}
  };
  try {
    pool.query('ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "subcategory" VARCHAR(255);');
  } catch(e) {}
  addPgCol('s3Provider', 'VARCHAR(255)');
  addPgCol('s3AccessKeyId', 'TEXT');
  addPgCol('s3SecretAccessKey', 'TEXT');
  addPgCol('s3Region', 'VARCHAR(50)');
  addPgCol('s3Bucket', 'VARCHAR(255)');
  addPgCol('s3Endpoint', 'TEXT');
  addPgCol('s3Enabled', 'INTEGER DEFAULT 0');
}

export default pool;
