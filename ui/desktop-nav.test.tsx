import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { DesktopNav } from './desktop-nav'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="dashboard-icon" />,
  FileText: () => <div data-testid="filetext-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  History: () => <div data-testid="history-icon" />,
  CreditCard: () => <div data-testid="creditcard-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  BarChart3: () => <div data-testid="barchart3-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('DesktopNav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Initial Render', () => {
    it('renders all navigation items', () => {
      render(<DesktopNav />)

      expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
      expect(screen.getByText('校正する')).toBeInTheDocument()
      expect(screen.getByText('サイト管理')).toBeInTheDocument()
      expect(screen.getByText('履歴')).toBeInTheDocument()
      expect(screen.getByText('用量監視')).toBeInTheDocument()
      expect(screen.getByText('クレジット')).toBeInTheDocument()
      expect(screen.getByText('サブスクリプション')).toBeInTheDocument()
      expect(screen.getByText('設定')).toBeInTheDocument()
    })

    it('renders icons for each navigation item', () => {
      render(<DesktopNav />)

      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument()
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument()
      expect(screen.getByTestId('globe-icon')).toBeInTheDocument()
      expect(screen.getByTestId('history-icon')).toBeInTheDocument()
      // CreditCard icon is used by both /credits and /subscription
      expect(screen.getAllByTestId('creditcard-icon')).toHaveLength(2)
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
    })
  })

  describe('Active State', () => {
    it('applies active styles to dashboard when on root path', () => {
      // Default mock already returns '/'
      const { container } = render(<DesktopNav />)

      const dashboardLink = container.querySelector('a[href="/"]')
      expect(dashboardLink).toHaveClass('bg-blue-50', 'text-blue-700', 'font-medium')
    })

    it('applies inactive styles to non-active items', () => {
      // Default mock already returns '/'
      const { container } = render(<DesktopNav />)

      const proofreadLink = container.querySelector('a[href="/proofread"]')
      expect(proofreadLink).toHaveClass('text-gray-600', 'hover:bg-gray-100', 'hover:text-gray-900')
      expect(proofreadLink).not.toHaveClass('bg-blue-50', 'text-blue-700')
    })
  })

  describe('Navigation Links', () => {
    it('has correct href attributes for all navigation items', () => {
      const { container } = render(<DesktopNav />)

      expect(container.querySelector('a[href="/"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/proofread"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/sites"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/history"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/usage"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/credits"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/subscription"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/settings"]')).toBeInTheDocument()
    })
  })
})
