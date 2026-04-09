/**
 * Truck Items — Classic dataset for "Pack the Truck!" (Game 2).
 * Indian household/furniture items — moving-day scenario.
 *
 * Truck Constraints:
 *   maxWeight = 100 kg
 *   maxVolume = 60 cu.ft.
 *
 * Optimal solution is computed at runtime by truckSolver.js.
 */

export const TRUCK_ITEMS = [
  { id: 'refrigerator',    name: 'Refrigerator',    emoji: '🧊', weight: 40, volume: 20, value: 850 },
  { id: 'washing-machine', name: 'Washing Machine', emoji: '🫧', weight: 35, volume: 18, value: 780 },
  { id: 'led-tv',          name: 'LED TV (55")',    emoji: '📺', weight: 20, volume: 15, value: 650 },
  { id: 'sofa-set',        name: 'Sofa Set',        emoji: '🛋️', weight: 45, volume: 25, value: 900 },
  { id: 'dining-table',    name: 'Dining Table',    emoji: '🍽️', weight: 30, volume: 20, value: 720 },
  { id: 'microwave',       name: 'Microwave',       emoji: '🍲', weight: 12, volume:  6, value: 340 },
  { id: 'air-conditioner', name: 'Air Conditioner', emoji: '❄️', weight: 28, volume: 12, value: 680 },
  { id: 'study-desk',      name: 'Study Desk',      emoji: '🖥️', weight: 22, volume: 14, value: 560 },
  { id: 'almirah',         name: 'Almirah',         emoji: '🗄️', weight: 50, volume: 28, value: 950 },
  { id: 'bookshelf',       name: 'Bookshelf',       emoji: '📚', weight: 18, volume: 16, value: 480 },
  { id: 'cricket-kit-bag', name: 'Cricket Kit Bag', emoji: '🏏', weight:  8, volume:  5, value: 220 },
  { id: 'suitcase',        name: 'Suitcase',        emoji: '🧳', weight: 10, volume:  7, value: 280 },
];

export const TRUCK_MAX_WEIGHT = 100; // kg
export const TRUCK_MAX_VOLUME = 60;  // cu.ft.
