-- Seed 002: Harvesting & Crafting data
-- Idempotent — safe to re-run (INSERT OR IGNORE).
-- Data sourced from Heliana's Guide to Monster Hunting: Part 1

-- ============================================================
-- HARVEST SKILLS — update creature_types
-- ============================================================

UPDATE creature_types SET harvest_skill = 'Arcana'       WHERE id = 'aberration';
UPDATE creature_types SET harvest_skill = 'Survival'     WHERE id = 'beast';
UPDATE creature_types SET harvest_skill = 'Religion'     WHERE id = 'celestial';
UPDATE creature_types SET harvest_skill = 'Investigation' WHERE id = 'construct';
UPDATE creature_types SET harvest_skill = 'Survival'     WHERE id = 'dragon';
UPDATE creature_types SET harvest_skill = 'Arcana'       WHERE id = 'elemental';
UPDATE creature_types SET harvest_skill = 'Arcana'       WHERE id = 'fey';
UPDATE creature_types SET harvest_skill = 'Religion'     WHERE id = 'fiend';
UPDATE creature_types SET harvest_skill = 'Medicine'     WHERE id = 'giant';
UPDATE creature_types SET harvest_skill = 'Medicine'     WHERE id = 'humanoid';
UPDATE creature_types SET harvest_skill = 'Survival'     WHERE id = 'monstrosity';
UPDATE creature_types SET harvest_skill = 'Nature'       WHERE id = 'ooze';
UPDATE creature_types SET harvest_skill = 'Nature'       WHERE id = 'plant';
UPDATE creature_types SET harvest_skill = 'Medicine'     WHERE id = 'undead';

-- ============================================================
-- HARVEST COMPONENTS
-- Columns: id, creature_type_id, name, component_dc,
--          is_edible, edible_as, is_volatile, notes, component_metatype
-- ============================================================

INSERT OR IGNORE INTO harvest_components
  (id, creature_type_id, name, component_dc, is_edible, edible_as, is_volatile, notes, component_metatype)
VALUES
-- -------- ABERRATION ----------------------------------------
('aberration-antenna',        'aberration', 'Antenna',        5,  1, 'eye',   0, 'Antennae can be used as eyes for cooking', 'eye'),
('aberration-eye',            'aberration', 'Eye',            5,  1, 'eye',   0, NULL,                                        'eye'),
('aberration-flesh',          'aberration', 'Flesh',          5,  1, 'flesh', 0, NULL,                                        'flesh'),
('aberration-phial-of-blood', 'aberration', 'Phial of Blood', 5,  1, 'blood', 0, NULL,                                        'blood'),
('aberration-bone',           'aberration', 'Bone',           10, 1, 'bone',  0, NULL,                                        'bone'),
('aberration-egg',            'aberration', 'Egg',            10, 1, 'egg',   0, NULL,                                        'egg'),
('aberration-fat',            'aberration', 'Fat',            10, 1, 'fat',   0, NULL,                                        'fat'),
('aberration-pouch-of-claws', 'aberration', 'Pouch of Claws', 10, 0, NULL,   0, NULL,                                        'claws'),
('aberration-pouch-of-teeth', 'aberration', 'Pouch of Teeth', 10, 0, NULL,   0, NULL,                                        'teeth'),
('aberration-tentacle',       'aberration', 'Tentacle',       10, 0, NULL,   0, NULL,                                        'tentacle'),
('aberration-heart',          'aberration', 'Heart',          15, 1, 'heart', 0, NULL,                                        'heart'),
('aberration-phial-of-mucus', 'aberration', 'Phial of Mucus', 15, 0, NULL,   0, NULL,                                        NULL),
('aberration-liver',          'aberration', 'Liver',          15, 1, 'liver', 0, NULL,                                        'liver'),
('aberration-stinger',        'aberration', 'Stinger',        15, 0, NULL,   0, NULL,                                        'stinger'),
('aberration-brain',          'aberration', 'Brain',          20, 1, 'brain', 0, NULL,                                        'brain'),
('aberration-chitin',         'aberration', 'Chitin',         20, 0, NULL,   0, NULL,                                        'chitin'),
('aberration-hide',           'aberration', 'Hide',           20, 0, NULL,   0, NULL,                                        NULL),
('aberration-main-eye',       'aberration', 'Main Eye',       20, 0, NULL,   1, 'Volatile: triggers area effect on partial harvest', NULL),

