import fs from 'fs'
import path from 'path'
import { logger } from '@/shared/lib/logger'

export interface PromptEntry {
  key: string
  group: string
  order: number
  variables: string[]
  prompt: string
  minTier?: string
}

/**
 * catalog.md をパースして Map<key, PromptEntry> を返す
 */
export function loadPromptCatalog(dir?: string): Map<string, PromptEntry> {
  const catalogPath = dir || path.join(process.cwd(), 'docs/prompts/catalog.md')

  if (!fs.existsSync(catalogPath)) {
    logger.warn('engine/prompt-catalog', 'Catalog not found', catalogPath)
    return new Map()
  }

  const content = fs.readFileSync(catalogPath, 'utf-8')
  const entries = new Map<string, PromptEntry>()

  // <!-- prompt-meta {...} --> に続く ```prompt ... ``` ブロックを抽出
  const blockRegex = /<!--\s*prompt-meta\s+({[\s\S]*?})\s*-->\s*\n*```prompt\n([\s\S]*?)```/g

  let match: RegExpExecArray | null
  while ((match = blockRegex.exec(content)) !== null) {
    try {
      const meta = JSON.parse(match[1].trim())
      const prompt = match[2].trim()

      entries.set(meta.key, {
        key: meta.key,
        group: meta.group || 'default',
        order: meta.order ?? 0,
        variables: meta.variables || [],
        prompt,
        minTier: meta.minTier,
      })
    } catch (err) {
      logger.error('engine/prompt-catalog', 'Failed to parse prompt entry', err)
    }
  }

  return entries
}

/**
 * テンプレート変数 {{variable}} を展開
 */
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

/**
 * 軸IDの配列から、catalogのプロンプトを組み立てて校正軸セクションを生成
 */
export function buildAxesSection(
  axes: string[],
  catalog: Map<string, PromptEntry>,
): string {
  return axes
    .map(id => {
      const entry = catalog.get(`axis_${id}`)
      return entry ? `- [${id}] ${entry.prompt}` : `- [${id}]`
    })
    .join('\n')
}
