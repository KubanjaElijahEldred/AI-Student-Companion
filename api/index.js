const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');

module.exports = async (req, res) => {
  const url = req.url || '/';
  const method = (req.method || 'GET').toUpperCase();
  const parsedUrl = new URL(url, `http://localhost`);
  const pathname = parsedUrl.pathname;

  // ========================================================================
  // REST API: POST /api/message — send a chat message (WebSocket fallback)
  // ========================================================================
  if (pathname === '/api/message' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {};
        const userMessage = data.message || '';
        const messageId = data.messageId || Date.now().toString();

        // Simple echo AI response (replace with real AI integration if needed)
        const aiResponse = userMessage
          ? `I received your message: "${userMessage}". (AI response via Vercel serverless fallback)`
          : 'Hello! How can I help you today?';

        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end(JSON.stringify({
          type: 'response',
          messageId,
          content: aiResponse,
          inResponseTo: messageId,
        }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
    return;
  }

  // ========================================================================
  // REST API: POST /api/upload — image upload (WebSocket fallback)
  // ========================================================================
  if (pathname === '/api/upload' && method === 'POST') {
    // Multipart upload not fully supported in minimal serverless; return guidance
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({
      error: 'Image upload via WebSocket is not supported on Vercel serverless. Use text chat instead.',
      filePath: null,
    }));
    return;
  }

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // ========================================================================
  // Serve static assets
  // ========================================================================
  const staticPaths = [
    path.join(ROOT, 'frontend', pathname),
    path.join(ROOT, pathname),
  ];

  for (const filePath of staticPaths) {
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const stat = fs.statSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mime = {
          '.html': 'text/html; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.js': 'application/javascript; charset=utf-8',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.ico': 'image/x-icon',
          '.svg': 'image/svg+xml',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.ttf': 'font/ttf',
          '.eot': 'application/vnd.ms-fontobject',
          '.map': 'application/json',
        }[ext] || 'application/octet-stream';

        res.writeHead(200, {
          'Content-Type': mime,
          'Content-Length': stat.size,
          'Cache-Control': 'public, max-age=3600',
        });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    } catch (e) {
      // continue to next path
    }
  }

  // ========================================================================
  // SPA fallback: serve frontend/index.html for all other routes
  // ========================================================================
  const indexPath = path.join(ROOT, 'frontend', 'index.html');
  try {
    const stat = fs.statSync(indexPath);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=3600',
    });
    fs.createReadStream(indexPath).pipe(res);
  } catch (e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};
