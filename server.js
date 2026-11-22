const fs = require('fs');
const path = require('path');
const express = require('express');

const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_HTML_PATH = path.join(PUBLIC_DIR, 'index.html');

const PLACEHOLDER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BaitCheck — Scam Survival Drill (Simulated)</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #161616; color: #F2EFE7; }
    .ribbon { background: #FEC917; color: #0D0D0D; font-weight: 800; padding: 10px 16px; font-size: 13px; letter-spacing: 0.04em; text-align: center; }
    main { max-width: 560px; margin: 32px auto; padding: 0 16px; }
    .card { border: 2px solid #F2EFE7; padding: 20px; background: #0D0D0D; }
  </style>
</head>
<body>
  <div class="ribbon">SIMULATION • EDUCATIONAL SCAM DRILL — NO REAL DATA, OTPs, OR DOWNLOADS</div>
  <main>
    <div class="card">
      <h1>BaitCheck</h1>
      <p>Frontend shell pending initialization in <code>public/index.html</code>.</p>
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
 * @returns {import('express').Express}
 */
function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));
  app.use(express.static(PUBLIC_DIR));

  app.get('/health', (_req, res) => {
    res.status(200).json({
      ok: true,
      memoryMb: Number((process.memoryUsage().rss / 1024 / 1024).toFixed(2)),
      uptime: Math.round(process.uptime())
    });
  });

  app.get('/c/:id', serveAppShell);
  app.get('/c/:id/report', serveAppShell);
  app.get('/', serveAppShell);

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  app.listen(port, '0.0.0.0', () => {
    console.log(`BaitCheck server listening on 0.0.0.0:${port}`);
  });
}

module.exports = { createApp };
