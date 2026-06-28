import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const fixDb = async () => {
  try {
    console.log('Fixing database schema...');
    
    // Create/Ensure indicators table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS indicators (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        current_value VARCHAR(255) NOT NULL,
        target_value VARCHAR(255),
        unit VARCHAR(50),
        icon VARCHAR(255),
        project_id VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      ALTER TABLE indicators ADD COLUMN IF NOT EXISTS current_value VARCHAR(255);
      ALTER TABLE indicators ADD COLUMN IF NOT EXISTS target_value VARCHAR(255);
      ALTER TABLE indicators ADD COLUMN IF NOT EXISTS unit VARCHAR(50);
    `);
    console.log('Ensured indicators table exists with correct columns');

    // Ensure projects has beneficiaries_count and beneficiaries_direct
    await pool.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiaries_count INTEGER DEFAULT 0;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS beneficiaries_direct INTEGER DEFAULT 0;
    `);
    console.log('Ensured projects has beneficiaries_count and beneficiaries_direct');

    // Rename order to order_idx if it exists as order
    await pool.query(`
      ALTER TABLE menus RENAME COLUMN "order" TO order_idx;
    `).catch(() => console.log('Menus order already renamed or not exists'));
    await pool.query(`
      ALTER TABLE hero_slides RENAME COLUMN "order" TO order_idx;
    `).catch(() => console.log('Hero slides order already renamed or not exists'));
    console.log('Renamed order columns to order_idx');

    // Ensure hero_slides exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hero_slides (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        description TEXT NOT NULL,
        mediaType VARCHAR(50) NOT NULL,
        mediaUrl TEXT NOT NULL,
        animationType VARCHAR(50) NOT NULL,
        textAnimation VARCHAR(50) DEFAULT 'slide-up',
        titleSize VARCHAR(50) DEFAULT 'text-4xl md:text-6xl lg:text-7xl',
        subtitleSize VARCHAR(50) DEFAULT 'text-xs',
        descriptionSize VARCHAR(50) DEFAULT 'text-lg md:text-xl',
        buttonSize VARCHAR(50) DEFAULT 'px-8 py-4',
        overlayOpacity INTEGER DEFAULT 60,
        textAlign VARCHAR(50) DEFAULT 'left',
        primaryButton TEXT,
        secondaryButton TEXT,
        order_idx INTEGER,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Ensured hero_slides exists');
    
    // Create menus table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        location VARCHAR(50) NOT NULL,
        title TEXT NOT NULL,
        icon VARCHAR(255),
        path VARCHAR(255) NOT NULL,
        order_idx INTEGER,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Ensured menus table exists');

    console.log('Database schema fix complete.');
  } catch (err) {
    console.error('Fix failed:', err);
  } finally {
    await pool.end();
  }
};

fixDb();
