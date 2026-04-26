import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { creatureTypesRouter }      from './routes/creature-types.js';
import { componentTypesRouter }     from './routes/component-types.js';
import { monstersRouter }           from './routes/monsters.js';
import { ingredientsRouter }        from './routes/ingredients.js';
import { recipesRouter }            from './routes/recipes.js';
import { harvestComponentsRouter }  from './routes/harvest-components.js';
import { magicItemsRouter }         from './routes/magic-items.js';

/**
 * Express application entry point.
 *
 * ## Middleware stack (in order)
 * 1. `helmet` — sets security headers (CSP, X-Frame-Options, etc.)
 * 2. `cors` — allows requests from origins listed in `CORS_ORIGINS` env var
 *    (default: `http://localhost:4200`)
 * 3. `express.json()` — parses `application/json` request bodies
 * 4. `rateLimit` — 200 requests per 15 minutes per IP on `/api/*`
 *
 * ## Routes
 * All routes are mounted under `/api/`. See individual route files for
 * endpoint details. The `/api/health` endpoint is used by Electron's
 * startup polling loop to detect when the server is ready.
 *
 * ## Error handler
 * The final middleware catches any error passed to `next(err)`. In production
 * it returns a generic message; in development it includes `err.message`.
 *
 * ## Configuration
 * - `PORT` env var (default `3000`)
 * - `CORS_ORIGINS` env var — comma-separated list of allowed origins
 * - `NODE_ENV` env var — set to `'production'` to suppress error details
 */

const app  = express();
const port = Number(process.env['PORT'] ?? 3000);
const isProd = process.env['NODE_ENV'] === 'production';

app.use(helmet());

const allowedOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:4200')
  .split(',')
  .map(o => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// 200 requests per 15 minutes per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/creature-types',       creatureTypesRouter);
app.use('/api/component-types',      componentTypesRouter);
app.use('/api/monsters',             monstersRouter);
app.use('/api/ingredients',          ingredientsRouter);
app.use('/api/recipes',              recipesRouter);
app.use('/api/harvest-components',   harvestComponentsRouter);
app.use('/api/magic-items',          magicItemsRouter);

/** Polled by `electron/main.js` every 500 ms during startup to detect readiness. */
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Error handler ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err.message);
  res.status(500).json({ error: isProd ? 'Internal server error' : err.message });
});

app.listen(port, () => {
  console.log(`cooking-rules API listening on http://localhost:${port}`);
});
