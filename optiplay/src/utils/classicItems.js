/**
 * Classic Items — The 12 original items from Prof. Tallys Yunes' "Pack That Bag!" game.
 * Ref: docs/04_Algorithms_and_Logic.md (Verified Reference Values)
 * Source: Session_1_game.pdf
 *
 * Classic Mode:
 *   - 12 items (fixed)
 *   - Capacity: 26 lbs
 *   - Optimal value: $1,166 (7 items, 26 lbs)
 */

export const CLASSIC_ITEMS = [
  { id: 'computer',    name: 'Computer',    weight: 7, value: 290, emoji: '🖥️' },
  { id: 'keurig',      name: 'Keurig',      weight: 5, value: 240, emoji: '☕' },
  { id: 'printer',     name: 'Printer',     weight: 6, value: 238, emoji: '🖨️' },
  { id: 'playstation', name: 'PlayStation', weight: 5, value: 200, emoji: '🎮' },
  { id: 'projector',   name: 'Projector',   weight: 4, value: 190, emoji: '📽️' },
  { id: 'robovac',     name: 'Robo Vac',    weight: 5, value: 190, emoji: '🤖' },
  { id: 'wine',        name: 'Wine',        weight: 4, value: 161, emoji: '🍷' },
  { id: 'tablet',      name: 'Tablet',      weight: 3, value: 145, emoji: '📱' },
  { id: 'painting',    name: 'Painting',    weight: 3, value: 130, emoji: '🖼️' },
  { id: 'speaker',     name: 'Speaker',     weight: 3, value: 123, emoji: '🔊' },
  { id: 'toaster',     name: 'Toaster',     weight: 3, value: 110, emoji: '🍞' },
  { id: 'camera',      name: 'Camera',      weight: 2, value: 100, emoji: '📷' },
];

export const CLASSIC_CAPACITY = 26;
