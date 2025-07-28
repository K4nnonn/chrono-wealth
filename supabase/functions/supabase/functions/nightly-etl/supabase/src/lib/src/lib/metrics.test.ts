import { calcSavingsRate, calcMomentum, liquidityRunway, categoryCV, monteCarloFan } from './metrics'

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