-- -------- BEAST ---------------------------------------------
('beast-antenna',             'beast', 'Antenna',             5,  1, 'eye',   0, 'Antennae can be used as eyes for cooking', 'eye'),
('beast-eye',                 'beast', 'Eye',                 5,  1, 'eye',   0, NULL,                                        'eye'),
('beast-hair',                'beast', 'Hair',                5,  0, NULL,   0, NULL,                                        'hair'),
('beast-flesh',               'beast', 'Flesh',               5,  1, 'flesh', 0, NULL,                                        'flesh'),
('beast-phial-of-blood',      'beast', 'Phial of Blood',      5,  1, 'blood', 0, NULL,                                        'blood'),
('beast-antler',              'beast', 'Antler',              10, 0, NULL,   0, 'Used for monster-forged items only',         'antler'),
('beast-beak',                'beast', 'Beak',                10, 0, NULL,   0, NULL,                                        'beak'),
('beast-bone',                'beast', 'Bone',                10, 1, 'bone',  0, NULL,                                        'bone'),
('beast-egg',                 'beast', 'Egg',                 10, 1, 'egg',   0, NULL,                                        'egg'),
('beast-fat',                 'beast', 'Fat',                 10, 1, 'fat',   0, NULL,                                        'fat'),
('beast-fin',                 'beast', 'Fin',                 10, 0, NULL,   0, NULL,                                        'fin'),
('beast-horn',                'beast', 'Horn',                10, 0, NULL,   0, NULL,                                        'horn'),
('beast-pincer',              'beast', 'Pincer',              10, 0, NULL,   0, 'Used for monster-forged items only',         'pincer'),
('beast-pouch-of-claws',      'beast', 'Pouch of Claws',      10, 0, NULL,   0, NULL,                                        'claws'),
('beast-pouch-of-teeth',      'beast', 'Pouch of Teeth',      10, 0, NULL,   0, NULL,                                        'teeth'),
('beast-talon',               'beast', 'Talon',               10, 0, NULL,   0, 'Used for monster-forged items only',         'talon'),
('beast-tusk',                'beast', 'Tusk',                10, 0, NULL,   0, NULL,                                        'tusk'),
('beast-heart',               'beast', 'Heart',               15, 1, 'heart', 0, NULL,                                        'heart'),
('beast-liver',               'beast', 'Liver',               15, 1, 'liver', 0, NULL,                                        'liver'),
('beast-poison-gland',        'beast', 'Poison Gland',        15, 0, NULL,   0, NULL,                                        'poison-gland'),
('beast-pouch-of-feathers',   'beast', 'Pouch of Feathers',   15, 0, NULL,   0, NULL,                                        'feathers'),
('beast-pouch-of-scales',     'beast', 'Pouch of Scales',     15, 0, NULL,   0, NULL,                                        'scales'),
('beast-stinger',             'beast', 'Stinger',             15, 0, NULL,   0, NULL,                                        'stinger'),
('beast-tentacle',            'beast', 'Tentacle',            15, 0, NULL,   0, NULL,                                        'tentacle'),
('beast-chitin',              'beast', 'Chitin',              20, 0, NULL,   0, NULL,                                        'chitin'),
('beast-pelt',                'beast', 'Pelt',                20, 0, NULL,   0, NULL,                                        'pelt'),

-- -------- CELESTIAL -----------------------------------------
('celestial-eye',              'celestial', 'Eye',              5,  1, 'eye',   0, NULL,                            'eye'),
('celestial-flesh',            'celestial', 'Flesh',            5,  1, 'flesh', 0, NULL,                            'flesh'),
('celestial-hair',             'celestial', 'Hair',             5,  0, NULL,   0, NULL,                            'hair'),
('celestial-phial-of-blood',   'celestial', 'Phial of Blood',   5,  1, 'blood', 0, NULL,                            'blood'),
('celestial-pouch-of-dust',    'celestial', 'Pouch of Dust',    5,  1, 'spice', 0, 'Dust is spice for cooking',    'spice'),
('celestial-bone',             'celestial', 'Bone',             10, 1, 'bone',  0, NULL,                            'bone'),
('celestial-fat',              'celestial', 'Fat',              10, 1, 'fat',   0, NULL,                            'fat'),
('celestial-horn',             'celestial', 'Horn',             10, 0, NULL,   0, NULL,                            'horn'),
('celestial-pouch-of-teeth',   'celestial', 'Pouch of Teeth',   10, 0, NULL,   0, NULL,                            'teeth'),
('celestial-heart',            'celestial', 'Heart',            15, 1, 'heart', 0, NULL,                            'heart'),
('celestial-liver',            'celestial', 'Liver',            15, 1, 'liver', 0, NULL,                            'liver'),
('celestial-pouch-of-feathers','celestial', 'Pouch of Feathers',15, 0, NULL,   0, NULL,                            'feathers'),
('celestial-pouch-of-scales',  'celestial', 'Pouch of Scales',  15, 0, NULL,   0, NULL,                            'scales'),
('celestial-brain',            'celestial', 'Brain',            20, 1, 'brain', 0, NULL,                            'brain'),
('celestial-skin',             'celestial', 'Skin',             20, 0, NULL,   0, NULL,                            'skin'),
('celestial-soul',             'celestial', 'Soul',             25, 0, NULL,   1, 'Volatile: must be slain on home plane or within magic circle', NULL),

