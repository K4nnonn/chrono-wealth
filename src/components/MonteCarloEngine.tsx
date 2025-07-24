import React from 'react';

interface MonteCarloParams {
  seed: number;
  nPaths: number;
  horizonDays: number;
  startNetWorth: number;
  dailySurplusMu: number;
  dailySurplusSigma: number;
  dailyReturnMu: number;
  dailyReturnSigma: number;
}

interface MonteCarloResult {
  p10: number[];
  p50: number[];
  p90: number[];
  paths: number[][];
}

// Seeded random number generator for reproducible results
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  normal(): number {
    // Box-Muller transformation for normal distribution
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0;
  }
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;
  
  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function runMonteCarloSimulation(params: MonteCarloParams): MonteCarloResult {
  const { seed, nPaths, horizonDays, startNetWorth, dailySurplusMu, dailySurplusSigma, dailyReturnMu, dailyReturnSigma } = params;
  
  const rng = new SeededRandom(seed);
  const paths: number[][] = [];
  
  // Generate paths
  for (let path = 0; path < nPaths; path++) {
    const pathValues = [startNetWorth];
    let currentValue = startNetWorth;
    
    for (let day = 1; day <= horizonDays; day++) {
      // Generate random surplus and return
      const surplusShock = rng.normal() * dailySurplusSigma + dailySurplusMu;
      const returnShock = rng.normal() * dailyReturnSigma + dailyReturnMu;
      
      // Update net worth: compound returns + daily surplus
      currentValue = currentValue * (1 + returnShock) + surplusShock;
      pathValues.push(Math.max(0, currentValue)); // Prevent negative net worth
    }
    
    paths.push(pathValues);
  }
  
  // Calculate percentiles at each time point
  const p10: number[] = [];
  const p50: number[] = [];
  const p90: number[] = [];
  
  for (let day = 0; day <= horizonDays; day++) {
    const valuesAtDay = paths.map(path => path[day]);
    p10.push(percentile(valuesAtDay, 10));
    p50.push(percentile(valuesAtDay, 50));
    p90.push(percentile(valuesAtDay, 90));
  }
  
  return { p10, p50, p90, paths };
}

export function getMockFinancialData(timeHorizon: number) {
  const horizonDays = timeHorizon * 365;
  
  return runMonteCarloSimulation({
    seed: 42,
    nPaths: 5000,
    horizonDays,
    startNetWorth: 50000,
    dailySurplusMu: 85 / 30, // Monthly $85 / 30 days
    dailySurplusSigma: 70 / 30, // Monthly $70 std dev / 30 days
    dailyReturnMu: 0.072 / 252, // 7.2% annual return / 252 trading days
    dailyReturnSigma: 0.15 / Math.sqrt(252) // 15% annual volatility / sqrt(252)
  });
}