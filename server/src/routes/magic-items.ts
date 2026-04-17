import { Router } from 'express';
import { db } from '../db.js';

export const magicItemsRouter = Router();

// GET /api/magic-items
// Optional query params: ?category=potion, ?rarity=rare, ?creatureTypeId=dragon
magicItemsRouter.get('/', (req, res, next) => {
  try {
    const { category, rarity, creatureTypeId } = req.query;

    const conditions: string[] = [];
    const params: string[] = [];

    if (category) {
      conditions.push('mir.category = ?');
      params.push(category as string);
    }
    if (rarity) {
      conditions.push('mir.rarity = ?');
      params.push(rarity as string);
    }
    if (creatureTypeId) {
      conditions.push('mir.id IN (SELECT recipe_id FROM magic_item_components WHERE creature_type_id = ?)');
      params.push(creatureTypeId as string);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT
        mir.id,
        mir.name,
        mir.category,
        mir.rarity,
        mir.item_value_gp     AS itemValueGp,
        mir.crafting_dc       AS craftingDc,
        mir.crafting_time_hrs AS craftingTimeHrs,
        mir.essence_type      AS essenceType,
        mir.notes,
        json_group_array(
          json_object(
            'creatureTypeId', mic.creature_type_id,
            'componentName',  mic.component_name,
            'metatag',        mic.metatag,
            'quantity',       mic.quantity
          )
        ) FILTER (WHERE mic.id IS NOT NULL) AS components
      FROM magic_item_recipes mir
      LEFT JOIN magic_item_components mic ON mir.id = mic.recipe_id
      ${where}
      GROUP BY mir.id, mir.name, mir.category, mir.rarity,
               mir.item_value_gp, mir.crafting_dc, mir.crafting_time_hrs,
               mir.essence_type, mir.notes
      ORDER BY mir.category, mir.rarity, mir.name
    `;

    const rows = db.prepare(sql).all(...params) as Array<{
      id: string; name: string; category: string; rarity: string;
      itemValueGp: number | null; craftingDc: number | null;
      craftingTimeHrs: number | null; essenceType: string | null;
      notes: string | null; components: string | null;
    }>;

    res.json(rows.map(row => ({
      ...row,
      components: JSON.parse(row.components ?? '[]'),
    })));
  } catch (err) {
    next(err);
  }
});