-- -------- CONSTRUCT -----------------------------------------
('construct-phial-of-blood',  'construct', 'Phial of Blood',  5,  1, 'blood', 0, NULL,                             'blood'),
('construct-phial-of-oil',    'construct', 'Phial of Oil',    5,  1, 'fat',   0, 'Oil is fat for cooking',         'fat'),
('construct-flesh',           'construct', 'Flesh',           10, 1, 'flesh', 0, NULL,                             'flesh'),
('construct-plating',         'construct', 'Plating',         10, 0, NULL,   0, NULL,                             NULL),
('construct-stone',           'construct', 'Stone',           10, 0, NULL,   0, NULL,                             NULL),
('construct-bone',            'construct', 'Bone',            15, 1, 'bone',  0, NULL,                             'bone'),
('construct-gears',           'construct', 'Gears',           15, 0, NULL,   0, NULL,                             NULL),
('construct-heart',           'construct', 'Heart',           15, 1, 'heart', 0, NULL,                             'heart'),
('construct-liver',           'construct', 'Liver',           15, 1, 'liver', 0, NULL,                             'liver'),
('construct-brain',           'construct', 'Brain',           20, 1, 'brain', 0, NULL,                             'brain'),
('construct-instructions',    'construct', 'Instructions',    20, 0, NULL,   0, NULL,                             NULL),
('construct-lifespark',       'construct', 'Lifespark',       25, 0, NULL,   1, 'Volatile: triggers area effect on partial harvest', NULL),

-- -------- DRAGON --------------------------------------------
('dragon-eye',             'dragon', 'Eye',             5,  1, 'eye',   0, NULL,                                            'eye'),
('dragon-flesh',           'dragon', 'Flesh',           5,  1, 'flesh', 0, NULL,                                            'flesh'),
('dragon-phial-of-blood',  'dragon', 'Phial of Blood',  5,  1, 'blood', 0, NULL,                                            'blood'),
('dragon-bone',            'dragon', 'Bone',            10, 1, 'bone',  0, NULL,                                            'bone'),
('dragon-egg',             'dragon', 'Egg',             10, 1, 'egg',   0, NULL,                                            'egg'),
('dragon-fat',             'dragon', 'Fat',             10, 1, 'fat',   0, NULL,                                            'fat'),
('dragon-pouch-of-claws',  'dragon', 'Pouch of Claws',  10, 0, NULL,   0, NULL,                                            'claws'),
('dragon-pouch-of-teeth',  'dragon', 'Pouch of Teeth',  10, 0, NULL,   0, NULL,                                            'teeth'),
('dragon-horn',            'dragon', 'Horn',            15, 0, NULL,   0, NULL,                                            'horn'),
('dragon-liver',           'dragon', 'Liver',           15, 1, 'liver', 0, NULL,                                            'liver'),
('dragon-pouch-of-scales', 'dragon', 'Pouch of Scales', 15, 0, NULL,   0, NULL,                                            'scales'),
('dragon-heart',           'dragon', 'Heart',           20, 1, 'heart', 0, NULL,                                            'heart'),
('dragon-breath-sac',      'dragon', 'Breath Sac',      25, 0, NULL,   1, 'Volatile: triggers breath weapon on partial harvest', NULL),

-- -------- ELEMENTAL -----------------------------------------
('elemental-eye',            'elemental', 'Eye',            5,  1, 'eye',   0, NULL,                                                                  'eye'),
('elemental-primordial-dust','elemental', 'Primordial Dust',5,  1, 'spice', 0, 'Primordial dust is spice for cooking',                               'spice'),
('elemental-bone',           'elemental', 'Bone',           10, 1, 'bone',  0, NULL,                                                                  'bone'),
('elemental-volatile-mote',  'elemental', 'Volatile Mote (Air/Earth/Fire/Water)', 15, 0, NULL, 1, 'Volatile: triggers elemental burst on partial harvest',        NULL),
('elemental-core',           'elemental', 'Core (Air/Earth/Fire/Water)',          25, 0, NULL, 1, 'Volatile: triggers powerful elemental burst on partial harvest', NULL),

-- -------- FEY -----------------------------------------------
('fey-antenna',         'fey', 'Antenna',         5,  1, 'eye',   0, 'Antennae can be used as eyes for cooking', 'eye'),
('fey-eye',             'fey', 'Eye',             5,  1, 'eye',   0, NULL,                                        'eye'),
('fey-flesh',           'fey', 'Flesh',           5,  1, 'flesh', 0, NULL,                                        'flesh'),
('fey-hair',            'fey', 'Hair',            5,  0, NULL,   0, NULL,                                        'hair'),
('fey-phial-of-blood',  'fey', 'Phial of Blood',  5,  1, 'blood', 0, NULL,                                        'blood'),
('fey-antler',          'fey', 'Antler',          10, 0, NULL,   0, 'Used for monster-forged items only',         'antler'),
('fey-beak',            'fey', 'Beak',            10, 0, NULL,   0, NULL,                                        'beak'),
('fey-bone',            'fey', 'Bone',            10, 1, 'bone',  0, NULL,                                        'bone'),
('fey-egg',             'fey', 'Egg',             10, 1, 'egg',   0, NULL,                                        'egg'),
('fey-horn',            'fey', 'Horn',            10, 0, NULL,   0, 'Used for monster-forged items only',         'horn'),
('fey-pouch-of-claws',  'fey', 'Pouch of Claws',  10, 0, NULL,   0, 'Used for monster-forged items only',         'claws'),
('fey-pouch-of-teeth',  'fey', 'Pouch of Teeth',  10, 0, NULL,   0, NULL,                                        'teeth'),
('fey-talon',           'fey', 'Talon',           10, 0, NULL,   0, 'Used for monster-forged items only',         'talon'),
('fey-tusk',            'fey', 'Tusk',            10, 0, NULL,   0, 'Used for monster-forged items only',         'tusk'),
('fey-heart',           'fey', 'Heart',           15, 1, 'heart', 0, NULL,                                        'heart'),
('fey-fat',             'fey', 'Fat',             15, 1, 'fat',   0, NULL,                                        'fat'),
('fey-liver',           'fey', 'Liver',           15, 1, 'liver', 0, NULL,                                        'liver'),
('fey-poison-gland',    'fey', 'Poison Gland',    15, 0, NULL,   0, NULL,                                        'poison-gland'),
('fey-pouch-of-feathers','fey','Pouch of Feathers',15, 0, NULL,  0, NULL,                                        'feathers'),
('fey-pouch-of-scales', 'fey', 'Pouch of Scales', 15, 0, NULL,   0, NULL,                                        'scales'),
('fey-tentacle',        'fey', 'Tentacle',        15, 0, NULL,   0, NULL,                                        'tentacle'),
('fey-tongue',          'fey', 'Tongue',          15, 0, NULL,   0, NULL,                                        NULL),
('fey-brain',           'fey', 'Brain',           20, 1, 'brain', 0, NULL,                                        'brain'),
('fey-pelt',            'fey', 'Pelt',            20, 0, NULL,   0, NULL,                                        'pelt'),
('fey-pouch-of-dust',   'fey', 'Pouch of Dust',   20, 1, 'eye',  0, 'Fey dust is used as eyes for cooking',      'eye'),
('fey-skin',            'fey', 'Skin',            20, 0, NULL,   0, NULL,                                        'skin'),
('fey-psyche',          'fey', 'Psyche',          25, 0, NULL,   1, 'Volatile: triggers psychic effect on partial harvest', NULL),

