import { Router } from 'express';
import { db } from '../db.js';

export const componentTypesRouter = Router();

/**
 * GET /api/component-types
 *
 * Returns all component types, each with the full list of per-creature-type
 * cooking effects (including optional rarity scaling).
 *
 * @returns `ComponentType[]` — shape:
 * ```json
 * [{
 *   "id": "flesh", "name": "Flesh", "description": "...",
 *   "effects": [{
 *     "creatureTypeId": "undead",
 *     "description": "...",
 *     "scaling": { "uncommon": "...", "rare": "...", "veryRare": "...", "legendary": "..." }
 *   }]
 * }]
 * ```
 *
 * `scaling` is included as a nested JSON object only when at least one of the
 * four `scaling_*` columns in `component_effects` is non-null; otherwise the
 * CASE expression returns NULL and the field is omitted from the effect object
 * after `JSON.parse`.
 *
 * The `effects` array is assembled via `json_group_array` + `json_object` from
 * `component_effects`. Empty junction rows produce `[]`.
 */
componentTypesRouter.get('/', (_req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT
        ct.id,
        ct.name,
        ct.description,
        json_group_array(
          json_object(
            'creatureTypeId', ce.creature_type_id,
            'description',    ce.description,
            'scaling', CASE
              WHEN ce.scaling_uncommon  IS NOT NULL
                OR ce.scaling_rare      IS NOT NULL
                OR ce.scaling_very_rare IS NOT NULL
                OR ce.scaling_legendary IS NOT NULL
              THEN json_object(
                'uncommon',  ce.scaling_uncommon,
                'rare',      ce.scaling_rare,
                'veryRare',  ce.scaling_very_rare,
                'legendary', ce.scaling_legendary
              )
              ELSE NULL
            END
          )
        ) FILTER (WHERE ce.creature_type_id IS NOT NULL) AS effects
      FROM component_types ct
      LEFT JOIN component_effects ce ON ct.id = ce.component_type_id
      GROUP BY ct.id, ct.name, ct.description
      ORDER BY ct.name
    `).all() as Array<{ id: string; name: string; description: string; effects: string | null }>;

    res.json(rows.map(row => ({
      ...row,
      effects: JSON.parse(row.effects ?? '[]'),
    })));
  } catch (err) {
    next(err);
  }
});
