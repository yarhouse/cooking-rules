import { Router } from 'express';
import { randomUUID } from 'crypto';
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
        json_group_array(DISTINCT mhc.component_type_id)
          FILTER (WHERE mhc.component_type_id IS NOT NULL)  AS harvestableComponents,
        json_group_array(DISTINCT mhcs.harvest_component_id)
          FILTER (WHERE mhcs.harvest_component_id IS NOT NULL) AS selectedHarvestComponentIds
      FROM monsters m
      LEFT JOIN monster_harvestable_components mhc ON m.id = mhc.monster_id
      LEFT JOIN monster_harvest_component_selections mhcs ON m.id = mhcs.monster_id
      GROUP BY m.id, m.name, m.creature_type_id, m.rarity,
               m.is_boss, m.notes, m.is_custom, m.created_at
      ORDER BY m.name
    `).all() as Array<{
      id: string; name: string; creatureTypeId: string; rarity: string;
      isBoss: number; notes: string | null; isCustom: number;
      createdAt: string; harvestableComponents: string | null;
      selectedHarvestComponentIds: string | null;
    }>;

    res.json(rows.map(row => ({
      ...row,
      isBoss:                      Boolean(row.isBoss),
      isCustom:                    Boolean(row.isCustom),
      harvestableComponents:       JSON.parse(row.harvestableComponents ?? '[]'),
      selectedHarvestComponentIds: JSON.parse(row.selectedHarvestComponentIds ?? '[]'),
    })));
  } catch (err) {
    next(err);
  }
});

// POST /api/monsters — create a custom monster + named ingredients in one transaction
monstersRouter.post('/', (req, res, next) => {
  const {
    name, creatureTypeId, rarity, isBoss, notes,
    harvestableComponents, selectedHarvestComponentIds, ingredients,
  } = req.body as {
    name: string; creatureTypeId: string; rarity: string; isBoss: boolean;
    notes: string | null; harvestableComponents: string[];
    selectedHarvestComponentIds: string[];
    ingredients: Array<{ name: string; componentTypeId: string | null; notes: string | null }>;
  };
  try {
    const result = db.transaction(() => {
      const monsterId = randomUUID();
      db.prepare(`
        INSERT INTO monsters (id, name, creature_type_id, rarity, is_boss, notes, is_custom)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `).run(monsterId, name, creatureTypeId, rarity, isBoss ? 1 : 0, notes ?? null);

      const insertComp = db.prepare(
        `INSERT OR IGNORE INTO monster_harvestable_components (monster_id, component_type_id) VALUES (?, ?)`
      );
      for (const ct of harvestableComponents) insertComp.run(monsterId, ct);

      const insertSel = db.prepare(
        `INSERT OR IGNORE INTO monster_harvest_component_selections (monster_id, harvest_component_id) VALUES (?, ?)`
      );
      for (const hcId of selectedHarvestComponentIds) insertSel.run(monsterId, hcId);

      const insertIng = db.prepare(`
        INSERT INTO ingredients (id, name, component_type_id, creature_type_id, source_monster_id, notes, is_custom)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `);
      const createdIngredients: object[] = [];
      const now = new Date().toISOString();
      for (const ing of ingredients) {
        if (!ing.componentTypeId) continue;
        const ingId = randomUUID();
        insertIng.run(ingId, ing.name, ing.componentTypeId, creatureTypeId, monsterId, ing.notes ?? null);
        createdIngredients.push({
          id: ingId, name: ing.name, componentTypeId: ing.componentTypeId,
          creatureTypeId, sourceMonsterIds: [monsterId],
          notes: ing.notes ?? null, isCustom: true, createdAt: now,
        });
      }

      return {
        monster: {
          id: monsterId, name, creatureTypeId, rarity,
          isBoss: Boolean(isBoss), notes: notes ?? null,
          isCustom: true, createdAt: now,
          harvestableComponents, selectedHarvestComponentIds,
        },
        ingredients: createdIngredients,
      };
    })();
    res.status(201).json(result);
  } catch (err) { next(err); }
});

// PUT /api/monsters/:id — update a monster's fields and harvestable components
monstersRouter.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const {
    name, rarity, isBoss, notes,
    harvestableComponents, selectedHarvestComponentIds, newIngredients,
  } = req.body as {
    name: string; rarity: string; isBoss: boolean; notes: string | null;
    harvestableComponents: string[];
    selectedHarvestComponentIds: string[];
    newIngredients: Array<{ name: string; componentTypeId: string | null; notes: string | null }>;
  };
  try {
    const result = db.transaction(() => {
      const existing = db.prepare(
        `SELECT * FROM monsters WHERE id = ?`
      ).get(id) as Record<string, unknown> | undefined;
      if (!existing) return null;

      db.prepare(`UPDATE monsters SET name=?, rarity=?, is_boss=?, notes=? WHERE id=?`)
        .run(name, rarity, isBoss ? 1 : 0, notes ?? null, id);

      // Diff old vs new harvest component selections
      const oldIds = (db.prepare(
        `SELECT harvest_component_id FROM monster_harvest_component_selections WHERE monster_id = ?`
      ).all(id) as Array<{ harvest_component_id: string }>).map(r => r.harvest_component_id);

      const newSet = new Set(selectedHarvestComponentIds);
      const removedHcIds = oldIds.filter(hcId => !newSet.has(hcId));

      if (removedHcIds.length) {
        // Cascade: delete linked cooking ingredients for removed edible components
        const removedEdible = (db.prepare(
          `SELECT edible_as FROM harvest_components
           WHERE id IN (${removedHcIds.map(() => '?').join(',')}) AND is_edible = 1 AND edible_as IS NOT NULL`
        ).all(...removedHcIds) as Array<{ edible_as: string }>);

        if (removedEdible.length) {
          const removedTypes = removedEdible.map(r => r.edible_as);
          const ph = removedTypes.map(() => '?').join(',');
          db.prepare(`DELETE FROM monster_harvestable_components WHERE monster_id = ? AND component_type_id IN (${ph})`).run(id, ...removedTypes);
          db.prepare(`DELETE FROM ingredients WHERE source_monster_id = ? AND component_type_id IN (${ph})`).run(id, ...removedTypes);
        }

        const phR = removedHcIds.map(() => '?').join(',');
        db.prepare(
          `DELETE FROM monster_harvest_component_selections WHERE monster_id = ? AND harvest_component_id IN (${phR})`
        ).run(id, ...removedHcIds);
      }

      // Insert new component type entries (INSERT OR IGNORE handles unchanged ones)
      const insertComp = db.prepare(
        `INSERT OR IGNORE INTO monster_harvestable_components (monster_id, component_type_id) VALUES (?, ?)`
      );
      for (const ct of harvestableComponents) insertComp.run(id, ct);

      const insertSel = db.prepare(
        `INSERT OR IGNORE INTO monster_harvest_component_selections (monster_id, harvest_component_id) VALUES (?, ?)`
      );
      for (const hcId of selectedHarvestComponentIds) insertSel.run(id, hcId);

      const creatureTypeId = existing['creature_type_id'] as string;
      const insertIng = db.prepare(`
        INSERT INTO ingredients (id, name, component_type_id, creature_type_id, source_monster_id, notes, is_custom)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `);
      for (const ing of newIngredients) {
        if (!ing.componentTypeId) continue;
        insertIng.run(randomUUID(), ing.name, ing.componentTypeId, creatureTypeId, id, ing.notes ?? null);
      }

      const updatedRow = db.prepare(`
        SELECT m.id, m.name, m.creature_type_id AS creatureTypeId, m.rarity,
               m.is_boss AS isBoss, m.notes, m.is_custom AS isCustom, m.created_at AS createdAt,
               json_group_array(DISTINCT mhc.component_type_id)
                 FILTER (WHERE mhc.component_type_id IS NOT NULL)  AS harvestableComponents,
               json_group_array(DISTINCT mhcs.harvest_component_id)
                 FILTER (WHERE mhcs.harvest_component_id IS NOT NULL) AS selectedHarvestComponentIds
        FROM monsters m
        LEFT JOIN monster_harvestable_components mhc ON m.id = mhc.monster_id
        LEFT JOIN monster_harvest_component_selections mhcs ON m.id = mhcs.monster_id
        WHERE m.id = ?
        GROUP BY m.id
      `).get(id) as Record<string, unknown>;

      const updatedIngredients = (db.prepare(
        `SELECT id, name, component_type_id AS componentTypeId, creature_type_id AS creatureTypeId,
                source_monster_id, notes, is_custom AS isCustom, created_at AS createdAt
         FROM ingredients WHERE source_monster_id = ?`
      ).all(id) as Array<Record<string, unknown>>).map(i => ({
        ...i,
        isCustom: Boolean(i['isCustom']),
        sourceMonsterIds: i['source_monster_id'] ? [i['source_monster_id']] : [],
      }));

      return {
        monster: {
          ...updatedRow,
          isBoss:                      Boolean(updatedRow['isBoss']),
          isCustom:                    Boolean(updatedRow['isCustom']),
          harvestableComponents:       JSON.parse((updatedRow['harvestableComponents'] as string) ?? '[]'),
          selectedHarvestComponentIds: JSON.parse((updatedRow['selectedHarvestComponentIds'] as string) ?? '[]'),
        },
        ingredients: updatedIngredients,
      };
    })();

    if (!result) return res.status(404).json({ error: 'Monster not found' });
    res.json(result);
  } catch (err) { next(err); }
});

// DELETE /api/monsters/:id — delete a custom monster, optionally cascade to ingredients
monstersRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const withIngredients = req.query['withIngredients'] === 'true';
  try {
    const result = db.transaction(() => {
      const monster = db.prepare(
        `SELECT * FROM monsters WHERE id = ? AND is_custom = 1`
      ).get(id) as Record<string, unknown> | undefined;
      if (!monster) return null;

      const linkedCount = (db.prepare(
        `SELECT COUNT(*) AS cnt FROM ingredients WHERE source_monster_id = ?`
      ).get(id) as { cnt: number }).cnt;

      let deletedIngredientCount = 0;
      if (withIngredients) {
        db.prepare(`DELETE FROM ingredients WHERE source_monster_id = ?`).run(id);
        deletedIngredientCount = linkedCount;
      }
      db.prepare(`DELETE FROM monster_harvestable_components WHERE monster_id = ?`).run(id);
      db.prepare(`DELETE FROM monsters WHERE id = ?`).run(id);

      return {
        id, name: monster['name'],
        deletedIngredientCount,
        unlinkedIngredientCount: linkedCount - deletedIngredientCount,
      };
    })();

    if (!result) return res.status(404).json({ error: 'Custom monster not found' });
    res.json(result);
  } catch (err) { next(err); }
});
