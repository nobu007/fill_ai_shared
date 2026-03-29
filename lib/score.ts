/**
 * Score calculation utilities
 * Shared between v2/route.ts and v2/stream/route.ts
 */
import { SCORE_AUTO_FIXED_PENALTY, SCORE_NEEDS_REVIEW_PENALTY, SCORE_AXIS_PATCH_PENALTY } from '../config'

/**
 * Calculate overall score based on auto-fixed and needs-review counts
 */
export function calculateTotalScore(auto_fixed: number, needs_review: number): number {
  return Math.max(0, 100 - auto_fixed * SCORE_AUTO_FIXED_PENALTY - needs_review * SCORE_NEEDS_REVIEW_PENALTY)
}

/**
 * Calculate per-axis scores based on patch counts
 */
export function calculateAxisScores(
  axes_run: string[],
  allPatches: Array<{ axis: string }>,
): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const axis of axes_run) {
    const axisPatches = allPatches.filter(p => p.axis === axis)
    scores[axis] = Math.max(0, 100 - axisPatches.length * SCORE_AXIS_PATCH_PENALTY)
  }
  return scores
}
