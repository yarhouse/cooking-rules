import { Router } from 'express';
import { db } from '../db.js';

export const ingredientsRouter = Router();

/**
 * GET /api/ingredients
 *
 * Returns all ingredients ordered alphabetically.
 *
 * @returns `Ingredient[]` — shape:
 * ```json
 * [{
 *   "id": "...", "name": "Zombie Flesh", "componentTypeId": "flesh",
 *   "creatureTypeId": "undead", "sourceMonsterIds": ["monster-id"],
 *   "notes": null, "isCustom": false, "createdAt": "..."
 * }]
 * ```
 *
 * `sourceMonsterIds` is an array in the client model but stored as a single
 * `source_monster_id` FK in the DB (one ingredient → one source monster).
 * The field is wrapped in `[value]` here so the client doesn't need to know
 * about the storage difference.
 *
 * SQLite INTEGER `is_custom` is converted to JS `boolean` before responding.
 */
ingredientsRouter.get('/', (_req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT
        i.id,
        i.name,
        i.component_type_id AS componentTypeId,
        i.creature_type_id  AS creatureTypeId,
        i.source_monster_id AS sourceMonsterIds,
        i.notes,
        i.is_custom         AS isCustom,
        i.created_at        AS createdAt
      FROM ingredients i
      ORDER BY i.name
    `).all() as Array<{
      id: string; name: string; componentTypeId: string; creatureTypeId: string;
      sourceMonsterIds: string | null; notes: string | null; isCustom: number; createdAt: string;
    }>;

    res.json(rows.map(row => ({
      ...row,
      isCustom:        Boolean(row.isCustom),
      sourceMonsterIds: row.sourceMonsterIds ? [row.sourceMonsterIds] : [],
    })));
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/ingredients/:id
 *
 * Deletes a custom ingredient by ID. Returns 404 if the ingredient does not
 * exist or is not marked `is_custom = 1` (rulebook ingredients cannot be deleted).
 *
 * @param id - (path param) `Ingredient.id`
 * @returns `{ id: string, name: string }` on success
 */
ingredientsRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  try {
    const ingredient = db.prepare(
      `SELECT * FROM ingredients WHERE id = ? AND is_custom = 1`
    ).get(id) as Record<string, unknown> | undefined;
    if (!ingredient) return res.status(404).json({ error: 'Custom ingredient not found' });
    db.prepare(`DELETE FROM ingredients WHERE id = ?`).run(id);
    res.json({ id, name: ingredient['name'] });
  } catch (err) { next(err); }
});
