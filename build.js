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
  fs.writeFileSync(distIndex, '<!DOCTYPE html><html><head><title>wagmecoin</title></head><body><h1>wagmecoin</h1></body></html>');
}

// Copy public directory assets to dist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
  console.log('Copied public assets to dist/');
}

// Copy app.js entrypoint to dist so Vercel's Express preset finds it
const rootApp = path.join(__dirname, 'app.js');
const distApp = path.join(distDir, 'app.js');
if (fs.existsSync(rootApp)) {
  fs.copyFileSync(rootApp, distApp);
  // Also provide app.mjs as an additional alias
  fs.copyFileSync(rootApp, path.join(distDir, 'app.mjs'));
  console.log('Copied app.js to dist/app.js and dist/app.mjs');
}

// Copy package.json to dist for ESM module resolution
const rootPkg = path.join(__dirname, 'package.json');
const distPkg = path.join(distDir, 'package.json');
if (fs.existsSync(rootPkg)) {
  fs.copyFileSync(rootPkg, distPkg);
  console.log('Copied package.json to dist/package.json');
}

console.log('Build completed successfully.');
