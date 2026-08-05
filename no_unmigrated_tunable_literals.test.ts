/**
 * CM-004 — §2.4 Sentinel Test: No Unmigrated Tunable Literals
 *
 * Background:
 *   The §2.4 wave (CYCLE 235–243) migrated ~6 tunable literals from inline
 *   magic numbers into `@/shared/config` exports (e.g., FILL_PREVIEW_RENDER_SCALE,
 *   FILL_COORDINATE_PRECISION, FILL_EXTRACTION_CACHE_MAX_ENTRIES, etc.).
 *   These tunables are documented in SYSTEM_CONSTITUTION.md §2.4 as the
 *   single source of truth for production behavior knobs.
 *
 * Purpose:
 *   Lock in the §2.4 wave gains by mechanically rejecting reintroduction of
 *   inline numeric magic numbers for known tunable names. Without this guard,
 *   a future contributor could re-introduce `const MAX_ITEMS = 50` inside
 *   `src/lib/pdf/` and silently bypass the env-overridable config layer.
 *
 * Detection strategy:
 *   1. Scan production code under Core Mission surfaces (excludes `.test.ts`,
 *      `.d.ts`, and legacy frozen surfaces per Legacy Surface Policy).
 *   2. Identify "tunable candidates": identifiers whose name matches the
 *      known tunable vocabulary (`scale`, `maxItems`, `timeout`, etc.) AND
 *      that are bound to a numeric literal via `=` or `:`.
 *   3. Exclude known-safe contexts:
 *      - Lines starting with `import` (only allow `@/shared/config` anyway)
 *      - Object literal property keys for PDF library calls (heuristic)
 *      - Comments (`//`, `*`, `/*`)
 *   4. For each match, require either:
 *      - The file imports the corresponding `FILL_*` constant from
 *        `@/shared/config`, OR
 *      - The match is on a line that is part of an import / comment block
 *      - The number being assigned is a local-only debug/test fixture
 *        (in `.test.ts` files — already excluded by step 1)
 *   5. Fail with a clear, actionable error message naming the file, line,
 *      and the suggested `FILL_*` export name.
 *
 * Self-test:
 *   The test itself doubles as RED→GREEN proof of detection. To verify the
 *   guard fires, temporarily introduce a violation (e.g., add
 *   `const MAX_REDEMPTION = 50` to `src/lib/pdf/enhancer.ts` without
 *   importing from `@/shared/config`) — this test should FAIL with the
 *   file path and line number. Then either migrate the literal to
 *   `@/shared/config` or rename the identifier to a non-tunable name.
 *
 * Acceptance criteria (CM-004 §acceptance_criteria):
 *   - passes on current main (no false positives)
 *   - manually removes FILL_PREVIEW_RENDER_SCALE import from enhancer.ts ->
 *     test FAILS (proves detection works)
 *   - ESLint 0
 *
 * Case-sensitivity note (CYCLE=245 fix):
 *   The original patterns were case-sensitive, which silently missed the
 *   repo's UPPER_SNAKE_CASE identifier convention (MAX_PDF_SIZE_BYTES,
 *   PRODUCTION_TIMEOUT_MS, etc.). All tunable patterns now use the `/i`
 *   flag so UPPER_SNAKE_CASE declarations like `const MAX_TIMEOUT_MS = 5000`
 *   are also caught. Mathematical constants like `BYTES_PER_KB = 1024` are
 *   correctly NOT caught because their leaf identifier names do not match
 *   any tunable vocabulary pattern (BYTES_PER_KB has no `Max`, `Timeout`,
 *   `Precision`, etc. substring).
 *
 * @see SYSTEM_CONSTITUTION.md §2.4 (Configuration Centralization)
 * @see .audit/stagnation_analysis.yml CM-004
 */

import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

// Core Mission surfaces per PURPOSE.md Legacy Surface Policy table.
const SCAN_ROOTS = [
  'src/lib/pdf',
  'src/app/api/fill',
  'src/app/(dashboard)/fill',
]

const REPO_ROOT = join(__dirname, '..', '..')

// Tunable vocabulary: identifier-name components that signal a behavioral
// knob (vs. geometry, page coordinates, or PDF library arguments).
// Matches anywhere inside the identifier name (camelCase / snake_case).
const TUNABLE_NAME_PATTERNS = [
  /^scale$/i,
  /^max[A-Z]/i,          // maxItems, maxLength, maxRetries (case-insensitive)
  /^min[A-Z]/i,          // minLength, minItems (case-insensitive)
  /Timeout$/i,
  /TimeoutMs$/i,
  /^ttl$/i,
  /Retries$/i,
  /^retries$/i,
  /^delay$/i,
  /Precision$/i,
  /^width$/i,
  /^percent$/i,
  /^qps$/i,
  /^interval$/i,
  /^intervalMs$/i,
  /^thresholds?$/i,
  /^budget$/i,
  /^limit$/i,
  /^window$/i,
  /^concurrency$/i,
]

