const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url.endsWith('/')) url += 'index.html';

  const file = path.join(ROOT, decodeURIComponent(url));

  // Security: no path traversal
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>404</h1><p>' + url + ' nicht gefunden</p>');
    }
    const ext = path.extname(file);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n  🧩 Widget Hub läuft auf:\n`);
  console.log(`  → http://localhost:${PORT}/\n`);
  console.log(`  Widgets:`);
  console.log(`  → http://localhost:${PORT}/clock/`);
  console.log(`  → http://localhost:${PORT}/countdown/`);
  console.log(`  → http://localhost:${PORT}/calendar/`);
  console.log(`  → http://localhost:${PORT}/quote/`);
  console.log(`  → http://localhost:${PORT}/kpi/`);
  console.log(`  → http://localhost:${PORT}/ticker/`);
  console.log(`  → http://localhost:${PORT}/team-status/`);
  console.log(`  → http://localhost:${PORT}/menu/`);
  console.log(`  → http://localhost:${PORT}/menu/?config=menu-data.json`);
  console.log(`\n  Strg+C zum Beenden\n`);
});
