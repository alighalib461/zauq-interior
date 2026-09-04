const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DEFAULT_PORT = parseInt(process.env.PORT || '3000', 10);

// Determine the root directory where index.html is located
function findPublicDir() {
  const candidates = [
    __dirname,
    process.cwd(),
    path.join(process.cwd(), 'Zauq interior'),
    path.join(__dirname, '..', 'Zauq interior'),
    path.join(os.homedir(), 'Desktop', 'Zauq interior')
  ];

  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'index.html'))) {
      return dir;
    }
  }
  return __dirname;
}

const PUBLIC_DIR = path.resolve(findPublicDir());

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

function serve404(res, reqUrl) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Page Not Found | Ba Zauq Interiors</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f141c;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      text-align: center;
      padding: 24px;
    }
    .error-card {
      background: rgba(25, 33, 46, 0.85);
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 16px;
      padding: 48px 36px;
      max-width: 520px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #d4af37;
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.3);
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 56px;
      margin: 0 0 12px 0;
      color: #d4af37;
      font-weight: 700;
    }
    p {
      color: #94a3b8;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }
    .requested-url {
      background: rgba(0, 0, 0, 0.35);
      padding: 8px 14px;
      border-radius: 6px;
      font-family: monospace;
      color: #cbd5e1;
      display: inline-block;
      margin-bottom: 24px;
      word-break: break-all;
    }
    .btn-home {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #d4af37, #aa820a);
      color: #0b0f14;
      padding: 14px 28px;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 15px;
    }
    .btn-home:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35);
    }
  </style>
</head>
<body>
  <div class="error-card">
    <div class="badge">Ba Zauq Interiors</div>
    <h1>404</h1>
    <p>We couldn't find the page or file you were looking for.</p>
    <div class="requested-url">\${escapeHtml(reqUrl)}</div>
    <div>
      <a href="/" class="btn-home">Return to Home</a>
    </div>
  </div>
</body>
</html>`;
  res.end(html);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0].split('#')[0];

  try {
    reqUrl = decodeURIComponent(reqUrl);
  } catch (e) {
    // Keep reqUrl as-is if decoding fails
  }

  // Normalize root request
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  // Clean relative path and prevent directory traversal / Windows root drive escapes
  let cleanRelative = reqUrl.replace(/^[/\\]+/, '').replace(/^(\.\.[\/\\])+/, '');
  if (cleanRelative === '') {
    cleanRelative = 'index.html';
  }

  let filePath = path.resolve(PUBLIC_DIR, cleanRelative);

  // Security check: ensure path stays within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Check if file with .html exists (e.g. /about -> /about.html)
      const htmlCandidate = filePath + '.html';
      if (fs.existsSync(htmlCandidate) && fs.statSync(htmlCandidate).isFile()) {
        filePath = htmlCandidate;
      } else {
        // If request accepts HTML, fallback to index.html for SPA/hash routing or 404
        const acceptsHtml = (req.headers.accept || '').includes('text/html');
        if (acceptsHtml && reqUrl !== '/index.html' && fs.existsSync(path.join(PUBLIC_DIR, 'index.html'))) {
          // If user requested a non-existent asset (like .jpg/.css), show 404, else serve index.html or 404
          const hasExtension = path.extname(cleanRelative) !== '';
          if (hasExtension) {
            serve404(res, reqUrl);
            return;
          }
          filePath = path.join(PUBLIC_DIR, 'index.html');
        } else {
          serve404(res, reqUrl);
          return;
        }
      }
    } else if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath)) {
        serve404(res, reqUrl);
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
    console.log(` 📂 Serving from: \${PUBLIC_DIR}`);
    console.log(` 🚀 Local:   http://localhost:\${port}`);
    console.log(` 🌐 Network: http://\${localIp}:\${port}`);
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port \${port} is currently in use, trying \${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
