import express, { Request, Response } from 'express';
import pool from '../db';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM violation_potentials ORDER BY createdAt DESC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch violation potentials' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { victimName, type, description, date, governorate, media } = req.body;
  try {
    await pool.query(
      "INSERT INTO violation_potentials (victimName, type, description, date, governorate, media, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, 'pending', datetime('now'))",
      [victimName, type, description, date, governorate, JSON.stringify(media || [])]
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create violation potential' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query(
      "UPDATE violation_potentials SET status = ? WHERE id = ?",
      [status, id]
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update violation potential' });
  }
});

export default router;