-- -------- FIEND ---------------------------------------------
('fiend-eye',               'fiend', 'Eye',               5,  1, 'eye',   0, NULL,                            'eye'),
('fiend-flesh',             'fiend', 'Flesh',             5,  1, 'flesh', 0, NULL,                            'flesh'),
('fiend-hair',              'fiend', 'Hair',              5,  0, NULL,   0, NULL,                            'hair'),
('fiend-phial-of-blood',    'fiend', 'Phial of Blood',    5,  1, 'blood', 0, NULL,                            'blood'),
('fiend-pouch-of-dust',     'fiend', 'Pouch of Dust',     5,  1, 'spice', 0, 'Fiend dust is spice for cooking', 'spice'),
('fiend-beak',              'fiend', 'Beak',              10, 0, NULL,   0, NULL,                            'beak'),
('fiend-bone',              'fiend', 'Bone',              10, 1, 'bone',  0, NULL,                            'bone'),
('fiend-horn',              'fiend', 'Horn',              10, 0, NULL,   0, NULL,                            'horn'),
('fiend-pouch-of-claws',    'fiend', 'Pouch of Claws',    10, 0, NULL,   0, NULL,                            'claws'),
('fiend-pouch-of-teeth',    'fiend', 'Pouch of Teeth',    10, 0, NULL,   0, NULL,                            'teeth'),
('fiend-fat',               'fiend', 'Fat',               15, 1, 'fat',   0, NULL,                            'fat'),
('fiend-heart',             'fiend', 'Heart',             15, 1, 'heart', 0, NULL,                            'heart'),
('fiend-liver',             'fiend', 'Liver',             15, 1, 'liver', 0, NULL,                            'liver'),
('fiend-poison-gland',      'fiend', 'Poison Gland',      15, 0, NULL,   0, NULL,                            'poison-gland'),
('fiend-pouch-of-feathers', 'fiend', 'Pouch of Feathers', 15, 0, NULL,   0, NULL,                            'feathers'),
('fiend-pouch-of-scales',   'fiend', 'Pouch of Scales',   15, 0, NULL,   0, NULL,                            'scales'),
('fiend-brain',             'fiend', 'Brain',             20, 1, 'brain', 0, NULL,                            'brain'),
('fiend-skin',              'fiend', 'Skin',              20, 0, NULL,   0, NULL,                            'skin'),
('fiend-soul',              'fiend', 'Soul',              25, 0, NULL,   1, 'Volatile: must be slain on home plane or within magic circle', NULL),

-- -------- GIANT ---------------------------------------------
('giant-flesh',          'giant', 'Flesh',          5,  1, 'flesh', 0, NULL,                                                     'flesh'),
('giant-hair',           'giant', 'Hair',           5,  0, NULL,   0, NULL,                                                     'hair'),
('giant-nail',           'giant', 'Nail',           5,  0, NULL,   0, NULL,                                                     NULL),
('giant-phial-of-blood', 'giant', 'Phial of Blood', 5,  1, 'blood', 0, NULL,                                                     'blood'),
('giant-bone',           'giant', 'Bone',           10, 1, 'bone',  0, NULL,                                                     'bone'),
('giant-fat',            'giant', 'Fat',            10, 1, 'fat',   0, NULL,                                                     'fat'),
('giant-tooth',          'giant', 'Tooth',          10, 0, NULL,   0, NULL,                                                     NULL),
('giant-heart',          'giant', 'Heart',          15, 1, 'heart', 1, 'Volatile AND edible: triggers area effect on partial harvest', 'heart'),
('giant-liver',          'giant', 'Liver',          15, 1, 'liver', 0, NULL,                                                     'liver'),
('giant-skin',           'giant', 'Skin',           20, 0, NULL,   0, NULL,                                                     'skin'),

