const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// replace multer disk storage with memory storage so it doesn't break vercel edge, and upload inside the route handler
code = code.replace(/const storage = multer\.diskStorage\(\{[\s\S]*?\}\);[\s\S]*?const upload = multer\(\{ storage: storage \}\);/m, 
`import { put, del } from '@vercel/blob';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
`);

// update /api/upload
code = code.replace(/app\.post\('\/api\/upload', upload\.single\('file'\), async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ message: 'Error uploading file' \}\);\n  \}\n\}\);/m, 
`app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    let folder = 'others';
    if (req.file.mimetype.startsWith('image/')) folder = 'images';
    else if (req.file.mimetype.startsWith('video/')) folder = 'videos';
    else if (req.file.mimetype.startsWith('audio/')) folder = 'audio';
    else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document') || req.file.mimetype.includes('word')) folder = 'documents';
    
    let url = '';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(req.file.originalname);
    
    // Upload to Vercel Blob if available
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.WRITE_TOKEN) {
      try {
        const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.WRITE_TOKEN;
        const blob = await put(\`\${folder}/\${filename}\`, req.file.buffer, {
           access: 'public',
           token: token
        });
        url = blob.url;
      } catch (err) {
        console.error('Vercel Blob Upload failed:', err);
        return res.status(500).json({ message: 'Vercel Blob failed', error: err });
      }
    } else {
      // Fallback: Local filesystem
      const uploadDir = path.join(process.cwd(), 'uploads');
      const targetDir = path.join(uploadDir, folder);
      if (!fs.existsSync(targetDir)) {
         fs.mkdirSync(targetDir, { recursive: true });
      }
      const filePath = path.join(targetDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      url = \`/uploads/\${folder}/\${filename}\`;
    }
    
    // Save to media library table
    const [result] = await pool.query(
      'INSERT INTO media (name, url, type, size, uploadedBy) VALUES (?, ?, ?, ?, ?)',
      [req.file.originalname, url, req.file.mimetype, req.file.size, req.body.uploadedBy || 'admin']
    );

    res.json({ id: (result as any).insertId || Date.now(), name: req.file.originalname, url, type: req.file.mimetype, size: req.file.size });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});`);

// Update delete API
code = code.replace(/app\.delete\('\/api\/media\/:id', async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ message: 'Error deleting media' \}\);\n  \}\n\}\);/m,
`app.delete('/api/media/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT url FROM media WHERE id = ?', [req.params.id]);
    const media = (rows as any)[0];
    if (media) {
      if (media.url.includes('blob.vercel-storage.com')) {
         if (process.env.BLOB_READ_WRITE_TOKEN || process.env.WRITE_TOKEN) {
            try {
              await del(media.url, { token: process.env.BLOB_READ_WRITE_TOKEN || process.env.WRITE_TOKEN });
            } catch(e) { console.error('Blob delete failed', e); }
         }
      } else {
         const filePath = path.join(process.cwd(), media.url.startsWith('/') ? media.url.substring(1) : media.url);
         if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
         }
      }
      await pool.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Media Error', error);
    res.status(500).json({ message: 'Error deleting media' });
  }
});`);

fs.writeFileSync('server.ts', code);
