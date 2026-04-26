-- Migration v5: track explicit harvest component selections per monster
-- Previously, monster_harvestable_components only stored edible cooking types,
-- so non-edible components (hides, claws, etc.) had no per-monster record.
-- This table stores the full set of harvest_component IDs selected for each monster.

CREATE TABLE IF NOT EXISTS monster_harvest_component_selections (
  monster_id           TEXT NOT NULL REFERENCES monsters(id) ON DELETE CASCADE,
  harvest_component_id TEXT NOT NULL REFERENCES harvest_components(id),
  PRIMARY KEY (monster_id, harvest_component_id)
);

CREATE INDEX IF NOT EXISTS idx_mhcs_monster ON monster_harvest_component_selections(monster_id);

-- Backfill edible selections from existing monster_harvestable_components.
-- Joins harvest_components on matching creature type + edible_as = component_type_id.
-- Non-edible components were never tracked, so existing monsters start with edible-only backfill.
INSERT OR IGNORE INTO monster_harvest_component_selections (monster_id, harvest_component_id)
SELECT m.id, hc.id
FROM monsters m
JOIN monster_harvestable_components mhc ON mhc.monster_id = m.id
JOIN harvest_components hc
  ON hc.creature_type_id = m.creature_type_id
 AND hc.is_edible = 1
 AND hc.edible_as  = mhc.component_type_id;