-- -------- HUMANOID ------------------------------------------
('humanoid-eye',               'humanoid', 'Eye',               5,  0, NULL,   0, NULL, 'eye'),
('humanoid-phial-of-blood',    'humanoid', 'Phial of Blood',    5,  1, 'blood', 0, NULL, 'blood'),
('humanoid-bone',              'humanoid', 'Bone',              10, 1, 'bone',  0, NULL, 'bone'),
('humanoid-egg',               'humanoid', 'Egg',               10, 1, 'egg',   0, NULL, 'egg'),
('humanoid-pouch-of-teeth',    'humanoid', 'Pouch of Teeth',    10, 0, NULL,   0, NULL, 'teeth'),
('humanoid-heart',             'humanoid', 'Heart',             15, 1, 'heart', 0, NULL, 'heart'),
('humanoid-liver',             'humanoid', 'Liver',             15, 1, 'liver', 0, NULL, 'liver'),
('humanoid-pouch-of-feathers', 'humanoid', 'Pouch of Feathers', 15, 0, NULL,   0, NULL, 'feathers'),
('humanoid-pouch-of-scales',   'humanoid', 'Pouch of Scales',   15, 0, NULL,   0, NULL, 'scales'),
('humanoid-brain',             'humanoid', 'Brain',             20, 1, 'brain', 0, NULL, 'brain'),
('humanoid-skin',              'humanoid', 'Skin',              20, 0, NULL,   0, NULL, 'skin'),

-- -------- MONSTROSITY ---------------------------------------
('monstrosity-antenna',          'monstrosity', 'Antenna',           5,  1, 'eye',   0, 'Antennae can be used as eyes for cooking', 'eye'),
('monstrosity-eye',              'monstrosity', 'Eye',               5,  1, 'eye',   0, NULL,                                        'eye'),
('monstrosity-flesh',            'monstrosity', 'Flesh',             5,  1, 'flesh', 0, NULL,                                        'flesh'),
('monstrosity-hair',             'monstrosity', 'Hair',              5,  0, NULL,   0, NULL,                                        'hair'),
('monstrosity-phial-of-blood',   'monstrosity', 'Phial of Blood',    5,  1, 'blood', 0, NULL,                                        'blood'),
('monstrosity-antler',           'monstrosity', 'Antler',            10, 0, NULL,   0, NULL,                                        'antler'),
('monstrosity-beak',             'monstrosity', 'Beak',              10, 0, NULL,   0, NULL,                                        'beak'),
('monstrosity-bone',             'monstrosity', 'Bone',              10, 1, 'bone',  0, NULL,                                        'bone'),
('monstrosity-egg',              'monstrosity', 'Egg',               10, 1, 'egg',   0, NULL,                                        'egg'),
('monstrosity-fat',              'monstrosity', 'Fat',               10, 1, 'fat',   0, NULL,                                        'fat'),
('monstrosity-fin',              'monstrosity', 'Fin',               10, 0, NULL,   0, NULL,                                        'fin'),
('monstrosity-horn',             'monstrosity', 'Horn',              10, 0, NULL,   0, NULL,                                        'horn'),
('monstrosity-pincer',           'monstrosity', 'Pincer',            10, 0, NULL,   0, NULL,                                        'pincer'),
('monstrosity-pouch-of-claws',   'monstrosity', 'Pouch of Claws',    10, 0, NULL,   0, NULL,                                        'claws'),
('monstrosity-pouch-of-teeth',   'monstrosity', 'Pouch of Teeth',    10, 0, NULL,   0, NULL,                                        'teeth'),
('monstrosity-talon',            'monstrosity', 'Talon',             10, 0, NULL,   0, NULL,                                        'talon'),
('monstrosity-tusk',             'monstrosity', 'Tusk',              10, 0, NULL,   0, NULL,                                        'tusk'),
('monstrosity-heart',            'monstrosity', 'Heart',             15, 1, 'heart', 0, NULL,                                        'heart'),
('monstrosity-liver',            'monstrosity', 'Liver',             15, 1, 'liver', 0, NULL,                                        'liver'),
('monstrosity-poison-gland',     'monstrosity', 'Poison Gland',      15, 0, NULL,   0, NULL,                                        'poison-gland'),
('monstrosity-pouch-of-feathers','monstrosity', 'Pouch of Feathers', 15, 0, NULL,   0, NULL,                                        'feathers'),
('monstrosity-pouch-of-scales',  'monstrosity', 'Pouch of Scales',   15, 0, NULL,   0, NULL,                                        'scales'),
('monstrosity-stinger',          'monstrosity', 'Stinger',           15, 0, NULL,   0, NULL,                                        'stinger'),
('monstrosity-tentacle',         'monstrosity', 'Tentacle',          15, 0, NULL,   0, NULL,                                        'tentacle'),
('monstrosity-chitin',           'monstrosity', 'Chitin',            20, 0, NULL,   0, NULL,                                        'chitin'),
('monstrosity-pelt',             'monstrosity', 'Pelt',              20, 0, NULL,   0, NULL,                                        'pelt'),

