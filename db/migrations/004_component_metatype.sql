-- Migration 004: Add component_metatype to harvest_components
-- Groups physically identical parts across creature types for unified inventory views.

ALTER TABLE harvest_components ADD COLUMN component_metatype TEXT;

-- Edible items: metatype = edible_as (the cooking type they map to)
UPDATE harvest_components SET component_metatype = edible_as WHERE is_edible = 1;

-- Non-edible generics: same part appearing across ≥2 creature types
UPDATE harvest_components SET component_metatype = 'eye'          WHERE name = 'Eye'              AND is_edible = 0;
UPDATE harvest_components SET component_metatype = 'teeth'        WHERE name = 'Pouch of Teeth';
UPDATE harvest_components SET component_metatype = 'claws'        WHERE name = 'Pouch of Claws';
UPDATE harvest_components SET component_metatype = 'scales'       WHERE name = 'Pouch of Scales';
UPDATE harvest_components SET component_metatype = 'feathers'     WHERE name = 'Pouch of Feathers';
UPDATE harvest_components SET component_metatype = 'horn'         WHERE name = 'Horn';
UPDATE harvest_components SET component_metatype = 'hair'         WHERE name = 'Hair';
UPDATE harvest_components SET component_metatype = 'skin'         WHERE name = 'Skin';
UPDATE harvest_components SET component_metatype = 'tentacle'     WHERE name = 'Tentacle';
UPDATE harvest_components SET component_metatype = 'beak'         WHERE name = 'Beak';
UPDATE harvest_components SET component_metatype = 'chitin'       WHERE name = 'Chitin';
UPDATE harvest_components SET component_metatype = 'pelt'         WHERE name = 'Pelt';
UPDATE harvest_components SET component_metatype = 'antler'       WHERE name = 'Antler';
UPDATE harvest_components SET component_metatype = 'fin'          WHERE name = 'Fin';
UPDATE harvest_components SET component_metatype = 'pincer'       WHERE name = 'Pincer';
UPDATE harvest_components SET component_metatype = 'talon'        WHERE name = 'Talon';
UPDATE harvest_components SET component_metatype = 'tusk'         WHERE name = 'Tusk';
UPDATE harvest_components SET component_metatype = 'stinger'      WHERE name = 'Stinger';
UPDATE harvest_components SET component_metatype = 'poison-gland' WHERE name = 'Poison Gland'     AND is_edible = 0;
