import { describe, it, expect } from 'vitest'
import { loadPromptCatalog, fillTemplate, buildAxesSection } from '@/shared/llm/prompt-catalog'

describe('loadPromptCatalog', () => {
  it('loads catalog from default path', () => {
    const catalog = loadPromptCatalog()
    expect(catalog.size).toBeGreaterThan(0)
  })

  it('has required keys', () => {
    const catalog = loadPromptCatalog()
    const requiredKeys = [
      'proofread_system_prompt',
      'axis_readability',
      'axis_ai_tone',
      'axis_tone',
      'axis_seo',
      'axis_structure',
      'proofread_output_format',
      'proofread_user_prompt',
    ]
    for (const key of requiredKeys) {
      expect(catalog.has(key), `Missing key: ${key}`).toBe(true)
    }
  })

  it('entries have correct structure', () => {
    const catalog = loadPromptCatalog()
    for (const [key, entry] of catalog) {
      expect(entry.key).toBe(key)
      expect(entry.group).toBeTruthy()
      expect(entry.order).toBeGreaterThan(0)
      expect(entry.prompt.length).toBeGreaterThan(0)
    }
  })

  it('axis entries have minTier', () => {
    const catalog = loadPromptCatalog()
    const axisEntry = catalog.get('axis_readability')
    expect(axisEntry?.minTier).toBe('low')
    const highTierEntry = catalog.get('axis_seo')
    expect(highTierEntry?.minTier).toBe('high')
  })

  it('user_prompt has variables', () => {
    const catalog = loadPromptCatalog()
    const userPrompt = catalog.get('proofread_user_prompt')
    expect(userPrompt?.variables).toContain('axes')
    expect(userPrompt?.variables).toContain('output_format')
    expect(userPrompt?.variables).toContain('text')
  })

  it('returns empty map for missing file', () => {
    const catalog = loadPromptCatalog('/nonexistent/path/catalog.md')
    expect(catalog.size).toBe(0)
  })
})

describe('fillTemplate', () => {
  it('replaces single variable', () => {
    expect(fillTemplate('Hello {{name}}', { name: 'World' })).toBe('Hello World')
  })

  it('replaces multiple variables', () => {
    const result = fillTemplate('{{a}} and {{b}}', { a: 'A', b: 'B' })
    expect(result).toBe('A and B')
  })

  it('leaves unreplaced variables as-is', () => {
    expect(fillTemplate('{{a}} {{b}}', { a: 'A' })).toBe('A {{b}}')
  })

  it('handles empty template', () => {
    expect(fillTemplate('', { a: 'A' })).toBe('')
  })
})

describe('buildAxesSection', () => {
  it('builds axes section from catalog', () => {
    const catalog = loadPromptCatalog()
    const section = buildAxesSection(['readability', 'ai_tone'], catalog)
    expect(section).toContain('[readability]')
    expect(section).toContain('[ai_tone]')
    expect(section).toContain('読みやすさ')
    expect(section).toContain('AIっぽさ')
  })

  it('handles unknown axis id', () => {
    const catalog = loadPromptCatalog()
    const section = buildAxesSection(['unknown_axis'], catalog)
    expect(section).toContain('[unknown_axis]')
  })

  it('handles empty axes', () => {
    const catalog = loadPromptCatalog()
    const section = buildAxesSection([], catalog)
    expect(section).toBe('')
  })
})
