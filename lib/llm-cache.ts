/**
 * File-based LLM response cache using JSONL format.
 * Stores responses keyed by (model, systemPrompt, userPrompt) hash.
 *
 * Active when LLM_CACHE_PROVIDER=local. When LLM_CACHE_PROVIDER=portkey (default),
 * caching is handled at the Portkey gateway level via x-portkey-cache headers.
 *
 * Both modes feed into unified stats via llm-cache-stats.ts.
 */
import { createHash } from 'node:crypto'
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { recordCacheHit, recordCacheMiss, getCacheProvider } from './llm-cache-stats'

// ─── Configuration ────────────────────────────────────────

interface CacheConfig {
  enabled?: boolean
  cacheDir?: string
  ttlMs?: number
  maxEntries?: number
}

interface CacheEntry {
  key: string
  response: string
  ts: number
  model: string
  empty: boolean
}

let config: Required<CacheConfig> = {
  enabled: false,
  cacheDir: '',
  ttlMs: 24 * 60 * 60 * 1000,
  maxEntries: 500,
}

const CACHE_FILE = 'llm-cache.jsonl'

export function configureLlmCache(opts: CacheConfig): void {
  config = { ...config, ...opts }
}

export function isLlmCacheEnabled(): boolean {
  return getCacheProvider() === 'local' && config.enabled
}

// ─── Key Generation ───────────────────────────────────────

export function buildCacheKey(model: string, systemPrompt: string, userPrompt: string): string {
  const hash = createHash('sha256')
    .update(`${model}\0${systemPrompt}\0${userPrompt}`)
    .digest('base64url')
  return hash.slice(0, 24)
}

// ─── Cache File I/O ───────────────────────────────────────

async function cacheFilePath(): Promise<string> {
  await mkdir(config.cacheDir, { recursive: true })
  return join(config.cacheDir, CACHE_FILE)
}

async function readEntries(): Promise<CacheEntry[]> {
  try {
    const content = await readFile(await cacheFilePath(), 'utf-8')
    return content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as CacheEntry)
  } catch {
    return []
  }
}

async function writeEntries(entries: CacheEntry[]): Promise<void> {
  const content = entries.map((e) => JSON.stringify(e)).join('\n') + (entries.length ? '\n' : '')
  await writeFile(await cacheFilePath(), content, 'utf-8')
}

// ─── Public API ───────────────────────────────────────────

export async function getCachedLlmResponse(
  model: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  if (!config.enabled) return null
  if (getCacheProvider() !== 'local') return null

  const key = buildCacheKey(model, systemPrompt, userPrompt)
  const entries = await readEntries()
  const now = Date.now()

  // Find latest entry with matching key
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i]
    if (entry.key === key) {
      if (now - entry.ts > config.ttlMs) return null
      recordCacheHit()
      return entry.response
    }
  }
  recordCacheMiss()
  return null
}

export async function setCachedLlmResponse(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  response: string,
  opts?: { force?: boolean },
): Promise<void> {
  if (!config.enabled) return
  if (getCacheProvider() !== 'local') return
  if (response === '' && !opts?.force) return

  const key = buildCacheKey(model, systemPrompt, userPrompt)
  const entries = await readEntries()

  // Remove old entries with same key
  const filtered = entries.filter((e) => e.key !== key)

  const entry: CacheEntry = {
    key,
    response,
    ts: Date.now(),
    model,
    empty: response === '',
  }
  filtered.push(entry)

  // Enforce maxEntries
  while (filtered.length > config.maxEntries) {
    filtered.shift()
  }

  await writeEntries(filtered)
}

export async function clearLlmCache(): Promise<void> {
  try {
    const fp = await cacheFilePath()
    await rm(fp, { force: true })
  } catch {
    // ignore
  }
}

export async function getLlmCacheStats(): Promise<{ entries: number; dir: string }> {
  const entries = await readEntries()
  return { entries: entries.length, dir: config.cacheDir }
}
