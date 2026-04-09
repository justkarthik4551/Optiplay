/**
 * Truck Solver — Multi-Constraint 0/1 Knapsack via 3D Bottom-Up DP
 * Ref: docs/03_engineering/06_Pack_The_Truck_Algorithms.md §2
 *
 * Solves: max Σ v_i·x_i  s.t.  Σ w_i·x_i ≤ W,  Σ u_i·x_i ≤ U
 *
 * Complexity: O(N × W × U) time and space.
 * For our game bounds (N≤15, W≤100, U≤60) → ≤ 90,000 cells: instantaneous.
 *
 * @param {Array<{id,weight,volume,value}>} items
 * @param {number} maxWeight  - W
 * @param {number} maxVolume  - U
 * @returns {{ optimalValue: number, optimalSet: string[] }}
 *   optimalSet contains item IDs included in one optimal solution.
 */
export function truckSolver(items, maxWeight, maxVolume) {
  const n = items.length;
  const W = maxWeight;
  const U = maxVolume;

  // Build 3D DP table: dp[i][w][u] = max value using items 0..i-1
  // with at most w weight units and u volume units remaining.
  const dp = [];
  for (let i = 0; i <= n; i++) {
    dp[i] = [];
    for (let w = 0; w <= W; w++) {
      dp[i][w] = new Int32Array(U + 1); // zero-filled; typed array is faster
    }
  }

  for (let i = 1; i <= n; i++) {
    const { weight, volume, value } = items[i - 1];
    for (let w = 0; w <= W; w++) {
      for (let u = 0; u <= U; u++) {
        // Exclude item i
        dp[i][w][u] = dp[i - 1][w][u];
        // Include item i (if it fits in both dimensions)
        if (w >= weight && u >= volume) {
          const withItem = dp[i - 1][w - weight][u - volume] + value;
          if (withItem > dp[i][w][u]) {
            dp[i][w][u] = withItem;
          }
        }
      }
    }
  }

  const optimalValue = dp[n][W][U];

  // Traceback: recover the optimal item set
  const optimalSet = [];
  let w = W;
  let u = U;
  for (let i = n; i >= 1; i--) {
    if (dp[i][w][u] !== dp[i - 1][w][u]) {
      // Item i-1 (0-indexed) is included
      optimalSet.push(items[i - 1].id);
      w -= items[i - 1].weight;
      u -= items[i - 1].volume;
    }
  }

  return { optimalValue, optimalSet };
}
