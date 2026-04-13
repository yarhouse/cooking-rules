import { Router } from 'express';
import { db } from '../db.js';

export const ingredientsRouter = Router();

// GET /api/ingredients
ingredientsRouter.get('/', (_req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT
        i.id,
        i.name,
        i.component_type_id AS componentTypeId,
        i.creature_type_id  AS creatureTypeId,
        i.notes,
        i.is_custom         AS isCustom,
        i.created_at        AS createdAt,
        json_group_array(ism.monster_id)
          FILTER (WHERE ism.monster_id IS NOT NULL) AS sourceMonsterIds
      FROM ingredients i
      LEFT JOIN ingredient_source_monsters ism ON i.id = ism.ingredient_id
      GROUP BY i.id, i.name, i.component_type_id, i.creature_type_id,
               i.notes, i.is_custom, i.created_at
      ORDER BY i.name
    `).all() as Array<{
      id: string; name: string; componentTypeId: string; creatureTypeId: string;
      notes: string | null; isCustom: number; createdAt: string;
      sourceMonsterIds: string | null;
    }>;

    res.json(rows.map(row => ({
      ...row,
      isCustom:        Boolean(row.isCustom),
      sourceMonsterIds: JSON.parse(row.sourceMonsterIds ?? '[]'),
    })));
  } catch (err) {
    next(err);
  }
});
