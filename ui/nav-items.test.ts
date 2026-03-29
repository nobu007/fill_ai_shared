import { describe, it, expect } from 'vitest'
import { navItems, isActive } from './nav-items'

describe('navItems', () => {
  it('has expected number of items', () => {
    expect(navItems).toHaveLength(6)
  })

  it('has unique hrefs', () => {
    const hrefs = navItems.map(item => item.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('has non-empty labels', () => {
    navItems.forEach(item => {
      expect(item.label.length).toBeGreaterThan(0)
    })
  })

  it('includes dashboard as first item', () => {
    expect(navItems[0].href).toBe('/')
  })

  it('has valid href format', () => {
    navItems.forEach(item => {
      expect(item.href).toMatch(/^\//)
    })
  })
})

describe('isActive', () => {
  it('matches root path exactly', () => {
    expect(isActive('/', '/')).toBe(true)
    expect(isActive('/', '/fill')).toBe(false)
  })

  it('matches sub-paths with startsWith', () => {
    expect(isActive('/fill', '/fill')).toBe(true)
    expect(isActive('/fill', '/fill/something')).toBe(true)
    expect(isActive('/fill', '/')).toBe(false)
  })
})
