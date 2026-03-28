import { describe, it, expect } from 'vitest'
import { sanitizeProofreadHtml } from '@/shared/lib/sanitize'

describe('sanitize', () => {
  describe('sanitizeProofreadHtml', () => {
    it('passes through safe HTML unchanged', () => {
      const html = '<p>こんにちは</p>'
      expect(sanitizeProofreadHtml(html)).toBe(html)
    })

    it('removes script tags', () => {
      expect(sanitizeProofreadHtml('<p>safe</p><script>alert("xss")</script>')).toBe('<p>safe</p>')
    })

    it('removes event handlers', () => {
      const result = sanitizeProofreadHtml('<p onclick="alert(1)">click</p>')
      expect(result).not.toContain('onclick')
      expect(result).toContain('click')
    })

    it('removes style attributes', () => {
      const result = sanitizeProofreadHtml('<p style="color:red">text</p>')
      expect(result).not.toContain('style=')
    })

    it('preserves allowed tags', () => {
      const html = '<h1>Title</h1><ul><li>item</li></ul><blockquote>quote</blockquote>'
      expect(sanitizeProofreadHtml(html)).toBe(html)
    })

    it('preserves allowed attributes', () => {
      const html = '<a href="https://example.com" target="_blank" rel="noopener">link</a>'
      expect(sanitizeProofreadHtml(html)).toBe(html)
    })

    it('removes disallowed tags but keeps content', () => {
      const result = sanitizeProofreadHtml('<p>before<iframe src="evil"></iframe>after</p>')
      expect(result).not.toContain('iframe')
      expect(result).toContain('before')
      expect(result).toContain('after')
    })

    it('handles empty string', () => {
      expect(sanitizeProofreadHtml('')).toBe('')
    })

    it('handles plain text without HTML', () => {
      expect(sanitizeProofreadHtml('plain text 123')).toBe('plain text 123')
    })
  })
})
