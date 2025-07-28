/**
 * Advanced Forecast Models for FlowSightFi
 * Implements Monte Carlo simulation, BSTS-like forecast, K-means clustering, and Elastic Net regression.
 */

export function generateNormal(mean = 0, stdDev = 1): number {
  // Box-Muller transform
  let u = 1 - Math.random();
  let v = Math.random();
  return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function monteCarloNetWorthForecast(
  initialNetWorth: number,
  meanReturn: number,
  stdDeviation: number,
  years: number,
  numSimulations = 1000
): number[] {
  const results: number[] = [];
  for (let i = 0; i < numSimulations; i++) {
    let value = initialNetWorth;
    for (let t = 0; t < years; t++) {
      const randomReturn = generateNormal(meanReturn, stdDeviation);
      value = value * (1 + randomReturn);
    }
    results.push(value);
  }
  return results;
}

export function bstsSpendingForecast(
  historical: number[],
  forecastSteps: number
): number[] {
  // Simple pseudo-BSTS: using last value as trend and adding noise
  const forecasts: number[] = [];
  if (historical.length === 0) return forecasts;
  let last = historical[historical.length - 1];
  let trend = last - (historical.length > 1 ? historical[historical.length - 2] : 0);
  for (let i = 0; i < forecastSteps; i++) {
    // drift with trend and random noise
    const noise = generateNormal(0, Math.max(Math.abs(trend), 1) * 0.1);
    last = last + trend + noise;
    forecasts.push(last);
    // dampen trend slightly
    trend = trend * 0.9;
  }
  return forecasts;
}

export function kMeansClustering(data: number[][], k: number, iterations = 10): {centroids: number[][], labels: number[]} {
  if (data.length === 0 || k <= 0) {
    return { centroids: [], labels: [] };
  }
  // initialize centroids randomly from data points
  const centroids = data.slice(0, k).map(row => row.slice());
  let labels = new Array(data.length).fill(0);
  for (let iter = 0; iter < iterations; iter++) {
    // assign labels
    for (let i = 0; i < data.length; i++) {
      let minDist = Infinity;
      let minIndex = 0;
      for (let c = 0; c < centroids.length; c++) {
        const dist = Math.hypot(...data[i].map((v, idx) => v - centroids[c][idx]));
        if (dist < minDist) {
          minDist = dist;
          minIndex = c;
        }
      }
      labels[i] = minIndex;
    }
    // recompute centroids
    for (let c = 0; c < k; c++) {
      const clusterPoints = data.filter((_, idx) => labels[idx] === c);
      if (clusterPoints.length === 0) continue;
      const dims = clusterPoints[0].length;
      const newCentroid = new Array(dims).fill(0);
      for (const point of clusterPoints) {
        for (let d = 0; d < dims; d++) {
          newCentroid[d] += point[d];
        }
      }
      centroids[c] = newCentroid.map(sum => sum / clusterPoints.length);
    }
  }
  return { centroids, labels };
}

export function elasticNetRegression(
  X: number[][],
  y: number[],
  alpha = 1,
  l1Ratio = 0.5,
  iterations = 1000,
  learningRate = 0.01
): { coefficients: number[], intercept: number } {
  const nSamples = X.length;
  const nFeatures = X[0].length;
  let coefficients = new Array(nFeatures).fill(0);
  let intercept = 0;
  for (let iter = 0; iter < iterations; iter++) {
    // predictions
    const preds = X.map(row => {
      let sum = intercept;
      for (let j = 0; j < nFeatures; j++) {
        sum += row[j] * coefficients[j];
      }
      return sum;
    });
    // compute gradients
    let interceptGrad = 0;
    const coefGrad = new Array(nFeatures).fill(0);
    for (let i = 0; i < nSamples; i++) {
      const error = preds[i] - y[i];
      interceptGrad += error;
      for (let j = 0; j < nFeatures; j++) {
        coefGrad[j] += error * X[i][j];
      }
    }
    // update intercept
    intercept -= (learningRate * (interceptGrad / nSamples));
    // update coefficients with L1 and L2 penalties
    for (let j = 0; j < nFeatures; j++) {
      const grad = coefGrad[j] / nSamples;
      const l2Penalty = (1 - l1Ratio) * alpha * coefficients[j];
      const l1Penalty = l1Ratio * alpha * Math.sign(coefficients[j]);
      coefficients[j] -= learningRate * (grad + l2Penalty + l1Penalty);
    }
  }
  return { coefficients, intercept };
}
