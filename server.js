'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const { initDb } = require('./src/db');
const { uploadVerdictBadge } = require('./src/storage');
const { createSystemRouter } = require('./src/routes/system');
const { createForensicRouter } = require('./src/routes/forensic');
const { createChallengesRouter } = require('./src/routes/challenges');

const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_HTML_PATH = path.join(PUBLIC_DIR, 'index.html');

const PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BaitCheck - Scam Survival Drill (Simulated)</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #161616; color: #F2EFE7; }
    .ribbon { background: #FEC917; color: #0D0D0D; font-weight: 800; padding: 10px 16px; font-size: 13px; letter-spacing: 0.04em; text-align: center; }
    main { max-width: 560px; margin: 32px auto; padding: 0 16px; }
    .card { border: 2px solid #F2EFE7; padding: 20px; background: #0D0D0D; }
  </style>
</head>
<body>
  <div class="ribbon">SIMULATION • EDUCATIONAL SCAM DRILL - NO REAL DATA, OTPs, OR DOWNLOADS</div>
  <main>
    <div class="card">
      <h1>BaitCheck</h1>
      <p>Frontend shell pending initialization in <code>public/index.html</code>.</p>
    </div>
  </main>
</body>
</html>`;

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>404 Not Found - BaitCheck (Simulated)</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #161616; color: #F2EFE7; }
    .ribbon { background: #FEC917; color: #0D0D0D; font-weight: 800; padding: 10px 16px; font-size: 13px; letter-spacing: 0.04em; text-align: center; }
    main { max-width: 560px; margin: 32px auto; padding: 0 16px; }
    .card { border: 2px solid #F2EFE7; padding: 24px; background: #0D0D0D; }
    h1 { margin: 0 0 12px; font-size: 28px; }
    p { margin: 0 0 20px; line-height: 1.5; }
    a.home-link { display: inline-block; background: #FEC917; color: #0D0D0D; font-weight: 800; text-decoration: none; padding: 12px 18px; border: 2px solid #F2EFE7; }
  </style>
</head>
<body>
  <div class="ribbon">SIMULATION • EDUCATIONAL SCAM DRILL - NO REAL DATA, OTPs, OR DOWNLOADS</div>
  <main>
    <div class="card">
      <h1>404 - Page Not Found</h1>
      <p>The page you requested could not be found.</p>
      <a class="home-link" href="/">Back to BaitCheck Home</a>
    </div>
  </main>
</body>
</html>`;

/**
 * Serves public/index.html when present, otherwise returns a safe SIMULATION placeholder page.
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
function serveAppShell(_req, res) {
  if (fs.existsSync(INDEX_HTML_PATH)) {
    return res.sendFile(INDEX_HTML_PATH);
  }
  return res.status(200).type('html').send(PLACEHOLDER_HTML);
}

/**
 * Builds and configures the Express application without binding a network port.
 * @param {{ dbPath?: string, uploader?: (params: { filename: string, pngBuffer: Buffer }) => Promise<object> }} [options]
 * @returns {import('express').Express}
 */
function createApp(options = {}) {
  const app = express();
  const db = initDb(options.dbPath);
  const uploader = typeof options.uploader === 'function' ? options.uploader : uploadVerdictBadge;
  const defaultJsonParser = express.json({ limit: '32kb' });
  const badgeJsonParser = express.json({ limit: '2mb' });

  app.locals.db = db;
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    if (req.path === '/api/badge') {
      return badgeJsonParser(req, res, next);
    }
    return defaultJsonParser(req, res, next);
  });
  app.use(express.static(PUBLIC_DIR));

  app.use(createSystemRouter({ db }));
  app.use(createForensicRouter({ db, uploader }));
  app.use(createChallengesRouter({ db }));

  app.get('/c/:id', serveAppShell);
  app.get('/c/:id/report', serveAppShell);
  app.get('/', serveAppShell);

  app.use((req, res) => {
    if (req.path === '/api' || req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (req.method === 'GET' || req.method === 'HEAD') {
      return res.status(404).type('html').send(NOT_FOUND_HTML);
    }
    return res.status(404).json({ error: 'Not found' });
  });

  app.use((err, _req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
    if (err && err.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Payload too large' });
    }
    return next(err);
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`BaitCheck server listening on 0.0.0.0:${port}`);
  });

  const shutdown = () => {
    server.close(() => {
      app.locals.db.close();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = { createApp };
