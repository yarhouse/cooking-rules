import { Router } from 'express';
import { db } from '../db.js';

export const recipesRouter = Router();

// GET /api/recipes
recipesRouter.get('/', (_req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT
        r.id,
        r.name,
        r.tier,
        r.dc,
        r.boss_effect    AS bossEffect,
        r.requires_heat  AS requiresHeat,
        r.notes,
        r.image_url      AS imageUrl,
        r.is_custom      AS isCustom,
        r.created_at     AS createdAt,
        json_group_array(
          json_object(
            'componentTypeId', ri.component_type_id,
            'bossSpecific',    ri.boss_specific
          )
        ) FILTER (WHERE ri.component_type_id IS NOT NULL) AS ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      GROUP BY r.id, r.name, r.tier, r.dc, r.boss_effect,
               r.requires_heat, r.notes, r.image_url, r.is_custom, r.created_at
      ORDER BY
        CASE r.tier
          WHEN 'novice'     THEN 1
          WHEN 'journeyman' THEN 2
          WHEN 'expert'     THEN 3
          WHEN 'artisan'    THEN 4
          WHEN 'boss'       THEN 5
        END,
        r.name
    `).all() as Array<{
      id: string; name: string; tier: string; dc: number;
      bossEffect: string | null; requiresHeat: number; notes: string | null;
      imageUrl: string | null; isCustom: number; createdAt: string;
      ingredients: string | null;
    }>;

    res.json(rows.map(row => {
      const rawIngredients: Array<{ componentTypeId: string; bossSpecific: string | null }>
        = JSON.parse(row.ingredients ?? '[]');
      return {
        ...row,
        requiresHeat: Boolean(row.requiresHeat),
        isCustom:     Boolean(row.isCustom),
        ingredients:  rawIngredients.map(i => ({
          componentTypeId: i.componentTypeId,
          ...(i.bossSpecific !== null && { bossSpecific: i.bossSpecific }),
        })),
      };
    }));
  } catch (err) {
    next(err);
  }
});