-- -------- OOZE ----------------------------------------------
('ooze-phial-of-acid',  'ooze', 'Phial of Acid',  5,  1, 'blood', 0, 'Acid is blood for cooking',  'blood'),
('ooze-phial-of-mucus', 'ooze', 'Phial of Mucus', 10, 1, 'fat',   0, 'Mucus is fat for cooking',   'fat'),
('ooze-vesicle',        'ooze', 'Vesicle',         15, 1, 'liver', 0, 'Vesicles are livers for cooking', 'liver'),
('ooze-membrane',       'ooze', 'Membrane',        20, 0, NULL,   0, NULL,                          NULL),

-- -------- PLANT ---------------------------------------------
('plant-phial-of-sap',     'plant', 'Phial of Sap',     5,  1, 'blood', 0, 'Sap is blood for cooking',                         'blood'),
('plant-tuber',            'plant', 'Tuber',             5,  1, 'flesh', 0, 'Tuber is flesh for cooking',                       'flesh'),
('plant-bundle-of-roots',  'plant', 'Bundle of Roots',   10, 1, 'bone',  0, 'Roots are bones for cooking',                      'bone'),
('plant-phial-of-wax',     'plant', 'Phial of Wax',      10, 1, 'fat',   0, 'Wax is fat for cooking',                           'fat'),
('plant-pouch-of-hyphae',  'plant', 'Pouch of Hyphae',   10, 1, 'bone',  0, 'Hyphae are bones for cooking',                     'bone'),
('plant-pouch-of-leaves',  'plant', 'Pouch of Leaves',   10, 0, NULL,   0, NULL,                                               NULL),
('plant-pouch-of-seeds',   'plant', 'Pouch of Seeds',    10, 0, NULL,   0, NULL,                                               NULL),
('plant-poison-gland',     'plant', 'Poison Gland',      15, 1, 'liver', 0, 'Poison glands are livers for cooking',              'liver'),
('plant-pouch-of-pollen',  'plant', 'Pouch of Pollen',   15, 1, 'spice', 1, 'Volatile and edible: pollen is spice for cooking',  'spice'),
('plant-pouch-of-spores',  'plant', 'Pouch of Spores',   15, 1, 'spice', 1, 'Volatile and edible: spores are spice for cooking', 'spice'),
('plant-bark',             'plant', 'Bark',              20, 1, 'heart', 0, 'Bark is heart for cooking',                        'heart'),
('plant-membrane',         'plant', 'Membrane',          20, 1, 'heart', 0, 'Membrane is heart for cooking',                    'heart'),

-- -------- UNDEAD --------------------------------------------
('undead-bone',                    'undead', 'Bone',                    5,  1, 'bone',  0, NULL,                                                        'bone'),
('undead-eye',                     'undead', 'Eye',                     5,  1, 'eye',   0, NULL,                                                        'eye'),
('undead-phial-of-congealed-blood','undead', 'Phial of Congealed Blood',5,  1, 'blood', 0, 'Congealed blood is blood for cooking',                      'blood'),
('undead-marrow',                  'undead', 'Marrow',                  10, 0, NULL,   0, NULL,                                                        NULL),
('undead-pouch-of-teeth',          'undead', 'Pouch of Teeth',          10, 0, NULL,   0, NULL,                                                        'teeth'),
('undead-rancid-fat',              'undead', 'Rancid Fat',              10, 1, 'fat',   0, NULL,                                                        'fat'),
('undead-ethereal-ichor',          'undead', 'Ethereal Ichor',          15, 1, 'spice', 0, 'Ethereal ichor is spice for cooking',                       'spice'),
('undead-undying-flesh',           'undead', 'Undying Flesh',           15, 1, 'flesh', 0, NULL,                                                        'flesh'),
('undead-undying-heart',           'undead', 'Undying Heart',           20, 1, 'heart', 1, 'Volatile and edible: triggers necrotic burst on partial harvest', 'heart');

-- ============================================================
-- MAGIC ITEM RECIPES — POTIONS (pilot category)
-- Enchanting DC/Time for consumables:
--   common=12/0.5h, uncommon=15/4h, rare=18/20h,
--   very-rare=21/80h, legendary=25/320h
-- ============================================================

INSERT OR IGNORE INTO magic_item_recipes
  (id, name, category, rarity, item_value_gp, crafting_dc, crafting_time_hrs, essence_type, notes)
