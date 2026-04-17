-- cooking-rules: SQLite schema
-- Applied automatically on first launch by server/src/db.ts.
-- No ENUMs (SQLite uses CHECK constraints), no SERIAL (INTEGER PRIMARY KEY),
-- no TIMESTAMPTZ (TEXT ISO-8601), no pg-specific defaults.

-- ============================================================
-- REFERENCE TABLES
-- ============================================================

CREATE TABLE creature_types (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  harvest_skill TEXT            -- skill used for harvesting checks (e.g. Arcana, Survival)
);

CREATE TABLE component_types (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE creature_type_components (
  creature_type_id  TEXT NOT NULL REFERENCES creature_types(id),
  component_type_id TEXT NOT NULL REFERENCES component_types(id),
  PRIMARY KEY (creature_type_id, component_type_id)
);

CREATE TABLE component_effects (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  component_type_id TEXT NOT NULL REFERENCES component_types(id),
  creature_type_id  TEXT NOT NULL REFERENCES creature_types(id),
  description       TEXT NOT NULL,
  scaling_uncommon  TEXT,
  scaling_rare      TEXT,
  scaling_very_rare TEXT,
  scaling_legendary TEXT,
  UNIQUE (component_type_id, creature_type_id)
);

CREATE TABLE monsters (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  creature_type_id TEXT NOT NULL REFERENCES creature_types(id),
  rarity           TEXT NOT NULL CHECK(rarity IN ('common','uncommon','rare','very-rare','legendary')),
  is_boss          INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  is_custom        INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE monster_harvestable_components (
  monster_id        TEXT NOT NULL REFERENCES monsters(id),
  component_type_id TEXT NOT NULL REFERENCES component_types(id),
  PRIMARY KEY (monster_id, component_type_id)
);

CREATE TABLE ingredients (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  component_type_id TEXT NOT NULL REFERENCES component_types(id),
  creature_type_id  TEXT NOT NULL REFERENCES creature_types(id),
  notes             TEXT,
  is_custom         INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE ingredient_source_monsters (
  ingredient_id TEXT NOT NULL REFERENCES ingredients(id),
  monster_id    TEXT NOT NULL REFERENCES monsters(id),
  PRIMARY KEY (ingredient_id, monster_id)
);

CREATE TABLE recipes (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  tier          TEXT NOT NULL CHECK(tier IN ('novice','journeyman','expert','artisan','boss')),
  dc            INTEGER NOT NULL,
  boss_effect   TEXT,
  requires_heat INTEGER NOT NULL DEFAULT 1,
  notes         TEXT,
  image_url     TEXT,
  is_custom     INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE recipe_ingredients (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id         TEXT NOT NULL REFERENCES recipes(id),
  component_type_id TEXT NOT NULL REFERENCES component_types(id),
  boss_specific     TEXT
);

-- ============================================================
-- HARVESTING & CRAFTING REFERENCE TABLES
-- ============================================================

CREATE TABLE harvest_components (
  id               TEXT PRIMARY KEY,            -- e.g. "aberration-eye"
  creature_type_id TEXT NOT NULL REFERENCES creature_types(id),
  name             TEXT NOT NULL,
  component_dc     INTEGER NOT NULL,
  is_edible        INTEGER NOT NULL DEFAULT 0,  -- bool
  edible_as        TEXT,                        -- nullable → component_type_id
  is_volatile      INTEGER NOT NULL DEFAULT 0,  -- bool
  notes            TEXT
);

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
  essence_type      TEXT,
  notes             TEXT
);

CREATE TABLE magic_item_components (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id        TEXT NOT NULL REFERENCES magic_item_recipes(id),
  creature_type_id TEXT REFERENCES creature_types(id),
  component_name   TEXT NOT NULL,
  metatag          TEXT,
  quantity         INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_harvest_components_creature   ON harvest_components(creature_type_id);
CREATE INDEX idx_harvest_components_dc         ON harvest_components(component_dc);
CREATE INDEX idx_magic_item_recipes_category   ON magic_item_recipes(category);
CREATE INDEX idx_magic_item_recipes_rarity     ON magic_item_recipes(rarity);
CREATE INDEX idx_magic_item_components_recipe  ON magic_item_components(recipe_id);
CREATE INDEX idx_magic_item_components_type    ON magic_item_components(creature_type_id);

-- ============================================================
-- CAMPAIGN / USER DATA
-- ============================================================

CREATE TABLE campaigns (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE inventory_entries (
  campaign_id   INTEGER NOT NULL REFERENCES campaigns(id),
  ingredient_id TEXT    NOT NULL REFERENCES ingredients(id),
  quantity      INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  PRIMARY KEY (campaign_id, ingredient_id)
);

CREATE TABLE essence_stock (
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
  rarity      TEXT    NOT NULL CHECK(rarity IN ('uncommon','rare','very-rare','legendary')),
  quantity    INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  PRIMARY KEY (campaign_id, rarity)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_ingredients_component_type ON ingredients(component_type_id);
CREATE INDEX idx_ingredients_creature_type  ON ingredients(creature_type_id);
CREATE INDEX idx_monsters_creature_type     ON monsters(creature_type_id);
CREATE INDEX idx_monsters_rarity            ON monsters(rarity);
CREATE INDEX idx_recipe_ingredients_recipe  ON recipe_ingredients(recipe_id);
CREATE INDEX idx_component_effects_comp     ON component_effects(component_type_id);
