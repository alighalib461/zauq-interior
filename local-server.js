const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function serve404(res) {
  const custom404Path = path.join(PUBLIC_DIR, '404.html');
  if (fs.existsSync(custom404Path)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(custom404Path, 'utf8'));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0].split('#')[0];

  try {
    reqUrl = decodeURIComponent(reqUrl);
  } catch (e) {
    // Keep reqUrl
  }

  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  let cleanRelative = reqUrl.replace(/^[/\\]+/, '').replace(/^(\.\.[\/\\])+/, '');
  if (cleanRelative === '') {
    cleanRelative = 'index.html';
  }

  let filePath = path.resolve(PUBLIC_DIR, cleanRelative);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      const htmlCandidate = filePath + '.html';
      if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
        filePath = htmlCandidate;
      } else {
        const acceptsHtml = (req.headers.accept || '').includes('text/html');
        if (acceptsHtml && fs.existsSync(path.join(PUBLIC_DIR, 'index.html'))) {
          const hasExtension = path.extname(cleanRelative) !== '';
          if (hasExtension) {
            serve404(res);
            return;
          }
          filePath = path.join(PUBLIC_DIR, 'index.html');
        } else {
          serve404(res);
          return;
        }
      }
    } else if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath)) {
        serve404(res);
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error: ' + readErr.message);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    const localIp = getLocalIp();
    console.log(`=======================================================`);
    console.log(` ✨ BA ZAUQ INTERIORS LOCAL SERVER RUNNING ✨`);
    console.log(` 📂 Serving from: ${PUBLIC_DIR}`);
    console.log(` 🚀 Local:   http://localhost:${port}`);
    console.log(` 🌐 Network: http://${localIp}:${port}`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${port} is currently in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
