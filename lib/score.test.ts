import { describe, it, expect } from 'vitest'
import { calculateTotalScore, calculateAxisScores } from './score'

describe('score', () => {
  describe('calculateTotalScore', () => {
    it('returns 100 when no issues found', () => {
      expect(calculateTotalScore(0, 0)).toBe(100)
    })

    it('deducts points for auto-fixed items', () => {
      // SCORE_AUTO_FIXED_PENALTY is 2
      expect(calculateTotalScore(5, 0)).toBe(90)
    })

    it('deducts points for needs-review items', () => {
      // SCORE_NEEDS_REVIEW_PENALTY is 5
      expect(calculateTotalScore(0, 4)).toBe(80)
    })

    it('combines both penalties', () => {
      expect(calculateTotalScore(5, 4)).toBe(70)
    })

    it('never goes below 0', () => {
      expect(calculateTotalScore(100, 100)).toBe(0)
    })

    it('handles large numbers', () => {
      expect(calculateTotalScore(9999, 9999)).toBe(0)
    })
  })

  describe('calculateAxisScores', () => {
    it('returns 100 for all axes when no patches', () => {
      const patches: Array<{ axis: string }> = []
      const result = calculateAxisScores(['readability', 'tone'], patches)
      expect(result).toEqual({ readability: 100, tone: 100 })
    })

    it('deducts per-axis for matching patches', () => {
      const patches = [
        { axis: 'readability' },
        { axis: 'readability' },
        { axis: 'readability' },
      ]
      // SCORE_AXIS_PATCH_PENALTY is 3
      const result = calculateAxisScores(['readability', 'tone'], patches)
      expect(result.readability).toBe(91)
      expect(result.tone).toBe(100)
    })

    it('ignores patches for axes not in axes_run', () => {
      const patches = [
        { axis: 'readability' },
        { axis: 'seo' }, // not in axes_run
      ]
      const result = calculateAxisScores(['readability'], patches)
      expect(result.readability).toBe(97)
      expect(result.seo).toBeUndefined()
    })

    it('handles empty axes_run', () => {
      const result = calculateAxisScores([], [{ axis: 'readability' }])
      expect(result).toEqual({})
    })

    it('never goes below 0 per axis', () => {
      const patches = Array(50).fill({ axis: 'readability' })
      const result = calculateAxisScores(['readability'], patches)
      expect(result.readability).toBe(0)
    })
  })
})