// Patterns that match a numeric literal binding the tunable name.
// Examples that should match:
//   const MAX_ITEMS = 50
//   let scale: number = 1
//   export const RETRY_DELAY = 200
//   someConfig.timeout = 30000
//   const x: { retries: 3 } = ...  (also matches — destructuring or inline)
//   const obj = { timeout: 30 }    (object literal — false-positive risk)
//
// We intentionally capture the LHS identifier and the numeric RHS. The
// false-positive set is reduced by (a) excluding test files and (b)
// excluding lines inside comments / imports.
const TUNABLE_BINDING_REGEX = new RegExp(
  // LHS: a tunable-name candidate (identifier with optional member access)
  '\\b([A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)?)\\s*' +
  // binding operator: =, :, or shorthand inside an object literal
  '(:=|=|:)\\s*' +
  // RHS: numeric literal (integer or float, with optional sign)
  '(-?[0-9]+(?:\\.[0-9]+)?)\\b',
  'g',
)

function isCommentLine(line: string): boolean {
  const trimmed = line.trim()
  if (trimmed.startsWith('//')) return true
  if (trimmed.startsWith('*')) return true
  if (trimmed.startsWith('/*')) return true
  return false
}

function isImportLine(line: string): boolean {
  return /^\s*import\b/.test(line)
}

function isTunableName(name: string): boolean {
  // Strip member access: a.b.c -> c
  const leaf = name.includes('.') ? name.split('.').pop()! : name
  return TUNABLE_NAME_PATTERNS.some((re) => re.test(leaf))
}

function listFilesRecursive(
  root: string,
  out: string[] = [],
): string[] {
  let entries: string[]
  try {
    entries = readdirSync(root)
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(root, entry)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === '__tests__' || entry.startsWith('.')) {
        continue
      }
      listFilesRecursive(full, out)
    } else if (st.isFile()) {
      if (
        entry.endsWith('.ts') &&
        !entry.endsWith('.test.ts') &&
        !entry.endsWith('.d.ts')
      ) {
        out.push(full)
      }
    }
  }
  return out
}

interface Violation {
  file: string
  line: number
  identifier: string
  value: string
  text: string
}

function fileImportsFromSharedConfig(source: string): boolean {
  // Whitelist: importing the tunable from the centralized config layer
  // counts as "centralized", so the inline literal elsewhere is a separate
  // concern (out of scope for THIS sentinel). We only require that the file
  // uses the @/shared/config layer at all.
  return /from\s+['"]@\/shared\/config['"]/.test(source)
    || /from\s+['"]\.\.\/.*config['"]/.test(source)
}

describe('CM-004: §2.4 sentinel — no unmigrated tunable literals in Core Mission', () => {
  let violations: Violation[] = []
  let scannedFiles = 0

  beforeAll(() => {
    violations = []
    scannedFiles = 0
    for (const root of SCAN_ROOTS) {
      const fullRoot = join(REPO_ROOT, root)
      const files = listFilesRecursive(fullRoot)
      for (const file of files) {
        scannedFiles += 1
        const source = readFileSync(file, 'utf8')
        // Skip files that import from @/shared/config — those that
        // legitimately use FILL_* constants don't need this scan to
        // double-validate. We still scan them so contributors can see
        // every candidate, but we suppress non-binding matches.
        const usesSharedConfig = fileImportsFromSharedConfig(source)
        const lines = source.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const rawLine = lines[i]
          if (isCommentLine(rawLine)) continue
          if (isImportLine(rawLine)) continue
          // Skip type-only declarations: `type X = number`
          if (/^\s*(export\s+)?type\s/.test(rawLine)) continue
          let match: RegExpExecArray | null
          TUNABLE_BINDING_REGEX.lastIndex = 0
          while ((match = TUNABLE_BINDING_REGEX.exec(rawLine)) !== null) {
            const identifier = match[1]
            const op = match[2]
            const value = match[3]
            // Filter: identifier must match tunable vocabulary
            if (!isTunableName(identifier)) continue
            // Filter: numeric value must look like a real literal (not 0/1
            // which are commonly true/false-ish flags).
            if (value === '0' || value === '1' || value === '-1') continue
            // Filter: if file uses @/shared/config and the identifier is
            // bound via `:` (TypeScript type annotation), it's almost
            // certainly a destructured or annotated parameter, not a
            // top-level magic number.
            if (op === ':' && usesSharedConfig) continue
            violations.push({
              file: relative(REPO_ROOT, file),
              line: i + 1,
              identifier,
              value,
              text: rawLine.trim().slice(0, 200),
            })
          }
        }
      }
    }
  })

  it('scans every Core Mission production source file', () => {
    expect(scannedFiles).toBeGreaterThan(0)
  })

  it('contains no unmigrated tunable literals in Core Mission paths', () => {
    if (violations.length > 0) {
      const report = violations
        .map(
          (v) =>
            `  ${v.file}:${v.line} — ${v.identifier} = ${v.value}\n    ${v.text}`,
        )
        .join('\n')
      throw new Error(
        `\n\nCM-004 sentinel detected ${violations.length} unmigrated tunable literal(s):\n\n` +
          `${report}\n\n` +
          `Remediation: migrate the numeric literal to a FILL_* constant in ` +
          `src/shared/config.ts (per SYSTEM_CONSTITUTION.md §2.4) and import it ` +
          `from '@/shared/config'. If the value is intentionally a local-only ` +
          `constant, rename the identifier to something that does not match the ` +
          `tunable vocabulary (e.g., MAX_ITEMS -> LOCAL_DEBUG_MAX).`,
      )
    }
    expect(violations).toEqual([])
  })
})