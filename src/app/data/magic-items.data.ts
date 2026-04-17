import { MagicItem } from '../models/magic-item.model';

export const MAGIC_ITEMS: MagicItem[] = [
  { id: '1-ammunition-unc', name: '+1 Ammunition *', category: 'ammunition', rarity: 'uncommon', itemValueGp: 25, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: '2-ammunition-rar', name: '+2 Ammunition *', category: 'ammunition', rarity: 'rare', itemValueGp: 100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: '3-ammunition-ver', name: '+3 Ammunition *', category: 'ammunition', rarity: 'very-rare', itemValueGp: 480, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'arrow-of-slaying-ver', name: 'Arrow of Slaying (**)', category: 'ammunition', rarity: 'very-rare', itemValueGp: 550, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: null, componentName: 'Phial of acid/blood/sap or primordial dust **', metatag: null, quantity: 1 }
  ] },
  { id: 'breastplank-unc', name: 'Breastplank', category: 'armour', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Skin', metatag: 'Tavern mimic', quantity: 1 }
  ] },
  { id: 'breastplank-rar', name: 'Breastplank', category: 'armour', rarity: 'rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Skin', metatag: 'Tavern mimic', quantity: 1 }
  ] },
  { id: 'breastplank-ver', name: 'Breastplank', category: 'armour', rarity: 'very-rare', itemValueGp: 11500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Skin', metatag: 'Tavern mimic', quantity: 1 }
  ] },
  { id: '1-armor-rar', name: '+1 Armor', category: 'armour', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Bone', metatag: 'Dinosaur', quantity: 1 }
  ] },
  { id: '2-armor-ver', name: '+2 Armor', category: 'armour', rarity: 'very-rare', itemValueGp: 6500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Bone', metatag: 'Gorgon', quantity: 1 }
  ] },
  { id: '3-armor-leg', name: '+3 Armor', category: 'armour', rarity: 'legendary', itemValueGp: 28800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Bone', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'adamantine-armor-unc', name: 'Adamantine Armor', category: 'armour', rarity: 'uncommon', itemValueGp: 500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: null, componentName: 'Adamantine', metatag: null, quantity: 1 }
  ] },
  { id: 'adamantine-armor-acid-unc', name: 'Adamantine Armor (Acid)', category: 'armour', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Membrane', metatag: 'Black pudding', quantity: 1 }
  ] },
  { id: 'adamantine-armor-cold-unc', name: 'Adamantine Armor (Cold)', category: 'armour', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Skin', metatag: 'Ice devil', quantity: 1 }
  ] },
  { id: 'adamantine-armor-fire-unc', name: 'Adamantine Armor (Fire)', category: 'armour', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Bone', metatag: 'Salamander', quantity: 1 }
  ] },
  { id: 'adamantine-armor-force-unc', name: 'Adamantine Armor (Force)', category: 'armour', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Bone', metatag: 'Golem', quantity: 1 }
  ] },
  { id: 'adamantine-armor-lightning-unc', name: 'Adamantine Armor (Lightning)', category: 'armour', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Bone', metatag: 'Djinni', quantity: 1 }
  ] },
  { id: 'adamantine-armor-necrotic-unc', name: 'Adamantine Armor (Necrotic)', category: 'armour', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Undying flesh', metatag: 'Mummy', quantity: 1 }
  ] },
  { id: 'adamantine-armor-poison-unc', name: 'Adamantine Armor (Poison)', category: 'armour', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Liver', metatag: 'Naga', quantity: 1 }
  ] },
  { id: 'adamantine-armor-psychic-unc', name: 'Adamantine Armor (Psychic)', category: 'armour', rarity: 'uncommon', itemValueGp: 1100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Brain', metatag: 'Aboleth', quantity: 1 }
  ] },
  { id: 'adamantine-armor-radiant-unc', name: 'Adamantine Armor (Radiant)', category: 'armour', rarity: 'uncommon', itemValueGp: 1100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Bone', metatag: 'Planetar', quantity: 1 }
  ] },
  { id: 'adamantine-armor-thunder-unc', name: 'Adamantine Armor (Thunder)', category: 'armour', rarity: 'uncommon', itemValueGp: 1100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Bone', metatag: 'Storm', quantity: 1 }
  ] },
  { id: 'mithral-armor-unc', name: 'Mithral Armor', category: 'armour', rarity: 'uncommon', itemValueGp: 400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: null, componentName: 'Mithral', metatag: null, quantity: 1 }
  ] },
  { id: 'armor-of-invulnerability-leg', name: 'Armor of Invulnerability', category: 'armour', rarity: 'legendary', itemValueGp: 18000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Plating', metatag: 'Golem', quantity: 1 }
  ] },
  { id: 'demon-armor-rar', name: 'Demon Armor', category: 'armour', rarity: 'rare', itemValueGp: 3000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Bone', metatag: 'Demon', quantity: 1 }
  ] },
  { id: 'dwarven-plate-ver', name: 'Dwarven Plate', category: 'armour', rarity: 'very-rare', itemValueGp: 6500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-rar', name: 'Glamoured Studded Leather', category: 'armour', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Phial of blood', metatag: 'Hag', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-black-ver', name: 'Glamoured Studded Leather (Black)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Black', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-blue-ver', name: 'Glamoured Studded Leather (Blue)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Blue', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-brass-ver', name: 'Glamoured Studded Leather (Brass)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Brass', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-bronze-ver', name: 'Glamoured Studded Leather (Bronze)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Bronze', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-copper-ver', name: 'Glamoured Studded Leather (Copper)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Copper', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-gold-ver', name: 'Glamoured Studded Leather (Gold)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Gold', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-green-ver', name: 'Glamoured Studded Leather (Green)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Green', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-red-ver', name: 'Glamoured Studded Leather (Red)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Red', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-silver-ver', name: 'Glamoured Studded Leather (Silver)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Silver', quantity: 1 }
  ] },
  { id: 'glamoured-studded-leather-white-ver', name: 'Glamoured Studded Leather (White)', category: 'armour', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'White', quantity: 1 }
  ] },
  { id: 'elven-chain-rar', name: 'Elven Chain', category: 'armour', rarity: 'rare', itemValueGp: 2500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Pouch of scales', metatag: null, quantity: 1 }
  ] },
  { id: 'haemscale-unc', name: 'Haemscale', category: 'armour', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'haemscale-rar', name: 'Haemscale', category: 'armour', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'haemscale-leg', name: 'Haemscale', category: 'armour', rarity: 'legendary', itemValueGp: 52000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'armor-of-vulnerability-unc', name: 'Armor of Vulnerability', category: 'armour', rarity: 'uncommon', itemValueGp: 500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'plate-armor-of-etherealness-leg', name: 'Plate Armor of Etherealness', category: 'armour', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Ethereal ichor', metatag: null, quantity: 1 }
  ] },
  { id: 'animated-shield-rar', name: 'Animated Shield', category: 'armour', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Instructions', metatag: 'Animated', quantity: 1 }
  ] },
  { id: 'arrow-catching-shield-rar', name: 'Arrow-Catching Shield', category: 'armour', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Skin', metatag: null, quantity: 1 }
  ] },
  { id: 'shield-of-missile-attraction-rar', name: 'Shield of Missile Attraction', category: 'armour', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Horn', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'spellguard-shield-ver', name: 'Spellguard Shield', category: 'armour', rarity: 'very-rare', itemValueGp: 25000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Plating', metatag: 'Shield guardian', quantity: 1 }
  ] },
  { id: '1-shield-rar', name: '+1 Shield', category: 'armour', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of scales', metatag: 'Beetle', quantity: 1 }
  ] },
  { id: '2-shield-ver', name: '+2 Shield', category: 'armour', rarity: 'very-rare', itemValueGp: 6500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of scales', metatag: 'Bulette', quantity: 1 }
  ] },
  { id: '3-shield-leg', name: '+3 Shield', category: 'armour', rarity: 'legendary', itemValueGp: 28800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of scales', metatag: null, quantity: 1 }
  ] },
  { id: 'oil-of-etherealness-rar', name: 'Oil of Etherealness', category: 'potion', rarity: 'rare', itemValueGp: 1900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Ethereal ichor', metatag: null, quantity: 1 }
  ] },
  { id: 'oil-of-sharpness-ver', name: 'Oil of Sharpness', category: 'potion', rarity: 'very-rare', itemValueGp: 4800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Fat', metatag: null, quantity: 1 }
  ] },
  { id: 'oil-of-slipperiness-unc', name: 'Oil of Slipperiness', category: 'potion', rarity: 'uncommon', itemValueGp: 480, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Phial of oil', metatag: null, quantity: 1 }
  ] },
  { id: 'philter-of-love-unc', name: 'Philter of Love', category: 'potion', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-animal-friendship-unc', name: 'Potion of Animal Friendship', category: 'potion', rarity: 'uncommon', itemValueGp: 200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-clairvoyance-rar', name: 'Potion of Clairvoyance', category: 'potion', rarity: 'rare', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-climbing-com', name: 'Potion of Climbing', category: 'potion', rarity: 'common', itemValueGp: 50, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of claws', metatag: 'Spider', quantity: 1 }
  ] },
  { id: 'potion-of-diminution-unc', name: 'Potion of Diminution', category: 'potion', rarity: 'uncommon', itemValueGp: 270, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Phial of blood', metatag: 'Gnome', quantity: 1 }
  ] },
  { id: 'potion-of-flying-rar', name: 'Potion of Flying', category: 'potion', rarity: 'rare', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Fat', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-gaseous-form-rar', name: 'Potion of Gaseous Form', category: 'potion', rarity: 'rare', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Vesicle', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-gaseous-form-cloud-ver', name: 'Potion of Gaseous Form (Cloud)', category: 'potion', rarity: 'very-rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Nail', metatag: 'Cloud', quantity: 1 }
  ] },
  { id: 'potion-of-gaseous-form-fire-rar', name: 'Potion of Gaseous Form (Fire)', category: 'potion', rarity: 'rare', itemValueGp: 3000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Nail', metatag: 'Fire', quantity: 1 }
  ] },
  { id: 'potion-of-gaseous-form-frost-rar', name: 'Potion of Gaseous Form (Frost)', category: 'potion', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Nail', metatag: 'Frost', quantity: 1 }
  ] },
  { id: 'potion-of-gaseous-form-hill-unc', name: 'Potion of Gaseous Form (Hill)', category: 'potion', rarity: 'uncommon', itemValueGp: 500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Nail', metatag: 'Hill', quantity: 1 }
  ] },
  { id: 'potion-of-gaseous-form-stone-rar', name: 'Potion of Gaseous Form (Stone)', category: 'potion', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Nail', metatag: 'Stone', quantity: 1 }
  ] },
  { id: 'potion-of-gaseous-form-storm-leg', name: 'Potion of Gaseous Form (Storm)', category: 'potion', rarity: 'legendary', itemValueGp: 30000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Nail', metatag: 'Storm', quantity: 1 }
  ] },
  { id: 'potion-of-growth-unc', name: 'Potion of Growth', category: 'potion', rarity: 'uncommon', itemValueGp: 270, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-growth-healing-com', name: 'Potion of Growth (Healing)', category: 'potion', rarity: 'common', itemValueGp: 50, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Fat', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-growth-greater-unc', name: 'Potion of Growth (Greater)', category: 'potion', rarity: 'uncommon', itemValueGp: 250, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Liver', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-growth-superior-rar', name: 'Potion of Growth (Superior)', category: 'potion', rarity: 'rare', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Liver', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-growth-supreme-ver', name: 'Potion of Growth (Supreme)', category: 'potion', rarity: 'very-rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Fat and Liver', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-heroism-unc', name: 'Potion of Heroism', category: 'potion', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-invisibility-rar', name: 'Potion of Invisibility', category: 'potion', rarity: 'rare', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Skin', metatag: 'Duergar', quantity: 1 }
  ] },
  { id: 'potion-of-mind-reading-unc', name: 'Potion of Mind Reading', category: 'potion', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Phial of mucous', metatag: 'Aboleth', quantity: 1 }
  ] },
  { id: 'potion-of-poison-unc', name: 'Potion of Poison', category: 'potion', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Poison gland', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-poison-acid-unc', name: 'Potion of Poison (Acid)', category: 'potion', rarity: 'uncommon', itemValueGp: 240, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Volatile mote of water', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-poison-cold-unc', name: 'Potion of Poison (Cold)', category: 'potion', rarity: 'uncommon', itemValueGp: 240, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Fat', metatag: 'Ice devil', quantity: 1 }
  ] },
  { id: 'potion-of-poison-fire-unc', name: 'Potion of Poison (Fire)', category: 'potion', rarity: 'uncommon', itemValueGp: 300, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Fat', metatag: 'Hell hound', quantity: 1 }
  ] },
  { id: 'potion-of-poison-force-unc', name: 'Potion of Poison (Force)', category: 'potion', rarity: 'uncommon', itemValueGp: 240, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Fat', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-poison-lightning-unc', name: 'Potion of Poison (Lightning)', category: 'potion', rarity: 'uncommon', itemValueGp: 240, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Phial of blood', metatag: 'Flesh golem', quantity: 1 }
  ] },
  { id: 'potion-of-poison-necrotic-unc', name: 'Potion of Poison (Necrotic)', category: 'potion', rarity: 'uncommon', itemValueGp: 240, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Phial of congealed blood', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-poison-poison-unc', name: 'Potion of Poison (Poison)', category: 'potion', rarity: 'uncommon', itemValueGp: 300, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Fat', metatag: 'Bearded devil', quantity: 1 }
  ] },
  { id: 'potion-of-poison-psychic-unc', name: 'Potion of Poison (Psychic)', category: 'potion', rarity: 'uncommon', itemValueGp: 220, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Fat', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'potion-of-poison-radiant-unc', name: 'Potion of Poison (Radiant)', category: 'potion', rarity: 'uncommon', itemValueGp: 220, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Fat', metatag: 'Couatl', quantity: 1 }
  ] },
  { id: 'potion-of-poison-thunder-unc', name: 'Potion of Poison (Thunder)', category: 'potion', rarity: 'uncommon', itemValueGp: 220, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Fat', metatag: 'Storm', quantity: 1 }
  ] },
  { id: 'potion-of-speed-ver', name: 'Potion of Speed', category: 'potion', rarity: 'very-rare', itemValueGp: 4800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Liver', metatag: null, quantity: 1 }
  ] },
  { id: 'potion-of-water-breathing-unc', name: 'Potion of Water Breathing', category: 'potion', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Fin', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-animal-influence-rar', name: 'Ring of Animal Influence', category: 'ring', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Heart', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-djinni-summoning-leg', name: 'Ring of Djinni Summoning', category: 'ring', rarity: 'legendary', itemValueGp: 90000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of air', metatag: 'Djinni', quantity: 1 }
  ] },
  { id: 'ring-of-djinni-summoning-air-leg', name: 'Ring of Djinni Summoning (Air)', category: 'ring', rarity: 'legendary', itemValueGp: 35000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of air', metatag: 'Air elemental', quantity: 1 }
  ] },
  { id: 'ring-of-djinni-summoning-earth-leg', name: 'Ring of Djinni Summoning (Earth)', category: 'ring', rarity: 'legendary', itemValueGp: 35000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of earth', metatag: 'Earth elem1ental', quantity: 1 }
  ] },
  { id: 'ring-of-djinni-summoning-fire-leg', name: 'Ring of Djinni Summoning (Fire)', category: 'ring', rarity: 'legendary', itemValueGp: 35000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of fire', metatag: 'Fire elemental', quantity: 1 }
  ] },
  { id: 'ring-of-djinni-summoning-water-leg', name: 'Ring of Djinni Summoning (Water)', category: 'ring', rarity: 'legendary', itemValueGp: 35000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of water', metatag: 'Water elemental', quantity: 1 }
  ] },
  { id: 'ring-of-evasion-rar', name: 'Ring of Evasion', category: 'ring', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Pouch of feathers', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-feather-falling-rar', name: 'Ring of Feather Falling', category: 'ring', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of feathers', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-free-action-ver', name: 'Ring of Free Action', category: 'ring', rarity: 'very-rare', itemValueGp: 16000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-invisibility-leg', name: 'Ring of Invisibility', category: 'ring', rarity: 'legendary', itemValueGp: 32000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Primodrial dust', metatag: 'Invisible stalker', quantity: 1 }
  ] },
  { id: 'ring-of-jumping-unc', name: 'Ring of Jumping', category: 'ring', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Bone', metatag: 'Frog or toad', quantity: 1 }
  ] },
  { id: 'ring-of-mind-shielding-unc', name: 'Ring of Mind Shielding', category: 'ring', rarity: 'uncommon', itemValueGp: 1600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Main eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-protection-rar', name: 'Ring of Protection', category: 'ring', rarity: 'rare', itemValueGp: 3500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Plating', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-ver', name: 'Ring of Regeneration', category: 'ring', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Membrane', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-acid-unc', name: 'Ring of Regeneration (Acid)', category: 'ring', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-cold-unc', name: 'Ring of Regeneration (Cold)', category: 'ring', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-fire-unc', name: 'Ring of Regeneration (Fire)', category: 'ring', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-force-unc', name: 'Ring of Regeneration (Force)', category: 'ring', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-lightning-unc', name: 'Ring of Regeneration (Lightning)', category: 'ring', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-necrotic-unc', name: 'Ring of Regeneration (Necrotic)', category: 'ring', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-poison-unc', name: 'Ring of Regeneration (Poison)', category: 'ring', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-psychic-unc', name: 'Ring of Regeneration (Psychic)', category: 'ring', rarity: 'uncommon', itemValueGp: 1100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-radiant-unc', name: 'Ring of Regeneration (Radiant)', category: 'ring', rarity: 'uncommon', itemValueGp: 1100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-regeneration-thunder-unc', name: 'Ring of Regeneration (Thunder)', category: 'ring', rarity: 'uncommon', itemValueGp: 1100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-shooting-stars-ver', name: 'Ring of Shooting Stars', category: 'ring', rarity: 'very-rare', itemValueGp: 14000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Antenna', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-spell-storing-rar', name: 'Ring of Spell Storing', category: 'ring', rarity: 'rare', itemValueGp: 8000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-spell-turning-leg', name: 'Ring of Spell Turning', category: 'ring', rarity: 'legendary', itemValueGp: 50000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Skin', metatag: 'Rakshasa', quantity: 1 }
  ] },
  { id: 'ring-of-swimming-unc', name: 'Ring of Swimming', category: 'ring', rarity: 'uncommon', itemValueGp: 1800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Fin', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-telekinesis-ver', name: 'Ring of Telekinesis', category: 'ring', rarity: 'very-rare', itemValueGp: 25000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Brain', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'ring-of-the-ram-rar', name: 'Ring of the Ram', category: 'ring', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Horn', metatag: 'Goat or sheep', quantity: 1 }
  ] },
  { id: 'ring-of-three-wishes-leg', name: 'Ring of Three Wishes', category: 'ring', rarity: 'legendary', itemValueGp: 150000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Heart', metatag: 'Halfling', quantity: 1 }
  ] },
  { id: 'ring-of-warmth-unc', name: 'Ring of Warmth', category: 'ring', rarity: 'uncommon', itemValueGp: 4500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-water-walking-unc', name: 'Ring of Water Walking', category: 'ring', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Fat', metatag: null, quantity: 1 }
  ] },
  { id: 'ring-of-x-ray-vision-rar', name: 'Ring of X-ray Vision', category: 'ring', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'immovable-rod-unc', name: 'Immovable Rod', category: 'rod', rarity: 'uncommon', itemValueGp: 2000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'rod-of-absorption-leg', name: 'Rod of Absorption', category: 'rod', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Stone', metatag: null, quantity: 1 }
  ] },
  { id: 'rod-of-alertness-ver', name: 'Rod of Alertness', category: 'rod', rarity: 'very-rare', itemValueGp: 25000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'rod-of-lordly-might-leg', name: 'Rod of Lordly Might', category: 'rod', rarity: 'legendary', itemValueGp: 35000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Pouch of teeth', metatag: 'Pit fiend', quantity: 1 }
  ] },
  { id: 'rod-of-rulership-rar', name: 'Rod of Rulership', category: 'rod', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Pouch of dust', metatag: 'Incubus or sucubus', quantity: 1 }
  ] },
  { id: 'rod-of-security-ver', name: 'Rod of Security', category: 'rod', rarity: 'very-rare', itemValueGp: 20000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Horn', metatag: 'Unicorn', quantity: 1 }
  ] },
  { id: 'cantrip-spell-scroll-com', name: 'Cantrip Spell Scroll', category: 'scroll', rarity: 'common', itemValueGp: 20, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '1st-level-spell-scroll-com', name: '1st-level Spell Scroll', category: 'scroll', rarity: 'common', itemValueGp: 60, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '2nd-level-spell-scroll-unc', name: '2nd-level Spell Scroll', category: 'scroll', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '3rd-level-spell-scroll-unc', name: '3rd-level Spell Scroll', category: 'scroll', rarity: 'uncommon', itemValueGp: 360, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '4th-level-spell-scroll-rar', name: '4th-level Spell Scroll', category: 'scroll', rarity: 'rare', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '5th-level-spell-scroll-rar', name: '5th-level Spell Scroll', category: 'scroll', rarity: 'rare', itemValueGp: 2000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '6th-level-spell-scroll-ver', name: '6th-level Spell Scroll', category: 'scroll', rarity: 'very-rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '7th-level-spell-scroll-ver', name: '7th -level Spell Scroll', category: 'scroll', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '8th-level-spell-scroll-ver', name: '8th -level Spell Scroll', category: 'scroll', rarity: 'very-rare', itemValueGp: 25000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: '9th-level-spell-scroll-leg', name: '9th -level Spell Scroll', category: 'scroll', rarity: 'legendary', itemValueGp: 50000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [] },
  { id: 'staff-of-charming-rar', name: 'Staff of Charming', category: 'staff', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Heart', metatag: 'Incubus or sucubus', quantity: 1 }
  ] },
  { id: 'staff-of-fire-ver', name: 'Staff of Fire', category: 'staff', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Volatile mote of fire', metatag: 'Magma mephit', quantity: 1 }
  ] },
  { id: 'staff-of-frost-ver', name: 'Staff of Frost', category: 'staff', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Volatile mote of water', metatag: 'Ice mephit', quantity: 1 }
  ] },
  { id: 'staff-of-healing-rar', name: 'Staff of Healing', category: 'staff', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Horn', metatag: 'Unicorn', quantity: 1 }
  ] },
  { id: 'staff-of-power-leg', name: 'Staff of Power', category: 'staff', rarity: 'legendary', itemValueGp: 65000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Heart', metatag: 'Storm', quantity: 1 }
  ] },
  { id: 'staff-of-striking-ver', name: 'Staff of Striking', category: 'staff', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Psyche', metatag: 'Sprite', quantity: 1 }
  ] },
  { id: 'staff-of-swarming-insects-rar', name: 'Staff of Swarming Insects', category: 'staff', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Stinger', metatag: 'Beetle or insect', quantity: 1 }
  ] },
  { id: 'staff-of-thunder-and-lightning-ver', name: 'Staff of Thunder and Lightning', category: 'staff', rarity: 'very-rare', itemValueGp: 10000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Volatile mote of air', metatag: 'Djinni', quantity: 1 }
  ] },
  { id: 'staff-of-withering-rar', name: 'Staff of Withering', category: 'staff', rarity: 'rare', itemValueGp: 2500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Bone', metatag: 'Wight', quantity: 1 }
  ] },
  { id: 'staff-of-the-magi-art', name: 'Staff of the Magi', category: 'staff', rarity: 'artifact', itemValueGp: 4000000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Tentacle', metatag: 'Kraken', quantity: 1 }
  ] },
  { id: 'staff-of-the-python-unc', name: 'Staff of the Python', category: 'staff', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of scales', metatag: 'Snake', quantity: 1 }
  ] },
  { id: 'staff-of-the-woodlands-ver', name: 'Staff of the Woodlands', category: 'staff', rarity: 'very-rare', itemValueGp: 22000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: 'Dryad', quantity: 1 }
  ] },
  { id: '1-wand-of-the-war-mage-unc', name: '+1 Wand of the War Mage', category: 'wand', rarity: 'uncommon', itemValueGp: 750, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: '2-wand-of-the-war-mage-rar', name: '+2 Wand of the War Mage', category: 'wand', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: '3-wand-of-the-war-mage-ver', name: '+3 Wand of the War Mage', category: 'wand', rarity: 'very-rare', itemValueGp: 6200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'wand-of-binding-rar', name: 'Wand of Binding', category: 'wand', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Pouch of hyphae', metatag: 'Shambling mound', quantity: 1 }
  ] },
  { id: 'wand-of-enemy-detection-unc', name: 'Wand of Enemy Detection', category: 'wand', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Antenna', metatag: 'Ankheg', quantity: 1 }
  ] },
  { id: 'wand-of-fear-rar', name: 'Wand of Fear', category: 'wand', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Ethereal ichor', metatag: 'Ghost', quantity: 1 }
  ] },
  { id: 'wand-of-fireballs-ver', name: 'Wand of Fireballs', category: 'wand', rarity: 'very-rare', itemValueGp: 25000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Volatile mote of fire', metatag: 'Fire elemental', quantity: 1 }
  ] },
  { id: 'wand-of-lightning-bolts-ver', name: 'Wand of Lightning Bolts', category: 'wand', rarity: 'very-rare', itemValueGp: 25000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Volatile mote of air', metatag: 'Air elemental', quantity: 1 }
  ] },
  { id: 'wand-of-magic-detection-unc', name: 'Wand of Magic Detection', category: 'wand', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Eye', metatag: 'Sphinx', quantity: 1 }
  ] },
  { id: 'wand-of-magic-missiles-unc', name: 'Wand of Magic Missiles', category: 'wand', rarity: 'uncommon', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'wand-of-paralysis-ver', name: 'Wand of Paralysis', category: 'wand', rarity: 'very-rare', itemValueGp: 10000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Stinger', metatag: 'Phase spider', quantity: 1 }
  ] },
  { id: 'wand-of-polymorph-ver', name: 'Wand of Polymorph', category: 'wand', rarity: 'very-rare', itemValueGp: 20000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Flesh', metatag: 'Mimic', quantity: 1 }
  ] },
  { id: 'wand-of-secrets-unc', name: 'Wand of Secrets', category: 'wand', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Antenna', metatag: 'Has blindsight', quantity: 1 }
  ] },
  { id: 'wand-of-web-rar', name: 'Wand of Web', category: 'wand', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Poison gland', metatag: 'Spider', quantity: 1 }
  ] },
  { id: 'wand-of-wonder-rar', name: 'Wand of Wonder', category: 'wand', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Heart', metatag: null, quantity: 1 }
  ] },
  { id: 'time-splitter-unc', name: 'Time Splitter', category: 'weapon', rarity: 'uncommon', itemValueGp: 850, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Bone', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'time-splitter-ver', name: 'Time Splitter', category: 'weapon', rarity: 'very-rare', itemValueGp: 9800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Bone', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'haemstrike-unc', name: 'Haemstrike', category: 'weapon', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Bone', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'haemstrike-rar', name: 'Haemstrike', category: 'weapon', rarity: 'rare', itemValueGp: 3500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Bone', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'haemstrike-ver', name: 'Haemstrike', category: 'weapon', rarity: 'very-rare', itemValueGp: 11000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Bone', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'hammer-time-rar', name: 'Hammer Time', category: 'weapon', rarity: 'rare', itemValueGp: 1300, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Main eye', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'hammer-time-ver', name: 'Hammer Time', category: 'weapon', rarity: 'very-rare', itemValueGp: 6200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Main eye', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'headbanger-lute-unc', name: 'Headbanger Lute', category: 'weapon', rarity: 'uncommon', itemValueGp: 800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Stomach', metatag: 'Tavern Mimic', quantity: 1 }
  ] },
  { id: 'headbanger-lute-ver', name: 'Headbanger Lute', category: 'weapon', rarity: 'very-rare', itemValueGp: 9600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Stomach', metatag: 'Tavern Mimic', quantity: 1 }
  ] },
  { id: 'mawling-maul-unc', name: 'Mawling Maul', category: 'weapon', rarity: 'uncommon', itemValueGp: 650, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of teeth', metatag: 'Tavern Mimic', quantity: 1 }
  ] },
  { id: 'mawling-maul-rar', name: 'Mawling Maul', category: 'weapon', rarity: 'rare', itemValueGp: 1600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of teeth', metatag: 'Tavern Mimic', quantity: 1 }
  ] },
  { id: 'vorpal-sword-leg', name: 'Vorpal Sword', category: 'weapon', rarity: 'legendary', itemValueGp: 24000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'dagger-of-venom-rar', name: 'Dagger of Venom', category: 'weapon', rarity: 'rare', itemValueGp: 1900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Poison gland', metatag: 'Vrock', quantity: 1 }
  ] },
  { id: 'flooze-unc', name: 'Flooze', category: 'weapon', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Gooey wishbones', metatag: 'Polyhedrooze', quantity: 3 }
  ] },
  { id: 'flooze-ver', name: 'Flooze', category: 'weapon', rarity: 'very-rare', itemValueGp: 9600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Gooey wishbones', metatag: 'Polyhedrooze', quantity: 3 }
  ] },
  { id: '1-weapon-unc', name: '+1 Weapon', category: 'weapon', rarity: 'uncommon', itemValueGp: 750, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of claws', metatag: null, quantity: 1 }
  ] },
  { id: '2-weapon-rar', name: '+2 Weapon', category: 'weapon', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of claws', metatag: null, quantity: 1 }
  ] },
  { id: '3-weapon-ver', name: '+3 Weapon', category: 'weapon', rarity: 'very-rare', itemValueGp: 6200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Pouch of claws', metatag: null, quantity: 1 }
  ] },
  { id: 'berserker-axe-rar', name: 'Berserker Axe', category: 'weapon', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'dancing-sword-rar', name: 'Dancing Sword', category: 'weapon', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Lifespark', metatag: 'Flying Sword', quantity: 1 }
  ] },
  { id: 'defender-leg', name: 'Defender', category: 'weapon', rarity: 'legendary', itemValueGp: 24000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Lifespark', metatag: null, quantity: 1 }
  ] },
  { id: 'dragon-slayer-rar', name: 'Dragon Slayer', category: 'weapon', rarity: 'rare', itemValueGp: 2400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Heart', metatag: null, quantity: 1 }
  ] },
  { id: 'flame-tongue-ver', name: 'Flame Tongue', category: 'weapon', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: null, quantity: 1 }
  ] },
  { id: 'frost-brand-ver', name: 'Frost Brand', category: 'weapon', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: null, quantity: 1 }
  ] },
  { id: 'giant-slayer-rar', name: 'Giant Slayer', category: 'weapon', rarity: 'rare', itemValueGp: 2400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Heart', metatag: null, quantity: 1 }
  ] },
  { id: 'holy-avenger-leg', name: 'Holy Avenger', category: 'weapon', rarity: 'legendary', itemValueGp: 150000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Heart', metatag: 'Solar', quantity: 1 }
  ] },
  { id: 'luck-blade-leg', name: 'Luck Blade', category: 'weapon', rarity: 'legendary', itemValueGp: 170000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Psyche', metatag: null, quantity: 1 }
  ] },
  { id: 'nine-lives-stealer-ver', name: 'Nine Lives Stealer', category: 'weapon', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Heart', metatag: 'Cat', quantity: 1 }
  ] },
  { id: 'sword-of-life-stealing-rar', name: 'Sword of Life Stealing', category: 'weapon', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Ethereal ichor', metatag: 'Wraith', quantity: 1 }
  ] },
  { id: 'sword-of-sharpness-rar', name: 'Sword of Sharpness', category: 'weapon', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Tooth', metatag: null, quantity: 1 }
  ] },
  { id: 'sword-of-wounding-rar', name: 'Sword of Wounding', category: 'weapon', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'vicious-weapon-unc', name: 'Vicious Weapon', category: 'weapon', rarity: 'uncommon', itemValueGp: 350, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'javelin-of-lightning-unc', name: 'Javelin of Lightning', category: 'weapon', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Primordial dust', metatag: null, quantity: 1 }
  ] },
  { id: 'oathbow-ver', name: 'Oathbow', category: 'weapon', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Tongue', metatag: null, quantity: 1 }
  ] },
  { id: 'mace-of-disruption-rar', name: 'Mace of Disruption', category: 'weapon', rarity: 'rare', itemValueGp: 7000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Marrow', metatag: null, quantity: 1 }
  ] },
  { id: 'mace-of-smiting-rar', name: 'Mace of Smiting', category: 'weapon', rarity: 'rare', itemValueGp: 4500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'mace-of-terror-rar', name: 'Mace of Terror', category: 'weapon', rarity: 'rare', itemValueGp: 7000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'hammer-of-thunderbolts-ver', name: 'Hammer of Thunderbolts', category: 'weapon', rarity: 'very-rare', itemValueGp: 16000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Bone', metatag: 'Storm', quantity: 1 }
  ] },
  { id: 'scimitar-of-speed-ver', name: 'Scimitar of Speed', category: 'weapon', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Pouch of feathers', metatag: null, quantity: 1 }
  ] },
  { id: 'trident-of-fish-command-unc', name: 'Trident of Fish Command', category: 'weapon', rarity: 'uncommon', itemValueGp: 700, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Tentacle', metatag: null, quantity: 1 }
  ] },
  { id: 'dwarven-thrower-ver', name: 'Dwarven Thrower', category: 'weapon', rarity: 'very-rare', itemValueGp: 18000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Tooth', metatag: 'Stone', quantity: 1 }
  ] },
  { id: 'amulet-of-health-rar', name: 'Amulet of Health', category: 'wondrous', rarity: 'rare', itemValueGp: 7000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Heart', metatag: 'Mammoth', quantity: 1 }
  ] },
  { id: 'amulet-of-proof-against-detection-and-location-unc', name: 'Amulet of Proof against Detection and Location', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Antenna', metatag: null, quantity: 1 }
  ] },
  { id: 'amulet-of-the-planes-ver', name: 'Amulet of the Planes', category: 'wondrous', rarity: 'very-rare', itemValueGp: 20000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Soul', metatag: null, quantity: 1 }
  ] },
  { id: 'apparatus-of-the-crab-ver', name: 'Apparatus of the Crab', category: 'wondrous', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Brain', metatag: null, quantity: 1 }
  ] },
  { id: 'astral-luggage-unc', name: 'Astral Luggage', category: 'wondrous', rarity: 'uncommon', itemValueGp: 300, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Brain', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'astral-luggage-ver', name: 'Astral Luggage', category: 'wondrous', rarity: 'very-rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Brain', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'bag-of-beans-rar', name: 'Bag of Beans', category: 'wondrous', rarity: 'rare', itemValueGp: 2000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Phial of sap', metatag: null, quantity: 1 }
  ] },
  { id: 'bag-of-devouring-ver', name: 'Bag of Devouring', category: 'wondrous', rarity: 'very-rare', itemValueGp: 6500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'bag-of-holding-unc', name: 'Bag of Holding', category: 'wondrous', rarity: 'uncommon', itemValueGp: 2500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: null, quantity: 1 }
  ] },
  { id: 'bag-of-tricks-any-unc', name: 'Bag of Tricks , (Any)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Skin', metatag: null, quantity: 1 }
  ] },
  { id: 'bead-of-force-rar', name: 'Bead of Force', category: 'wondrous', rarity: 'rare', itemValueGp: 960, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Lifespark', metatag: null, quantity: 1 }
  ] },
  { id: 'belt-of-dwarvenkind-ver', name: 'Belt of Dwarvenkind', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'belt-of-dwarvenkind-cloud-leg', name: 'Belt of Dwarvenkind (Cloud)', category: 'wondrous', rarity: 'legendary', itemValueGp: null, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Skin', metatag: 'Cloud', quantity: 1 }
  ] },
  { id: 'belt-of-dwarvenkind-fire-ver', name: 'Belt of Dwarvenkind (Fire)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 24000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Skin', metatag: 'Fire', quantity: 1 }
  ] },
  { id: 'belt-of-dwarvenkind-frost-ver', name: 'Belt of Dwarvenkind (Frost)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 16000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Skin', metatag: 'Frost', quantity: 1 }
  ] },
  { id: 'belt-of-dwarvenkind-hill-rar', name: 'Belt of Dwarvenkind (Hill)', category: 'wondrous', rarity: 'rare', itemValueGp: 8000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Skin', metatag: 'Hill', quantity: 1 }
  ] },
  { id: 'belt-of-dwarvenkind-stone-ver', name: 'Belt of Dwarvenkind (Stone)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 16000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Skin', metatag: 'Stone', quantity: 1 }
  ] },
  { id: 'belt-of-dwarvenkind-storm-leg', name: 'Belt of Dwarvenkind (Storm)', category: 'wondrous', rarity: 'legendary', itemValueGp: 96000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Skin', metatag: 'Storm', quantity: 1 }
  ] },
  { id: 'bomboozler-rar', name: 'Bomboozler', category: 'wondrous', rarity: 'rare', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of acid', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'bomboozler-ver', name: 'Bomboozler', category: 'wondrous', rarity: 'very-rare', itemValueGp: 4800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of acid', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'boots-of-elvenkind-unc', name: 'Boots of Elvenkind', category: 'wondrous', rarity: 'uncommon', itemValueGp: 2500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bark', metatag: null, quantity: 1 }
  ] },
  { id: 'boots-of-levitation-rar', name: 'Boots of Levitation', category: 'wondrous', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Skin', metatag: null, quantity: 1 }
  ] },
  { id: 'boots-of-speed-rar', name: 'Boots of Speed', category: 'wondrous', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'boots-of-striding-and-springing-unc', name: 'Boots of Striding and Springing', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Gears', metatag: null, quantity: 1 }
  ] },
  { id: 'boots-of-the-winterlands-unc', name: 'Boots of the Winterlands', category: 'wondrous', rarity: 'uncommon', itemValueGp: 2000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'bowl-of-commanding-water-elementals-rar', name: 'Bowl of Commanding Water Elementals', category: 'wondrous', rarity: 'rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of water', metatag: null, quantity: 1 }
  ] },
  { id: 'bracers-of-archery-rar', name: 'Bracers of Archery', category: 'wondrous', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'bracers-of-defense-rar', name: 'Bracers of Defense', category: 'wondrous', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Chitin', metatag: null, quantity: 1 }
  ] },
  { id: 'brazier-of-commanding-fire-elementals-rar', name: 'Brazier of Commanding Fire Elementals', category: 'wondrous', rarity: 'rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of fire', metatag: 'Efreeti', quantity: 1 }
  ] },
  { id: 'brooch-of-shielding-unc', name: 'Brooch of Shielding', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of scales', metatag: null, quantity: 1 }
  ] },
  { id: 'broodmother-s-embrace-rar', name: 'Broodmother’s Embrace', category: 'wondrous', rarity: 'rare', itemValueGp: 3500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: 'Broodmother', quantity: 1 }
  ] },
  { id: 'broodmother-s-embrace-ver', name: 'Broodmother’s Embrace', category: 'wondrous', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: 'Broodmother', quantity: 1 }
  ] },
  { id: 'broodmother-s-embrace-leg', name: 'Broodmother’s Embrace', category: 'wondrous', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: 'Broodmother', quantity: 1 }
  ] },
  { id: 'broodslinger-unc', name: 'Broodslinger', category: 'wondrous', rarity: 'uncommon', itemValueGp: 800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Broodling sac', metatag: 'Broodmother', quantity: 1 }
  ] },
  { id: 'broodslinger-rar', name: 'Broodslinger', category: 'wondrous', rarity: 'rare', itemValueGp: 2500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Broodling sac', metatag: 'Broodmother', quantity: 1 }
  ] },
  { id: 'broodslinger-ver', name: 'Broodslinger', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Broodling sac', metatag: 'Broodmother', quantity: 1 }
  ] },
  { id: 'broom-of-flying-ver', name: 'Broom of Flying', category: 'wondrous', rarity: 'very-rare', itemValueGp: 8000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: null, quantity: 1 }
  ] },
  { id: 'caltrooze-unc', name: 'Caltrooze', category: 'wondrous', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of mucus', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'candle-of-invocation-ver', name: 'Candle of Invocation', category: 'wondrous', rarity: 'very-rare', itemValueGp: 5600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: null, componentName: 'Fat *', metatag: null, quantity: 1 }
  ] },
  { id: 'cape-of-the-mountebank-rar', name: 'Cape of the Mountebank', category: 'wondrous', rarity: 'rare', itemValueGp: 1600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'cape-of-the-mountebank-3-ft-by-5-ft-ver', name: 'Cape of the Mountebank (3 ft. by 5 ft.)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 8000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: null, quantity: 1 }
  ] },
  { id: 'cape-of-the-mountebank-4-ft-by-6-ft-ver', name: 'Cape of the Mountebank (4 ft. by 6 ft.)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 10000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: null, quantity: 1 }
  ] },
  { id: 'cape-of-the-mountebank-5-ft-by-7-ft-ver', name: 'Cape of the Mountebank (5 ft. by 7 ft.)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: null, quantity: 1 }
  ] },
  { id: 'cape-of-the-mountebank-6-ft-by-9-ft-ver', name: 'Cape of the Mountebank (6 ft. by 9 ft.)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 16000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: null, quantity: 1 }
  ] },
  { id: 'censer-of-controlling-air-elementals-rar', name: 'Censer of Controlling Air Elementals', category: 'wondrous', rarity: 'rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of air', metatag: 'Djinni', quantity: 1 }
  ] },
  { id: 'chime-of-opening-rar', name: 'Chime of Opening', category: 'wondrous', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'circlet-of-blasting-unc', name: 'Circlet of Blasting', category: 'wondrous', rarity: 'uncommon', itemValueGp: 360, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Antler', metatag: null, quantity: 1 }
  ] },
  { id: 'cloak-of-arachnida-ver', name: 'Cloak of Arachnida', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Chitin', metatag: 'Giant spider', quantity: 1 }
  ] },
  { id: 'cloak-of-displacement-leg', name: 'Cloak of Displacement', category: 'wondrous', rarity: 'legendary', itemValueGp: 60000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'cloak-of-elvenkind-rar', name: 'Cloak of Elvenkind', category: 'wondrous', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Phial of sap', metatag: null, quantity: 1 }
  ] },
  { id: 'cloak-of-protection-rar', name: 'Cloak of Protection', category: 'wondrous', rarity: 'rare', itemValueGp: 3500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Chitin', metatag: null, quantity: 1 }
  ] },
  { id: 'cloak-of-the-bat-rar', name: 'Cloak of the Bat', category: 'wondrous', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pelt', metatag: 'Bat', quantity: 1 }
  ] },
  { id: 'cloak-of-the-manta-ray-rar', name: 'Cloak of the Manta Ray', category: 'wondrous', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pelt', metatag: 'Ray or shark', quantity: 1 }
  ] },
  { id: 'crystal-ball-ver', name: 'Crystal Ball', category: 'wondrous', rarity: 'very-rare', itemValueGp: 28000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'cube-of-force-ver', name: 'Cube of Force', category: 'wondrous', rarity: 'very-rare', itemValueGp: 16000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Instructions', metatag: null, quantity: 1 }
  ] },
  { id: 'cubic-gate-leg', name: 'Cubic Gate', category: 'wondrous', rarity: 'legendary', itemValueGp: 40000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Primordial dust', metatag: null, quantity: 1 }
  ] },
  { id: 'deck-of-illusions-unc', name: 'Deck of Illusions', category: 'wondrous', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Soul', metatag: null, quantity: 1 }
  ] },
  { id: 'deck-of-many-things-leg', name: 'Deck of Many Things', category: 'wondrous', rarity: 'legendary', itemValueGp: 60000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Soul', metatag: null, quantity: 1 }
  ] },
  { id: 'dimensional-shackles-rar', name: 'Dimensional Shackles', category: 'wondrous', rarity: 'rare', itemValueGp: 2500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Fat', metatag: null, quantity: 1 }
  ] },
  { id: 'dreamy-the-lucid-unc', name: 'Dreamy the Lucid', category: 'wondrous', rarity: 'uncommon', itemValueGp: 200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Subeye', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'dust-of-disappearance-unc', name: 'Dust of Disappearance', category: 'wondrous', rarity: 'uncommon', itemValueGp: 250, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Primordial dust', metatag: null, quantity: 1 }
  ] },
  { id: 'dust-of-dryness-unc', name: 'Dust of Dryness', category: 'wondrous', rarity: 'uncommon', itemValueGp: 180, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of dust', metatag: null, quantity: 1 }
  ] },
  { id: 'dust-of-sneezing-and-choking-unc', name: 'Dust of Sneezing and Choking', category: 'wondrous', rarity: 'uncommon', itemValueGp: 480, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Pouch of dust', metatag: null, quantity: 1 }
  ] },
  { id: 'efficient-quiver-unc', name: 'Efficient Quiver', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'efreeti-bottle-leg', name: 'Efreeti Bottle', category: 'wondrous', rarity: 'legendary', itemValueGp: 30000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of fire', metatag: 'Efreeti', quantity: 1 }
  ] },
  { id: 'efreeti-bottle-blue-sapphire-rar', name: 'Efreeti Bottle (Blue Sapphire)', category: 'wondrous', rarity: 'rare', itemValueGp: 960, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Eye', metatag: 'Djinni', quantity: 1 }
  ] },
  { id: 'efreeti-bottle-emerald-rar', name: 'Efreeti Bottle (Emerald)', category: 'wondrous', rarity: 'rare', itemValueGp: 960, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'efreeti-bottle-red-corundum-rar', name: 'Efreeti Bottle (Red Corundum)', category: 'wondrous', rarity: 'rare', itemValueGp: 960, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Eye', metatag: 'Efreeti', quantity: 1 }
  ] },
  { id: 'efreeti-bottle-yellow-diamond-rar', name: 'Efreeti Bottle (Yellow Diamond)', category: 'wondrous', rarity: 'rare', itemValueGp: 960, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'eversmoking-bottle-unc', name: 'Eversmoking Bottle', category: 'wondrous', rarity: 'uncommon', itemValueGp: 480, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Pouch of spores', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-charming-unc', name: 'Eyes of Charming', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-googly-com', name: 'Eyes of Googly', category: 'wondrous', rarity: 'common', itemValueGp: 20, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Eye', metatag: 'Mimic', quantity: 1 }
  ] },
  { id: 'eyes-of-minute-seeing-unc', name: 'Eyes of Minute Seeing', category: 'wondrous', rarity: 'uncommon', itemValueGp: 850, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Eye', metatag: 'Bird', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-unc', name: 'Eyes of the Eagle', category: 'wondrous', rarity: 'uncommon', itemValueGp: 850, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Eye', metatag: 'Eagle', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-anchor-com', name: 'Eyes of the Eagle (Anchor)', category: 'wondrous', rarity: 'common', itemValueGp: 50, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-bird-rar', name: 'Eyes of the Eagle (Bird)', category: 'wondrous', rarity: 'rare', itemValueGp: 3000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Beak', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-fan-unc', name: 'Eyes of the Eagle (Fan)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 300, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of feathers', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-swan-boat-rar', name: 'Eyes of the Eagle (Swan Boat)', category: 'wondrous', rarity: 'rare', itemValueGp: 1400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Beak', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-tree-com', name: 'Eyes of the Eagle (Tree)', category: 'wondrous', rarity: 'common', itemValueGp: 50, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bark', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-whip-unc', name: 'Eyes of the Eagle (Whip)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Tentacle', metatag: null, quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-bronze-griffon-rar', name: 'Eyes of the Eagle (Bronze Griffon)', category: 'wondrous', rarity: 'rare', itemValueGp: 2000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of feathers', metatag: 'Griffon', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-ebony-fly-rar', name: 'Eyes of the Eagle (Ebony Fly)', category: 'wondrous', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Chitin', metatag: 'Insect', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-golden-lions-unc', name: 'Eyes of the Eagle (Golden Lions)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pelt', metatag: 'Lion', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-ivory-goats-ver', name: 'Eyes of the Eagle (Ivory Goats)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 17400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Horn', metatag: 'Goat', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-marble-elephant-rar', name: 'Eyes of the Eagle (Marble Elephant)', category: 'wondrous', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Tusks', metatag: 'Elephant', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-obsidian-steed-ver', name: 'Eyes of the Eagle (Obsidian Steed)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 24000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Bone', metatag: 'Horse', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-onyx-dog-rar', name: 'Eyes of the Eagle (Onyx Dog)', category: 'wondrous', rarity: 'rare', itemValueGp: 3000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of teeth', metatag: 'Dog or wolf', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-serpentine-owl-rar', name: 'Eyes of the Eagle (Serpentine Owl)', category: 'wondrous', rarity: 'rare', itemValueGp: 7000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Eye', metatag: 'Owl', quantity: 1 }
  ] },
  { id: 'eyes-of-the-eagle-silver-raven-unc', name: 'Eyes of the Eagle (Silver Raven)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Beak', metatag: 'Bird', quantity: 1 }
  ] },
  { id: 'folding-boat-rar', name: 'Folding Boat', category: 'wondrous', rarity: 'rare', itemValueGp: 3000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bark', metatag: null, quantity: 1 }
  ] },
  { id: 'gauntlets-of-ogre-power-rar', name: 'Gauntlets of Ogre Power', category: 'wondrous', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Bone', metatag: 'Ogre', quantity: 1 }
  ] },
  { id: 'gem-of-brightness-rar', name: 'Gem of Brightness', category: 'wondrous', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Fat', metatag: null, quantity: 1 }
  ] },
  { id: 'gem-of-seeing-rar', name: 'Gem of Seeing', category: 'wondrous', rarity: 'rare', itemValueGp: 8000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'gloves-of-missile-snaring-unc', name: 'Gloves of Missile Snaring', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Pelt', metatag: null, quantity: 1 }
  ] },
  { id: 'gloves-of-swimming-and-climbing-unc', name: 'Gloves of Swimming and Climbing', category: 'wondrous', rarity: 'uncommon', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of scales', metatag: 'Shark', quantity: 1 }
  ] },
  { id: 'goggles-of-night-unc', name: 'Goggles of Night', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'goo-luck-dice-com', name: 'Goo Luck Dice', category: 'wondrous', rarity: 'common', itemValueGp: 50, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of Mucus', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'grill-of-barbecuing-unc', name: 'Grill of Barbecuing', category: 'wondrous', rarity: 'uncommon', itemValueGp: 350, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Volatile mote of fire', metatag: null, quantity: 1 }
  ] },
  { id: 'hat-of-disguise-unc', name: 'Hat of Disguise', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Skin', metatag: 'Shapechanger', quantity: 1 }
  ] },
  { id: 'headband-of-intellect-rar', name: 'Headband of Intellect', category: 'wondrous', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Brain', metatag: null, quantity: 1 }
  ] },
  { id: 'heliana-s-guide-to-monster-hunting-unc', name: 'Heliana’s Guide to Monster Hunting', category: 'wondrous', rarity: 'uncommon', itemValueGp: 300, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Brain', metatag: null, quantity: 1 }
  ] },
  { id: 'helm-of-brilliance-ver', name: 'Helm of Brilliance', category: 'wondrous', rarity: 'very-rare', itemValueGp: 25000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of scales', metatag: null, quantity: 1 }
  ] },
  { id: 'helm-of-comprehending-languages-unc', name: 'Helm of Comprehending Languages', category: 'wondrous', rarity: 'uncommon', itemValueGp: 500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Brain', metatag: null, quantity: 1 }
  ] },
  { id: 'helm-of-telepathy-unc', name: 'Helm of Telepathy', category: 'wondrous', rarity: 'uncommon', itemValueGp: 2000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Brain', metatag: null, quantity: 1 }
  ] },
  { id: 'helm-of-teleportation-ver', name: 'Helm of Teleportation', category: 'wondrous', rarity: 'very-rare', itemValueGp: 23000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Tentacle', metatag: null, quantity: 1 }
  ] },
  { id: 'handy-haversack-unc', name: 'Handy Haversack', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: null, quantity: 1 }
  ] },
  { id: 'horn-of-blasting-unc', name: 'Horn of Blasting', category: 'wondrous', rarity: 'uncommon', itemValueGp: 450, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Horn', metatag: null, quantity: 1 }
  ] },
  { id: 'horn-of-blasting-brass-rar', name: 'Horn of Blasting (Brass)', category: 'wondrous', rarity: 'rare', itemValueGp: 8400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Tusk', metatag: 'Elephant', quantity: 1 }
  ] },
  { id: 'horn-of-blasting-bronze-ver', name: 'Horn of Blasting (Bronze)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 14000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Tusk', metatag: 'Mammoth', quantity: 1 }
  ] },
  { id: 'horn-of-blasting-iron-leg', name: 'Horn of Blasting (Iron)', category: 'wondrous', rarity: 'legendary', itemValueGp: 28800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Horn', metatag: 'Balor', quantity: 1 }
  ] },
  { id: 'horn-of-blasting-silver-rar', name: 'Horn of Blasting (Silver)', category: 'wondrous', rarity: 'rare', itemValueGp: 5600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Horn', metatag: 'Rhinoceros', quantity: 1 }
  ] },
  { id: 'horseshoes-of-speed-rar', name: 'Horseshoes of Speed', category: 'wondrous', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of claws', metatag: null, quantity: 1 }
  ] },
  { id: 'horseshoes-of-a-zephyr-ver', name: 'Horseshoes of a Zephyr', category: 'wondrous', rarity: 'very-rare', itemValueGp: 6200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of claws', metatag: null, quantity: 1 }
  ] },
  { id: 'instant-fortress-leg', name: 'Instant Fortress', category: 'wondrous', rarity: 'legendary', itemValueGp: 75000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'instant-fortress-absorption-ver', name: 'Instant Fortress (Absorption)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Chitin', metatag: null, quantity: 1 }
  ] },
  { id: 'instant-fortress-agility-ver', name: 'Instant Fortress (Agility)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Psyche', metatag: 'Dex ≥ 20', quantity: 1 }
  ] },
  { id: 'instant-fortress-awareness-ver', name: 'Instant Fortress (Awareness)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 12000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Heart', metatag: 'Adult or Ancient', quantity: 1 }
  ] },
  { id: 'instant-fortress-fortitude-ver', name: 'Instant Fortress (Fortitude)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Soul', metatag: 'Con ≥ 20', quantity: 1 }
  ] },
  { id: 'instant-fortress-greater-absorption-leg', name: 'Instant Fortress (Greater Absorption)', category: 'wondrous', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Lifespark', metatag: 'Shield guardian', quantity: 1 }
  ] },
  { id: 'instant-fortress-insight-ver', name: 'Instant Fortress (Insight)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Soul', metatag: 'Wis ≥ 20', quantity: 1 }
  ] },
  { id: 'instant-fortress-intellect-ver', name: 'Instant Fortress (Intellect)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Psyche', metatag: 'Int ≥ 20', quantity: 1 }
  ] },
  { id: 'instant-fortress-leadership-ver', name: 'Instant Fortress (Leadership)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Soul', metatag: 'Cha ≥ 20', quantity: 1 }
  ] },
  { id: 'instant-fortress-mastery-leg', name: 'Instant Fortress (Mastery)', category: 'wondrous', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Soul', metatag: 'Pit fiend', quantity: 1 }
  ] },
  { id: 'instant-fortress-protection-rar', name: 'Instant Fortress (Protection)', category: 'wondrous', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Horn', metatag: 'Gorgon', quantity: 1 }
  ] },
  { id: 'instant-fortress-regeneration-ver', name: 'Instant Fortress (Regeneration)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Liver', metatag: 'Troll', quantity: 1 }
  ] },
  { id: 'instant-fortress-reserve-rar', name: 'Instant Fortress (Reserve)', category: 'wondrous', rarity: 'rare', itemValueGp: 5200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Brain', metatag: 'Spellcaster', quantity: 1 }
  ] },
  { id: 'instant-fortress-strength-ver', name: 'Instant Fortress (Strength)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Horn', metatag: 'Str ≥ 20', quantity: 1 }
  ] },
  { id: 'instant-fortress-sustenance-rar', name: 'Instant Fortress (Sustenance)', category: 'wondrous', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Undying heart', metatag: 'Vampire', quantity: 1 }
  ] },
  { id: 'iron-bands-of-binding-rar', name: 'Iron Bands of Binding', category: 'wondrous', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Bundle of roots', metatag: 'Shambling mound', quantity: 1 }
  ] },
  { id: 'iron-flask-leg', name: 'Iron Flask', category: 'wondrous', rarity: 'legendary', itemValueGp: 28800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Plating', metatag: 'Iron Golem', quantity: 1 }
  ] },
  { id: 'lantern-of-revealing-unc', name: 'Lantern of Revealing', category: 'wondrous', rarity: 'uncommon', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Eye', metatag: 'Hag', quantity: 1 }
  ] },
  { id: 'l-ars-ne-s-quadnoculars-rar', name: 'L’Arsène’s Quadnoculars', category: 'wondrous', rarity: 'rare', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Brain', metatag: null, quantity: 1 }
  ] },
  { id: 'mantle-of-spell-resistance-ver', name: 'Mantle of Spell Resistance', category: 'wondrous', rarity: 'very-rare', itemValueGp: 19000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Skin', metatag: 'Rakshasa', quantity: 1 }
  ] },
  { id: 'manual-of-bodily-health-ver', name: 'Manual of Bodily Health', category: 'wondrous', rarity: 'very-rare', itemValueGp: 14000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'giant', componentName: 'Liver', metatag: null, quantity: 1 }
  ] },
  { id: 'manual-of-gainful-exercise-ver', name: 'Manual of Gainful Exercise', category: 'wondrous', rarity: 'very-rare', itemValueGp: 14000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Liver', metatag: null, quantity: 1 }
  ] },
  { id: 'manual-of-gainful-exercise-clay-ver', name: 'Manual of Gainful Exercise (Clay)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 8200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Stone', metatag: 'Clay golem', quantity: 1 }
  ] },
  { id: 'manual-of-gainful-exercise-flesh-ver', name: 'Manual of Gainful Exercise (Flesh)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 6200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Flesh', metatag: 'Flesh golem', quantity: 1 }
  ] },
  { id: 'manual-of-gainful-exercise-iron-ver', name: 'Manual of Gainful Exercise (Iron)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 12200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Plating', metatag: 'Iron golem', quantity: 1 }
  ] },
  { id: 'manual-of-gainful-exercise-stone-ver', name: 'Manual of Gainful Exercise (Stone)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Stone', metatag: 'Stone golem', quantity: 1 }
  ] },
  { id: 'manual-of-quickness-of-action-ver', name: 'Manual of Quickness of Action', category: 'wondrous', rarity: 'very-rare', itemValueGp: 14000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'marvelous-pigments-ver', name: 'Marvelous Pigments', category: 'wondrous', rarity: 'very-rare', itemValueGp: 8600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Phial of wax', metatag: null, quantity: 1 }
  ] },
  { id: 'medallion-of-thoughts-unc', name: 'Medallion of Thoughts', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'mimickey-com', name: 'Mimickey', category: 'wondrous', rarity: 'common', itemValueGp: 50, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of teeth', metatag: 'Tavern mimic', quantity: 1 }
  ] },
  { id: 'mirror-of-life-trapping-ver', name: 'Mirror of Life Trapping', category: 'wondrous', rarity: 'very-rare', itemValueGp: 18000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-adaptation-unc', name: 'Necklace of Adaptation', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Poison gland', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-fireballs-rar', name: 'Necklace of Fireballs ****', category: 'wondrous', rarity: 'rare', itemValueGp: null, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-fireballs-prayer-bead-bless-unc', name: 'Necklace of Fireballs **** (Prayer Bead, Bless)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 300, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-fireballs-prayer-bead-curing-unc', name: 'Necklace of Fireballs **** (Prayer Bead, Curing)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-fireballs-prayer-bead-favor-rar', name: 'Necklace of Fireballs **** (Prayer Bead, Favor)', category: 'wondrous', rarity: 'rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-fireballs-prayer-bead-smiting-unc', name: 'Necklace of Fireballs **** (Prayer Bead, Smiting)', category: 'wondrous', rarity: 'uncommon', itemValueGp: 600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-fireballs-prayer-bead-summons-ver', name: 'Necklace of Fireballs **** (Prayer Bead, Summons)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 6400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'necklace-of-fireballs-prayer-bead-wind-walk-ver', name: 'Necklace of Fireballs **** (Prayer Bead, Wind Walk)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 6400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'oozemat-coat-rar', name: 'Oozemat Coat', category: 'wondrous', rarity: 'rare', itemValueGp: 3500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Membrane', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'orb-of-dragonkind-art', name: 'Orb of Dragonkind', category: 'wondrous', rarity: 'artifact', itemValueGp: 4000000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Heart', metatag: null, quantity: 1 }
  ] },
  { id: 'pearl-of-power-unc', name: 'Pearl of Power', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Pouch of teeth', metatag: null, quantity: 1 }
  ] },
  { id: 'periapt-of-health-unc', name: 'Periapt of Health', category: 'wondrous', rarity: 'uncommon', itemValueGp: 400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Heart', metatag: null, quantity: 1 }
  ] },
  { id: 'periapt-of-proof-against-poison-rar', name: 'Periapt of Proof against Poison', category: 'wondrous', rarity: 'rare', itemValueGp: 5000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Poison gland', metatag: null, quantity: 1 }
  ] },
  { id: 'periapt-of-wound-closure-unc', name: 'Periapt of Wound Closure', category: 'wondrous', rarity: 'uncommon', itemValueGp: 800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of mucus', metatag: null, quantity: 1 }
  ] },
  { id: 'pipes-of-haunting-unc', name: 'Pipes of Haunting', category: 'wondrous', rarity: 'uncommon', itemValueGp: 800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fey', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'pipes-of-the-sewers-unc', name: 'Pipes of the Sewers', category: 'wondrous', rarity: 'uncommon', itemValueGp: 700, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Bone', metatag: null, quantity: 1 }
  ] },
  { id: 'portable-hole-rar', name: 'Portable Hole', category: 'wondrous', rarity: 'rare', itemValueGp: 2500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: null, quantity: 1 }
  ] },
  { id: 'restorative-ointment-unc', name: 'Restorative Ointment', category: 'wondrous', rarity: 'uncommon', itemValueGp: 360, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Pouch of leaves', metatag: null, quantity: 1 }
  ] },
  { id: 'robe-of-eyes-rar', name: 'Robe of Eyes', category: 'wondrous', rarity: 'rare', itemValueGp: 4000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Eye', metatag: 'Sphinx', quantity: 1 }
  ] },
  { id: 'robe-of-scintillating-colors-ver', name: 'Robe of Scintillating Colors', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'plant', componentName: 'Pouch of pollen', metatag: null, quantity: 1 }
  ] },
  { id: 'robe-of-stars-ver', name: 'Robe of Stars', category: 'wondrous', rarity: 'very-rare', itemValueGp: 18000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'robe-of-useful-items-unc', name: 'Robe of Useful Items', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1250, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Skin', metatag: null, quantity: 1 }
  ] },
  { id: 'robe-of-the-archmagi-leg', name: 'Robe of the Archmagi', category: 'wondrous', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: null, componentName: 'Skin', metatag: null, quantity: 1 }
  ] },
  { id: 'robes-of-beaur-ve-rar', name: 'Robes of Beaurêve', category: 'wondrous', rarity: 'rare', itemValueGp: 1600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'robes-of-beaur-ve-leg', name: 'Robes of Beaurêve', category: 'wondrous', rarity: 'legendary', itemValueGp: 32000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'rope-of-climbing-unc', name: 'Rope of Climbing', category: 'wondrous', rarity: 'uncommon', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Talon', metatag: null, quantity: 1 }
  ] },
  { id: 'rope-of-entanglement-rar', name: 'Rope of Entanglement', category: 'wondrous', rarity: 'rare', itemValueGp: 2000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pincer', metatag: null, quantity: 1 }
  ] },
  { id: 'scarab-of-protection-leg', name: 'Scarab of Protection', category: 'wondrous', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'undead', componentName: 'Undying heart', metatag: 'Lich', quantity: 1 }
  ] },
  { id: 'second-chance-com', name: 'Second Chance', category: 'wondrous', rarity: 'common', itemValueGp: 380, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Subeye', metatag: 'Dreamholder', quantity: 1 }
  ] },
  { id: 'shard-crown-rar', name: 'Shard Crown', category: 'wondrous', rarity: 'rare', itemValueGp: 2800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Horn', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'shard-crown-ver', name: 'Shard Crown', category: 'wondrous', rarity: 'very-rare', itemValueGp: 10000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Horn', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'shard-crown-leg', name: 'Shard Crown', category: 'wondrous', rarity: 'legendary', itemValueGp: 41600, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Horn', metatag: 'Magnetite', quantity: 1 }
  ] },
  { id: 'slime-in-a-skull-unc', name: 'Slime-in-a-Skull', category: 'wondrous', rarity: 'uncommon', itemValueGp: 700, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Vesicle', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'slime-in-a-skull-ver', name: 'Slime-in-a-Skull', category: 'wondrous', rarity: 'very-rare', itemValueGp: 10000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Vesicle', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'slippers-of-spider-climbing-unc', name: 'Slippers of Spider Climbing', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pouch of claws', metatag: 'Spider', quantity: 1 }
  ] },
  { id: 'snow-wolf-cowl-unc', name: 'Snow Wolf Cowl', category: 'wondrous', rarity: 'uncommon', itemValueGp: 900, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pelt', metatag: 'Wolf', quantity: 1 }
  ] },
  { id: 'snow-wolf-cowl-rar', name: 'Snow Wolf Cowl', category: 'wondrous', rarity: 'rare', itemValueGp: 3500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pelt', metatag: 'Wolf', quantity: 1 }
  ] },
  { id: 'snow-wolf-cowl-ver', name: 'Snow Wolf Cowl', category: 'wondrous', rarity: 'very-rare', itemValueGp: 11500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'beast', componentName: 'Pelt', metatag: 'Wolf', quantity: 1 }
  ] },
  { id: 'sovereign-glue-ver', name: 'Sovereign Glue', category: 'wondrous', rarity: 'very-rare', itemValueGp: 4800, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of mucus', metatag: 'Black Pudding', quantity: 1 }
  ] },
  { id: 'spelleater-tome-unc', name: 'Spelleater Tome', category: 'wondrous', rarity: 'uncommon', itemValueGp: 850, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Brain', metatag: 'Tavern Mimic', quantity: 1 }
  ] },
  { id: 'spelleater-tome-rar', name: 'Spelleater Tome', category: 'wondrous', rarity: 'rare', itemValueGp: 2700, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Brain', metatag: 'Tavern Mimic', quantity: 1 }
  ] },
  { id: 'sphere-of-annihilation-ver', name: 'Sphere of Annihilation', category: 'wondrous', rarity: 'very-rare', itemValueGp: 15000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'stone-of-controlling-earth-elementals-rar', name: 'Stone of Controlling Earth Elementals', category: 'wondrous', rarity: 'rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'elemental', componentName: 'Core of earth', metatag: null, quantity: 1 }
  ] },
  { id: 'stone-of-good-luck-unc', name: 'Stone of Good Luck', category: 'wondrous', rarity: 'uncommon', itemValueGp: 1500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'humanoid', componentName: 'Heart', metatag: 'Halfling', quantity: 1 }
  ] },
  { id: 'talisman-of-pure-good-leg', name: 'Talisman of Pure Good', category: 'wondrous', rarity: 'legendary', itemValueGp: 72000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Heart', metatag: 'Good-aligned god', quantity: 1 }
  ] },
  { id: 'talisman-of-ultimate-evil-leg', name: 'Talisman of Ultimate Evil', category: 'wondrous', rarity: 'legendary', itemValueGp: 62000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Heart', metatag: 'Evil-aligned god', quantity: 1 }
  ] },
  { id: 'talisman-of-the-sphere-ver', name: 'Talisman of the Sphere', category: 'wondrous', rarity: 'very-rare', itemValueGp: 15000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Eye', metatag: null, quantity: 1 }
  ] },
  { id: 'tome-of-clear-thought-ver', name: 'Tome of Clear Thought', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'construct', componentName: 'Phial of blood', metatag: null, quantity: 1 }
  ] },
  { id: 'tome-of-leadership-and-influence-ver', name: 'Tome of Leadership and Influence', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Horn', metatag: null, quantity: 1 }
  ] },
  { id: 'tome-of-living-memories-unc', name: 'Tome of Living Memories', category: 'wondrous', rarity: 'uncommon', itemValueGp: 750, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Eye', metatag: 'Broodmother', quantity: 1 }
  ] },
  { id: 'tome-of-understanding-ver', name: 'Tome of Understanding', category: 'wondrous', rarity: 'very-rare', itemValueGp: 9200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Brain', metatag: null, quantity: 1 }
  ] },
  { id: 'universal-solvent-leg', name: 'Universal Solvent', category: 'wondrous', rarity: 'legendary', itemValueGp: 22400, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of acid', metatag: null, quantity: 1 }
  ] },
  { id: 'ventilation-unit-d-20-rar', name: 'Ventilation Unit D-20', category: 'wondrous', rarity: 'rare', itemValueGp: 2100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'ooze', componentName: 'Phial of acid and phial of mucus', metatag: 'Polyhedrooze', quantity: 1 }
  ] },
  { id: 'well-of-many-worlds-leg', name: 'Well of Many Worlds', category: 'wondrous', rarity: 'legendary', itemValueGp: 96000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'aberration', componentName: 'Hide', metatag: null, quantity: 1 }
  ] },
  { id: 'wind-fan-unc', name: 'Wind Fan', category: 'wondrous', rarity: 'uncommon', itemValueGp: 700, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'monstrosity', componentName: 'Pouch of feathers', metatag: null, quantity: 1 }
  ] },
  { id: 'winged-boots-rar', name: 'Winged Boots', category: 'wondrous', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'fiend', componentName: 'Pouch of feathers', metatag: null, quantity: 1 }
  ] },
  { id: 'wings-of-flying-rar', name: 'Wings of Flying', category: 'wondrous', rarity: 'rare', itemValueGp: 6000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'celestial', componentName: 'Pouch of feathers', metatag: null, quantity: 1 }
  ] },
  { id: 'wings-of-flying-brass-sleep-ver', name: 'Wings of Flying (Brass, Sleep)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 3500, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: 'Brass', quantity: 1 }
  ] },
  { id: 'wings-of-flying-bronze-repulsion-rar', name: 'Wings of Flying (Bronze, Repulsion)', category: 'wondrous', rarity: 'rare', itemValueGp: 1100, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: 'Bronze', quantity: 1 }
  ] },
  { id: 'wings-of-flying-copper-slow-rar', name: 'Wings of Flying (Copper, Slow)', category: 'wondrous', rarity: 'rare', itemValueGp: 1250, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: 'Copper', quantity: 1 }
  ] },
  { id: 'wings-of-flying-gold-weakening-ver', name: 'Wings of Flying (Gold, Weakening)', category: 'wondrous', rarity: 'very-rare', itemValueGp: 3200, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: 'Gold', quantity: 1 }
  ] },
  { id: 'wings-of-flying-silver-paralysing-leg', name: 'Wings of Flying (Silver, Paralysing)', category: 'wondrous', rarity: 'legendary', itemValueGp: 18000, craftingDc: null, craftingTimeHrs: null, essenceType: null, notes: null, components: [
    { creatureTypeId: 'dragon', componentName: 'Breath sac', metatag: 'Silver', quantity: 1 }
  ] },
];
