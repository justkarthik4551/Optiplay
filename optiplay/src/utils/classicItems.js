/**
 * Classic Items — Localized Indian version of the 12 original items.
 * Ref: docs/03_engineering/04_Algorithms_and_Logic.md (Verified Reference Values)
 * Source: Session_1_game.pdf (Prof. Tallys Yunes), adapted for Indian context.
 *
 * Classic Mode:
 *   - 12 items (fixed)
 *   - Capacity: 26 kg
 *   - Optimal value: ₹1,166 (7 items, 26 kg exactly)
 *
 * NOTE: Weights and values are unchanged from the original to preserve
 * the DP verification (₹1,166 optimal). Only names and emojis are localized.
 */

export const CLASSIC_ITEMS = [
  { id: 'microwave',       name: 'Microwave',        weight: 7, value: 290, emoji: '🍲' },
  { id: 'mixer',           name: 'Mixer Grinder',    weight: 5, value: 240, emoji: '🌪️' },
  { id: 'pressure-cooker', name: 'Pressure Cooker',  weight: 6, value: 238, emoji: '♨️' },
  { id: 'cricket-kit',     name: 'Cricket Kit',      weight: 5, value: 200, emoji: '🏏' },
  { id: 'carvaan',         name: 'Saregama Carvaan', weight: 4, value: 190, emoji: '📻' },
  { id: 'air-fryer',       name: 'Air Fryer',        weight: 5, value: 190, emoji: '🍟' },
  { id: 'mangoes',         name: 'Alphonso Mangoes', weight: 4, value: 161, emoji: '🥭' },
  { id: 'smartwatch',      name: 'Smartwatch',       weight: 3, value: 145, emoji: '⌚' },
  { id: 'madhubani',       name: 'Madhubani Art',    weight: 3, value: 130, emoji: '🖼️' },
  { id: 'speaker',         name: 'BT Speaker',       weight: 3, value: 123, emoji: '🔊' },
  { id: 'sandwich-maker',  name: 'Sandwich Maker',   weight: 3, value: 110, emoji: '🥪' },
  { id: 'dslr',            name: 'DSLR Camera',      weight: 2, value: 100, emoji: '📷' },
];

export const CLASSIC_CAPACITY = 26;
