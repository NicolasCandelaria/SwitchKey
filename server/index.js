/**
 * Small API server for Stripe, Escrow.com, and Projects.
 * Run: node server/index.js (or npm run server)
 * Requires .env with STRIPE_SECRET_KEY and/or ESCROW_EMAIL + ESCROW_API_KEY.
 */
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 3001;

// ----- Stripe -----
app.get('/api/stripe/balance', async (req, res) => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(503).json({ error: 'Stripe not configured', code: 'STRIPE_NOT_CONFIGURED' });
  }
  try {
    const stripe = (await import('stripe')).default;
    const s = new stripe(key);
    const balance = await s.balance.retrieve();
    const available = balance.available?.find((b) => b.currency === 'usd');
    const pending = balance.pending?.find((b) => b.currency === 'usd');
    res.json({
      available: (available?.amount ?? 0) / 100,
      pending: (pending?.amount ?? 0) / 100,
      currency: 'usd',
    });
  } catch (err) {
    console.error('Stripe balance error:', err.message);
    res.status(500).json({ error: err.message || 'Stripe request failed' });
  }
});

// ----- Escrow.com -----
const ESCROW_SANDBOX = 'https://api.escrow-sandbox.com/2017-09-01';
const ESCROW_LIVE = 'https://api.escrow.com/2017-09-01';

app.get('/api/escrow/transactions', async (req, res) => {
  const email = process.env.ESCROW_EMAIL;
  const apiKey = process.env.ESCROW_API_KEY;
  if (!email || !apiKey) {
    return res.status(503).json({ error: 'Escrow.com not configured', code: 'ESCROW_NOT_CONFIGURED' });
  }
  try {
    const base = process.env.ESCROW_SANDBOX === '1' ? ESCROW_SANDBOX : ESCROW_LIVE;
    const auth = Buffer.from(`${email}:${apiKey}`).toString('base64');
    const r = await fetch(`${base}/partner/transactions`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(text || `Escrow API ${r.status}`);
    }
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error('Escrow transactions error:', err.message);
    res.status(500).json({ error: err.message || 'Escrow request failed' });
  }
});

// ----- Projects (live MVP in-memory store) -----
function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const projectsStore = [];

app.get('/api/projects', (req, res) => {
  res.json(projectsStore);
});

app.get('/api/projects/:slug', (req, res) => {
  const project = projectsStore.find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const formData = req.body.formData || req.body;
  const options = req.body.options || {};
  const name = formData.projectName?.trim() || 'Project';
  const slug = slugify(name);
  const now = new Date().toISOString();
  const ownerInitials = options.ownerInitials != null ? options.ownerInitials : null;
  const participants = ownerInitials ? [ownerInitials] : [];
  const project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    slug,
    projectName: name,
    productDescription: formData.productDescription ?? '',
    primaryCategory: formData.primaryCategory ?? '',
    secondaryCategory: formData.secondaryCategory ?? '',
    productCategory: formData.productCategory ?? '',
    scenarioTags: Array.isArray(formData.scenarioTags) ? formData.scenarioTags : [],
    selectedPathways: Array.isArray(formData.selectedPathways) ? formData.selectedPathways : [],
    participants,
    createdAt: now,
    updatedAt: now,
  };
  projectsStore.unshift(project);
  res.status(201).json(project);
});

app.delete('/api/projects/:slug', (req, res) => {
  const idx = projectsStore.findIndex((p) => p.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });
  projectsStore.splice(idx, 1);
  res.status(204).send();
});

// Non-API routes: avoid 404 when opening http://localhost:3001 in browser
const distPath = path.join(__dirname, '..', 'dist');
const distExists = fs.existsSync(distPath);

if (distExists) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) res.status(404).send('Not found');
    });
  });
} else {
  app.get('/', (req, res) => {
    res.type('html').send(`
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><title>SwitchKey API</title></head>
    <body>
      <h1>SwitchKey API</h1>
      <p>API server is running. Use the app at <a href="http://localhost:5173">http://localhost:5173</a> (run <code>npm run dev</code> in another terminal).</p>
      <p>Endpoints: <code>GET/POST /api/projects</code>, <code>GET/DELETE /api/projects/:slug</code></p>
    </body></html>
  `);
  });
  app.get('*', (req, res) => res.status(404).send('Not found. Run npm run dev for the app.'));
}

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
