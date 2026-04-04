import { describe, it, expect, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { NavItemLink } from './nav-item-link'

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}))

vi.mock('./nav-items', () => ({
  navItems: [
    { href: '/dashboard', label: 'ダッシュボード', icon: () => null },
    { href: '/proofread', label: '校正', icon: () => null },
  ],
  isActive: (href: string, pathname: string) => pathname === href,
}))

afterEach(() => cleanup())

describe('NavItemLink', () => {
  const MockIcon = () => <svg data-testid="icon" />

  it('renders label text', () => {
    render(<NavItemLink href="/proofread" label="校正" icon={MockIcon} />)
    expect(screen.getByText('校正')).toBeInTheDocument()
  })

  it('renders as a link with correct href', () => {
    render(<NavItemLink href="/proofread" label="校正" icon={MockIcon} />)
    const link = screen.getByText('校正').closest('a')
    expect(link?.getAttribute('href')).toBe('/proofread')
  })

  it('applies active style when pathname matches', () => {
    const { container } = render(<NavItemLink href="/dashboard" label="ダッシュボード" icon={MockIcon} />)
    const link = container.querySelector('a')
    expect(link?.className).toContain('bg-blue-50')
    expect(link?.className).toContain('text-blue-700')
  })

  it('applies inactive style when pathname does not match', () => {
    const { container } = render(<NavItemLink href="/proofread" label="校正" icon={MockIcon} />)
    const link = container.querySelector('a')
    expect(link?.className).toContain('text-gray-600')
  })

  it('renders icon', () => {
    render(<NavItemLink href="/proofread" label="校正" icon={MockIcon} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<NavItemLink href="/proofread" label="校正" icon={MockIcon} onClick={onClick} />)
    screen.getByText('校正').click()
    expect(onClick).toHaveBeenCalled()
  })
})