VALUES
  ('potion-oil-of-etherealness',           'Oil of Etherealness',            'potion','rare',       1900,  18, 20,   'robust', NULL),
  ('potion-oil-of-sharpness',              'Oil of Sharpness',               'potion','very-rare',  4800,  21, 80,   'potent', NULL),
  ('potion-oil-of-slipperiness',           'Oil of Slipperiness',            'potion','uncommon',    480,  15,  4,   'frail',  NULL),
  ('potion-philter-of-love',               'Philter of Love',                'potion','uncommon',    180,  15,  4,   'frail',  NULL),
  ('potion-of-animal-friendship',          'Potion of Animal Friendship',    'potion','uncommon',    200,  15,  4,   'frail',  NULL),
  ('potion-of-clairvoyance',               'Potion of Clairvoyance',         'potion','rare',        900,  18, 20,   'robust', NULL),
  ('potion-of-climbing',                   'Potion of Climbing',             'potion','common',       50,  12,  0.5, NULL,     NULL),
  ('potion-of-diminution',                 'Potion of Diminution',           'potion','uncommon',    270,  15,  4,   'frail',  'Can also be crafted as rare'),
  ('potion-of-flying',                     'Potion of Flying',               'potion','rare',        900,  18, 20,   'robust', NULL),
  ('potion-of-gaseous-form',               'Potion of Gaseous Form',         'potion','rare',        900,  18, 20,   'robust', NULL),
  ('potion-of-giant-strength-cloud',       'Potion of Giant Strength (Cloud)','potion','very-rare', 6000,  21, 80,   'potent', NULL),
  ('potion-of-giant-strength-fire',        'Potion of Giant Strength (Fire)', 'potion','rare',      3000,  18, 20,   'robust', NULL),
  ('potion-of-giant-strength-frost',       'Potion of Giant Strength (Frost)','potion','rare',      1500,  18, 20,   'robust', NULL),
  ('potion-of-giant-strength-hill',        'Potion of Giant Strength (Hill)', 'potion','uncommon',   500,  15,  4,   'frail',  NULL),
  ('potion-of-giant-strength-stone',       'Potion of Giant Strength (Stone)','potion','rare',      1500,  18, 20,   'robust', NULL),
  ('potion-of-giant-strength-storm',       'Potion of Giant Strength (Storm)','potion','legendary',30000,  25, 320,  'mythic', NULL),
  ('potion-of-growth',                     'Potion of Growth',               'potion','uncommon',    270,  15,  4,   'frail',  NULL),
  ('potion-of-healing',                    'Potion of Healing',              'potion','common',       50,  12,  0.5, NULL,     NULL),
  ('potion-of-greater-healing',            'Potion of Greater Healing',      'potion','uncommon',    250,  15,  4,   'frail',  NULL),
  ('potion-of-superior-healing',           'Potion of Superior Healing',     'potion','rare',       1000,  18, 20,   'robust', NULL),
  ('potion-of-supreme-healing',            'Potion of Supreme Healing',      'potion','very-rare',  5000,  21, 80,   'potent', NULL),
  ('potion-of-heroism',                    'Potion of Heroism',              'potion','uncommon',    180,  15,  4,   'frail',  'Can also be crafted as rare'),
  ('potion-of-invisibility',               'Potion of Invisibility',         'potion','rare',        900,  18, 20,   'robust', 'Can also be crafted as very-rare'),
  ('potion-of-mind-reading',               'Potion of Mind Reading',         'potion','uncommon',    180,  15,  4,   'frail',  'Can also be crafted as rare'),
  ('potion-of-poison',                     'Potion of Poison',               'potion','uncommon',    180,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-acid',            'Potion of Resistance (Acid)',    'potion','uncommon',    240,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-cold',            'Potion of Resistance (Cold)',    'potion','uncommon',    240,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-fire',            'Potion of Resistance (Fire)',    'potion','uncommon',    300,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-force',           'Potion of Resistance (Force)',   'potion','uncommon',    240,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-lightning',       'Potion of Resistance (Lightning)','potion','uncommon',  240,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-necrotic',        'Potion of Resistance (Necrotic)','potion','uncommon',   240,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-poison',          'Potion of Resistance (Poison)',  'potion','uncommon',    300,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-psychic',         'Potion of Resistance (Psychic)', 'potion','uncommon',    220,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-radiant',         'Potion of Resistance (Radiant)', 'potion','uncommon',    220,  15,  4,   'frail',  NULL),
  ('potion-of-resistance-thunder',         'Potion of Resistance (Thunder)', 'potion','uncommon',    220,  15,  4,   'frail',  NULL),
  ('potion-of-speed',                      'Potion of Speed',                'potion','very-rare',  4800,  21, 80,   'potent', NULL),
  ('potion-of-water-breathing',            'Potion of Water Breathing',      'potion','uncommon',    180,  15,  4,   'frail',  NULL);

-- ============================================================
-- MAGIC ITEM COMPONENTS — POTIONS
-- ============================================================

INSERT OR IGNORE INTO magic_item_components (recipe_id, creature_type_id, component_name, metatag, quantity) VALUES
  -- Oil of Etherealness: Undead → Ethereal Ichor
  ('potion-oil-of-etherealness',        'undead',       'Ethereal Ichor',                NULL,        1),
  -- Oil of Sharpness: Fey → Fat
  ('potion-oil-of-sharpness',           'fey',          'Fat',                           NULL,        1),
  -- Oil of Slipperiness: Construct → Phial of Oil
  ('potion-oil-of-slipperiness',        'construct',    'Phial of Oil',                  NULL,        1),
  -- Philter of Love: Fey → Phial of Blood
  ('potion-philter-of-love',            'fey',          'Phial of Blood',                NULL,        1),
  -- Potion of Animal Friendship: Beast → Phial of Blood
  ('potion-of-animal-friendship',       'beast',        'Phial of Blood',                NULL,        1),
  -- Potion of Clairvoyance: Celestial → Eye
  ('potion-of-clairvoyance',            'celestial',    'Eye',                           NULL,        1),
  -- Potion of Climbing: Beast (Spider) → Pouch of Claws
  ('potion-of-climbing',                'beast',        'Pouch of Claws',                'Spider',    1),
  -- Potion of Diminution: Humanoid (Gnome) → Phial of Blood
  ('potion-of-diminution',              'humanoid',     'Phial of Blood',                'Gnome',     1),
  -- Potion of Flying: Dragon → Fat
  ('potion-of-flying',                  'dragon',       'Fat',                           NULL,        1),
  -- Potion of Gaseous Form: Ooze → Vesicle
  ('potion-of-gaseous-form',            'ooze',         'Vesicle',                       NULL,        1),
  -- Potion of Giant Strength (Cloud): Giant (Cloud) → Nail
  ('potion-of-giant-strength-cloud',    'giant',        'Nail',                          'Cloud',     1),
  -- Potion of Giant Strength (Fire): Giant (Fire) → Nail
  ('potion-of-giant-strength-fire',     'giant',        'Nail',                          'Fire',      1),
  -- Potion of Giant Strength (Frost): Giant (Frost) → Nail
  ('potion-of-giant-strength-frost',    'giant',        'Nail',                          'Frost',     1),
  -- Potion of Giant Strength (Hill): Giant (Hill) → Nail
  ('potion-of-giant-strength-hill',     'giant',        'Nail',                          'Hill',      1),
  -- Potion of Giant Strength (Stone): Giant (Stone) → Nail
  ('potion-of-giant-strength-stone',    'giant',        'Nail',                          'Stone',     1),
  -- Potion of Giant Strength (Storm): Giant (Storm) → Nail
  ('potion-of-giant-strength-storm',    'giant',        'Nail',                          'Storm',     1),
  -- Potion of Growth: Giant → Phial of Blood
  ('potion-of-growth',                  'giant',        'Phial of Blood',                NULL,        1),
  -- Potion of Healing: Beast → Fat
  ('potion-of-healing',                 'beast',        'Fat',                           NULL,        1),
  -- Potion of Greater Healing: Beast → Liver
  ('potion-of-greater-healing',         'beast',        'Liver',                         NULL,        1),
  -- Potion of Superior Healing: Monstrosity → Liver
  ('potion-of-superior-healing',        'monstrosity',  'Liver',                         NULL,        1),
  -- Potion of Supreme Healing: Monstrosity → Fat + Liver
  ('potion-of-supreme-healing',         'monstrosity',  'Fat',                           NULL,        1),
  ('potion-of-supreme-healing',         'monstrosity',  'Liver',                         NULL,        1),
  -- Potion of Heroism: Celestial → Phial of Blood
  ('potion-of-heroism',                 'celestial',    'Phial of Blood',                NULL,        1),
  -- Potion of Invisibility: Humanoid (Duergar) → Skin
  ('potion-of-invisibility',            'humanoid',     'Skin',                          'Duergar',   1),
  -- Potion of Mind Reading: Aberration (Aboleth) → Phial of Mucus
  ('potion-of-mind-reading',            'aberration',   'Phial of Mucus',                'Aboleth',   1),
  -- Potion of Poison: Plant → Poison Gland
  ('potion-of-poison',                  'plant',        'Poison Gland',                  NULL,        1),
  -- Potion of Resistance (Acid): Elemental → Volatile Mote of Water
  ('potion-of-resistance-acid',         'elemental',    'Volatile Mote (Air/Earth/Fire/Water)', NULL, 1),
  -- Potion of Resistance (Cold): Fiend (Ice devil) → Fat
  ('potion-of-resistance-cold',         'fiend',        'Fat',                           'Ice devil', 1),
  -- Potion of Resistance (Fire): Fiend (Hell hound) → Fat
  ('potion-of-resistance-fire',         'fiend',        'Fat',                           'Hell hound',1),
  -- Potion of Resistance (Force): Aberration → Fat
  ('potion-of-resistance-force',        'aberration',   'Fat',                           NULL,        1),
  -- Potion of Resistance (Lightning): Construct (Flesh golem) → Phial of Blood
  ('potion-of-resistance-lightning',    'construct',    'Phial of Blood',                'Flesh golem',1),
  -- Potion of Resistance (Necrotic): Undead → Phial of Congealed Blood
  ('potion-of-resistance-necrotic',     'undead',       'Phial of Congealed Blood',      NULL,        1),
  -- Potion of Resistance (Poison): Fiend (Bearded devil) → Fat
  ('potion-of-resistance-poison',       'fiend',        'Fat',                           'Bearded devil',1),
  -- Potion of Resistance (Psychic): Aberration (Dreamholder) → Fat
  ('potion-of-resistance-psychic',      'aberration',   'Fat',                           'Dreamholder',1),
  -- Potion of Resistance (Radiant): Celestial (Couatl) → Fat
  ('potion-of-resistance-radiant',      'celestial',    'Fat',                           'Couatl',    1),
  -- Potion of Resistance (Thunder): Giant (Storm) → Fat
  ('potion-of-resistance-thunder',      'giant',        'Fat',                           'Storm',     1),
  -- Potion of Speed: Fey → Liver
  ('potion-of-speed',                   'fey',          'Liver',                         NULL,        1),
  -- Potion of Water Breathing: Beast → Fin
  ('potion-of-water-breathing',         'beast',        'Fin',                           NULL,        1);
