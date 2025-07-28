import { quantileSorted } from 'd3-array'

/**
 * Calculate the savings rate given a monthly income and expense.
 * Returns -1 if income is zero to avoid dividing by zero.
 */
export const calcSavingsRate = (income: number, expense: number) =>
  income === 0 ? -1 : (income - expense) / income

/**
 * Momentum compares the short‑term savings rate to the long‑term savings rate.
 * A positive value indicates improving savings habits.
 */
export const calcMomentum = (sr30: number, sr90: number) => sr30 - sr90

/**
 * Liquidity runway measures how many periods a balance would last given an average drawdown.
 * If average drawdown is zero it returns a sentinel of 999.
 */
export const liquidityRunway = (balance: number, adr90: number) =>
  adr90 === 0 ? 999 : balance / adr90

/**
 * Compute the coefficient of variation for a series of numbers.
 * Returns zero if the mean is zero.
 */
export const categoryCV = (series: number[]) => {
  const μ = series.reduce((a, b) => a + b, 0) / series.length
  const σ = Math.sqrt(series.map(x => (x - μ) ** 2).reduce((a, b) => a + b, 0) / series.length)
  return μ === 0 ? 0 : σ / μ
}

/**
 * Generate a Monte Carlo fan chart representing P10, P50 and P90 percentiles of net worth.
 * A deterministic random generator can be supplied to ensure repeatable results in tests.
 */
export function monteCarloFan(
  startNW: number,
  surplusμ: number,
  surplusσ: number,
  rμ: number,
  rσ: number,
  days: number,
  paths = 5000,
  rand: () => number = Math.random
): number[][] {
  const results: number[][] = Array.from({ length: days }, () => [])
  for (let p = 0; p < paths; p++) {
    let nw = startNW
    for (let d = 0; d < days; d++) {
      const S = surplusμ + surplusσ * randn(rand)
      const r = rμ / 252 + (rσ / Math.sqrt(252)) * randn(rand)
      nw = (nw + S) * (1 + r)
      results[d].push(nw)
    }
  }
  return results.map(dayArr => {
    const sorted = dayArr.slice().sort((a, b) => a - b)
    const result = [
      quantileSorted(sorted, 0.10),
      quantileSorted(sorted, 0.50),
      quantileSorted(sorted, 0.90),
    ]
    return result.filter((val): val is number => val !== undefined)
  })
}

/**
 * Sample from a standard normal distribution using the Box–Muller transform.
 * Accepts a random function to allow deterministic seeding in tests.
 */
function randn(rand: () => number) {
  return Math.sqrt(-2 * Math.log(rand())) * Math.cos(2 * Math.PI * rand())
}

/**
 * Standard normal cumulative distribution function.
 * Approximated using Abramowitz and Stegun formula.
 */
function phi(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z))
  const d = 0.3989423 * Math.exp(-z * z / 2)
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  if (z > 0) {
    prob = 1 - prob
  }
  return prob
}

/**
 * Probability of achieving a goal given current net worth, target amount, horizon and projected returns.
 * Implements the formula from the AI logic reference.
 */
export function goalProbability(
  NW0: number,
  G: number,
  T: number,
  mu_g: number,
  sigma_g: number
): number {
  const numerator = Math.log(G / NW0) - (mu_g - 0.5 * sigma_g * sigma_g) * T
  const denominator = sigma_g * Math.sqrt(T)
  return phi(numerator / denominator)
}

/**
 * Resilience score combines liquidity runway, savings rate strength and net worth volatility
 * relative to a benchmark. Each component is weighted per the AI logic reference and the result
 * is scaled to the 0–100 range.
 */
export function resilienceScore(
  runwayPercentile: number,
  savingsRatePercentile: number,
  netWorthVolatility: number,
  benchmarkVolatility: number
): number {
  const volTerm = benchmarkVolatility === 0 ? 0 : 1 - netWorthVolatility / benchmarkVolatility
  const score = 0.4 * runwayPercentile + 0.3 * savingsRatePercentile + 0.3 * volTerm
  const scaled = score * 100
  return Math.max(0, Math.min(100, scaled))
}