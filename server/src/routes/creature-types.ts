import { Router } from 'express';
import { db } from '../db.js';

export const creatureTypesRouter = Router();

// GET /api/creature-types
creatureTypesRouter.get('/', (_req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT
        ct.id,
        ct.name,
        json_group_array(ctc.component_type_id)
          FILTER (WHERE ctc.component_type_id IS NOT NULL) AS availableComponents
      FROM creature_types ct
      LEFT JOIN creature_type_components ctc ON ct.id = ctc.creature_type_id
      GROUP BY ct.id, ct.name
      ORDER BY ct.name
    `).all() as Array<{ id: string; name: string; availableComponents: string | null }>;

    res.json(rows.map(row => ({
      ...row,
      availableComponents: JSON.parse(row.availableComponents ?? '[]'),
    })));
  } catch (err) {
    next(err);
  }
});
