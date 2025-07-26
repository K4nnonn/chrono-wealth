import { quantileSorted } from 'd3-array'

export const calcSavingsRate = (income: number, expense: number) =>
  income === 0 ? -1 : (income - expense) / income

expimport { calcSavingsRate, calcMomentum, liquidityRunway, categoryCV, monteCarloFan } from './metrics'

describe('metrics functions', () => {
  test('calcSavingsRate returns correct values', () => {
    expect(calcSavingsRate(1000, 500)).toBeCloseTo(0.5)
    expect(calcSavingsRate(0, 100)).toBe(-1)
  })

  test('calcMomentum computes difference', () => {
    expect(calcMomentum(0.2, 0.1)).toBeCloseTo(0.1)
  })

  test('liquidityRunway computes correct ratios', () => {
    expect(liquidityRunway(1000, 100)).toBeCloseTo(10)
    expect(liquidityRunway(1000, 0)).toBe(999)
  })

  test('categoryCV computes coefficient of variation', () => {
    const series = [2, 4, 4, 4, 5, 5, 7, 9]
    expect(categoryCV(series)).toBeCloseTo(0.4)
  })

  test('monteCarloFan returns correct array structure', () => {
    const days = 10
    const res = monteCarloFan(1000, 0, 0, 0, 0, days, 10)
    expect(res.length).toBe(days)
    res.forEach(day => {
      expect(day.length).toBe(3)
      day.forEach(val => {
        expect(typeof val).toBe('number')
      })
    })
  })
})
ort const calcMomentum = (sr30: number, sr90: number) => sr30 - sr90

export const liquidityRunway = (balance: number, adr90: number) =>
  adr90 === 0 ? 999 : balance / adr90

export const categoryCV = (series: number[]) => {
  const μ = series.reduce((a, b) => a + b, 0) / series.length
  const σ = Math.sqrt(series.map(x => (x - μ) ** 2).reduce((a, b) => a + b, 0) / series.length)
  return μ === 0 ? 0 : σ / μ
}

/** Monte-Carlo fan chart – returns P10, P50, P90 arrays */
export function monteCarloFan(
  startNW: number,
  surplusμ: number, surplusσ: number,
  rμ: number, rσ: number,
  days: number, paths = 5000
) {
  const results: number[][] = Array.from({ length: days }, () => [])
  for (let p = 0; p < paths; p++) {
    let nw = startNW
    for (let d = 0; d < days; d++) {
      const S = surplusμ + surplusσ * randn()
      const r = rμ / 252 + rσ / Math.sqrt(252) * randn()
      nw = (nw + S) * (1 + r)
      results[d].push(nw)
    }
  }
  return results.map(dayArr => [
    quantileSorted(dayArr.sort((a, b) => a - b), 0.10),
    quantileSorted(dayArr, 0.50),
    quantileSorted(dayArr, 0.90)
  ])
}

function randn() { return Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random()) }
