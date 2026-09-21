import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Determine potential directories containing static assets
const candidateDirs = [
  __dirname,
  path.join(__dirname, 'public'),
  path.join(__dirname, 'dist'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), 'public'),
  process.cwd()
];

// Serve static assets from all valid directories
for (const dir of candidateDirs) {
  if (fs.existsSync(dir)) {
    app.use(express.static(dir));
  }
}

// Fallback to index.html for all routes (SPA behavior)
app.get('*', (req, res) => {
  const possibleIndexFiles = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'dist', 'index.html'),
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html')
  ];

  for (const indexPath of possibleIndexFiles) {
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }

  res.status(200).send('<!DOCTYPE html><html><head><title>wagmecoin</title></head><body><h1>wagmecoin</h1></body></html>');
});

const PORT = process.env.PORT || 3000;

// Start server when executed directly and not inside Vercel Serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

export default app;
export { app };
