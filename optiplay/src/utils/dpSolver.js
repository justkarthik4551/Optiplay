/**
 * DP Solver — 0/1 Knapsack via Bottom-Up Dynamic Programming
 * Ref: docs/03-algorithms.md §1
 *
 * @param {Array<{id: string, weight: number, value: number}>} items
 * @param {number} capacity - Maximum bag weight (W)
 * @returns {{ optimalValue: number, optimalSet: string[] }}
 *   optimalSet contains the IDs of items in one optimal solution.
 */
export function dpSolver(items, capacity) {
  const n = items.length;
  const W = capacity;

  // Build the 2D DP table: dp[i][w] = max value using items 0..i-1 with capacity w
  // Using (n+1) x (W+1) table
  const dp = [];
  for (let i = 0; i <= n; i++) {
    dp[i] = new Array(W + 1).fill(0);
  }

  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];
    for (let w = 0; w <= W; w++) {
      // Exclude item i
      dp[i][w] = dp[i - 1][w];
      // Include item i (if it fits and yields more value)
      if (weight <= w && dp[i - 1][w - weight] + value > dp[i][w]) {
        dp[i][w] = dp[i - 1][w - weight] + value;
      }
    }
  }

  const optimalValue = dp[n][W];

  // Traceback to find one optimal set
  const optimalSet = [];
  let remainingCapacity = W;
  for (let i = n; i >= 1; i--) {
    if (dp[i][remainingCapacity] !== dp[i - 1][remainingCapacity]) {
      // Item i-1 (0-indexed) is included
      optimalSet.push(items[i - 1].id);
      remainingCapacity -= items[i - 1].weight;
    }
  }

  return { optimalValue, optimalSet };
}
