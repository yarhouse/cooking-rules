import { Router } from 'express';
import { db } from '../db.js';

export const harvestComponentsRouter = Router();

/**
 * GET /api/harvest-components
 *
 * Returns harvestable components ordered by creature type, DC, then name.
 * Denormalises `creature_types.name` and `harvest_skill` via a JOIN so the
 * client has everything it needs without a second request.
 *
 * @param creatureTypeId - (optional query param) Filter to a single creature type.
 *   Example: `GET /api/harvest-components?creatureTypeId=undead`
 *
 * @returns `HarvestComponent[]` — shape:
 * ```json
 * [{
 *   "id": "...", "creatureTypeId": "undead", "creatureTypeName": "Undead",
 *   "harvestSkill": "Medicine", "name": "Bone Shard", "componentDc": 10,
 *   "isEdible": true, "edibleAs": "bone",
 *   "isVolatile": false, "notes": null, "componentMetatype": "structural"
 * }]
 * ```
 *
 * SQLite INTEGER booleans (`is_edible`, `is_volatile`) are converted to JS
 * `boolean` before responding.
 */
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
        hc.notes,
        hc.component_metatype AS componentMetatype
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
      componentMetatype: string | null;
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
