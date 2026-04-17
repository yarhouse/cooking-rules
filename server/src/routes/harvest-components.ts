import { Router } from 'express';
import { db } from '../db.js';

export const harvestComponentsRouter = Router();

// GET /api/harvest-components
// Optional query param: ?creatureTypeId=dragon
harvestComponentsRouter.get('/', (req, res, next) => {
  try {
    const { creatureTypeId } = req.query;

    const sql = `
      SELECT
        hc.id,
        hc.creature_type_id   AS creatureTypeId,
        ct.name               AS creatureTypeName,
        ct.harvest_skill      AS harvestSkill,
        hc.name,
        hc.component_dc       AS componentDc,
        hc.is_edible          AS isEdible,
        hc.edible_as          AS edibleAs,
        hc.is_volatile        AS isVolatile,
        hc.notes
      FROM harvest_components hc
      JOIN creature_types ct ON hc.creature_type_id = ct.id
      ${creatureTypeId ? 'WHERE hc.creature_type_id = ?' : ''}
      ORDER BY hc.creature_type_id, hc.component_dc, hc.name
    `;

    const rows = (
      creatureTypeId
        ? db.prepare(sql).all(creatureTypeId)
        : db.prepare(sql).all()
    ) as Array<{
      id: string; creatureTypeId: string; creatureTypeName: string;
      harvestSkill: string; name: string; componentDc: number;
      isEdible: number; edibleAs: string | null;
      isVolatile: number; notes: string | null;
    }>;

    res.json(rows.map(row => ({
      ...row,
      isEdible:   Boolean(row.isEdible),
      isVolatile: Boolean(row.isVolatile),
    })));
  } catch (err) {
    next(err);
  }
});
