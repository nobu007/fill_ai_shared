import { describe, it, expect } from 'vitest'
import { sanitizeHtml } from './sanitize'

describe('sanitize', () => {
  describe('sanitizeHtml', () => {
    it('passes through safe HTML unchanged', () => {
      const html = '<p>こんにちは</p>'
      expect(sanitizeHtml(html)).toBe(html)
    })

    it('removes script tags', () => {
      expect(sanitizeHtml('<p>safe</p><script>alert("xss")</script>')).toBe('<p>safe</p>')
    })

    it('removes event handlers', () => {
      const result = sanitizeHtml('<p onclick="alert(1)">click</p>')
      expect(result).not.toContain('onclick')
      expect(result).toContain('click')
    })

    it('removes style attributes', () => {
      const result = sanitizeHtml('<p style="color:red">text</p>')
      expect(result).not.toContain('style=')
    })

    it('preserves allowed tags', () => {
      const html = '<h1>Title</h1><ul><li>item</li></ul><blockquote>quote</blockquote>'
      expect(sanitizeHtml(html)).toBe(html)
    })

    it('preserves allowed attributes', () => {
      const html = '<a href="https://example.com" target="_blank" rel="noopener">link</a>'
      expect(sanitizeHtml(html)).toBe(html)
    })

    it('removes disallowed tags but keeps content', () => {
      const result = sanitizeHtml('<p>before<iframe src="evil"></iframe>after</p>')
      expect(result).not.toContain('iframe')
      expect(result).toContain('before')
      expect(result).toContain('after')
    })

    it('handles empty string', () => {
      expect(sanitizeHtml('')).toBe('')
    })

    it('handles plain text without HTML', () => {
      expect(sanitizeHtml('plain text 123')).toBe('plain text 123')
    })
  })
})
