-- Migration 002: Harvesting & Crafting expansion
-- Applied by server/src/db.ts when user_version = 1 → 2

-- Add harvest skill to creature_types
ALTER TABLE creature_types ADD COLUMN harvest_skill TEXT;

-- ============================================================
-- HARVEST COMPONENTS
-- Raw components harvestable from each creature type.
-- Used for magic item crafting (not the same as cooking component_types).
-- ============================================================

CREATE TABLE harvest_components (
  id               TEXT PRIMARY KEY,            -- e.g. "aberration-eye"
  creature_type_id TEXT NOT NULL REFERENCES creature_types(id),
  name             TEXT NOT NULL,               -- e.g. "Eye"
  component_dc     INTEGER NOT NULL,            -- 5 | 10 | 15 | 20 | 25
  is_edible        INTEGER NOT NULL DEFAULT 0,  -- bool: usable as a cooking ingredient
  edible_as        TEXT,                        -- nullable → component_type_id (blood/bone/etc)
  is_volatile      INTEGER NOT NULL DEFAULT 0,  -- bool: triggers effect on partial harvest
  notes            TEXT
);

-- ============================================================
-- MAGIC ITEM RECIPES
-- Crafting recipes from the Crafting chapter.
-- ============================================================

CREATE TABLE magic_item_recipes (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  category          TEXT NOT NULL CHECK(category IN
    ('ammunition','armour','potion','ring','rod','scroll','staff','wand','weapon','wondrous')),
  rarity            TEXT NOT NULL CHECK(rarity IN
    ('common','uncommon','rare','very-rare','legendary','artifact')),
  item_value_gp     INTEGER,
  crafting_dc       INTEGER,
  crafting_time_hrs REAL,
  essence_type      TEXT,  -- frail | robust | potent | mythic | deific | null (common)
  notes             TEXT
);

-- Components required to craft a magic item
CREATE TABLE magic_item_components (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id        TEXT NOT NULL REFERENCES magic_item_recipes(id),
  creature_type_id TEXT REFERENCES creature_types(id),  -- null = no specific type required
  component_name   TEXT NOT NULL,
  metatag          TEXT,    -- e.g. "Aboleth", "Fire", "Gnome"
  quantity         INTEGER NOT NULL DEFAULT 1
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_harvest_components_creature   ON harvest_components(creature_type_id);
CREATE INDEX idx_harvest_components_dc         ON harvest_components(component_dc);
CREATE INDEX idx_magic_item_recipes_category   ON magic_item_recipes(category);
CREATE INDEX idx_magic_item_recipes_rarity     ON magic_item_recipes(rarity);
CREATE INDEX idx_magic_item_components_recipe  ON magic_item_components(recipe_id);
CREATE INDEX idx_magic_item_components_type    ON magic_item_components(creature_type_id);
