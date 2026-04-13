import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { creatureTypesRouter } from './routes/creature-types.js';
import { componentTypesRouter } from './routes/component-types.js';
import { monstersRouter }       from './routes/monsters.js';
import { ingredientsRouter }    from './routes/ingredients.js';
import { recipesRouter }        from './routes/recipes.js';

const app  = express();
const port = Number(process.env['PORT'] ?? 3000);
const isProd = process.env['NODE_ENV'] === 'production';

// Security headers
app.use(helmet());

// Allow the Angular dev server (and any configured origin) to hit the API.
const allowedOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:4200')
  .split(',')
  .map(o => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Rate limiting — 200 requests per 15 minutes per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ----- Routes ---------------------------------------------------------------
app.use('/api/creature-types',  creatureTypesRouter);
app.use('/api/component-types', componentTypesRouter);
app.use('/api/monsters',        monstersRouter);
app.use('/api/ingredients',     ingredientsRouter);
app.use('/api/recipes',         recipesRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ----- Error handler --------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err.message);
  res.status(500).json({ error: isProd ? 'Internal server error' : err.message });
});

app.listen(port, () => {
  console.log(`cooking-rules API listening on http://localhost:${port}`);
});
