import { describe, it, expect } from 'vitest'
import { calculateTotalScore, calculateAxisScores } from './score'
import { SCORE_AUTO_FIXED_PENALTY, SCORE_NEEDS_REVIEW_PENALTY, SCORE_AXIS_PATCH_PENALTY } from '../config'

describe('score', () => {
  describe('calculateTotalScore', () => {

    it('should calculate score with auto-fixed items', () => {
      const score = calculateTotalScore(3, 0)
      expect(score).toBe(94) // 100 - 3 * 2
    })

    it('should calculate score with needs-review items', () => {
      const score = calculateTotalScore(0, 2)
      expect(score).toBe(90) // 100 - 2 * 5
    })

    it('should calculate score with both types of items', () => {
      const score = calculateTotalScore(2, 3)
      expect(score).toBe(81) // 100 - 2*2 - 3*5
    })

    it('should not return negative scores', () => {
      const score = calculateTotalScore(100, 100)
      expect(score).toBe(0)
    })

    it('should return 100 for no issues', () => {
      const score = calculateTotalScore(0, 0)
      expect(score).toBe(100)
    })
  })

  describe('calculateAxisScores', () => {
    it('should calculate scores for each axis', () => {
      const axes_run = ['structure', 'readability', 'tone']
      const allPatches = [
        { axis: 'structure' },
        { axis: 'structure' },
        { axis: 'readability' },
        { axis: 'tone' },
        { axis: 'unknown' }
      ]

      const scores = calculateAxisScores(axes_run, allPatches)
      
      expect(scores).toEqual({
        structure: 94, // 100 - 2 * 3
        readability: 97, // 100 - 1 * 3
        tone: 97 // 100 - 1 * 3
      })
    })

    it('should return empty object for empty axes', () => {
      const scores = calculateAxisScores([], [])
      expect(scores).toEqual({})
    })

    it('should not include axes not in axes_run', () => {
      const axes_run = ['structure']
      const allPatches = [
        { axis: 'structure' },
        { axis: 'readability' }
      ]

      const scores = calculateAxisScores(axes_run, allPatches)
      expect(scores).toEqual({
        structure: 97 // 100 - 1 * 3
      })
    })

    it('should not return negative scores', () => {
      const axes_run = ['structure']
      const allPatches = Array(200).fill({ axis: 'structure' })

      const scores = calculateAxisScores(axes_run, allPatches)
      expect(scores.structure).toBe(0)
    })
  })
})
