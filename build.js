import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(distDir, { recursive: true });

// Copy index.html safely
const rootIndex = path.join(__dirname, 'index.html');
const distIndex = path.join(distDir, 'index.html');

if (fs.existsSync(rootIndex)) {
  fs.copyFileSync(rootIndex, distIndex);
  console.log('Copied index.html to dist/index.html');
} else if (!fs.existsSync(distIndex)) {
  console.warn('Warning: index.html not found, creating default entry');
  fs.writeFileSync(distIndex, '<!DOCTYPE html><html><head><title>WAGME</title></head><body><h1>WAGME</h1></body></html>');
}

// Copy public directory assets to dist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
  console.log('Copied public assets to dist/');
}

console.log('Build completed successfully.');
