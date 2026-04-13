import { Router } from 'express';
import { db } from '../db.js';

export const monstersRouter = Router();

// GET /api/monsters
monstersRouter.get('/', (_req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT
        m.id,
        m.name,
        m.creature_type_id  AS creatureTypeId,
        m.rarity,
        m.is_boss           AS isBoss,
        m.notes,
        m.is_custom         AS isCustom,
        m.created_at        AS createdAt,
        json_group_array(mhc.component_type_id)
          FILTER (WHERE mhc.component_type_id IS NOT NULL) AS harvestableComponents
      FROM monsters m
      LEFT JOIN monster_harvestable_components mhc ON m.id = mhc.monster_id
      GROUP BY m.id, m.name, m.creature_type_id, m.rarity,
               m.is_boss, m.notes, m.is_custom, m.created_at
      ORDER BY m.name
    `).all() as Array<{
      id: string; name: string; creatureTypeId: string; rarity: string;
      isBoss: number; notes: string | null; isCustom: number;
      createdAt: string; harvestableComponents: string | null;
    }>;

    res.json(rows.map(row => ({
      ...row,
      isBoss:               Boolean(row.isBoss),
      isCustom:             Boolean(row.isCustom),
      harvestableComponents: JSON.parse(row.harvestableComponents ?? '[]'),
    })));
  } catch (err) {
    next(err);
  }
});
