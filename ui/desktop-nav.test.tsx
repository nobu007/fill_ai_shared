import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { DesktopNav } from './desktop-nav'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="dashboard-icon" />,
  FileText: () => <div data-testid="filetext-icon" />,
  FileUp: () => <div data-testid="fileup-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Users: () => <div data-testid="users-icon" />,
  History: () => <div data-testid="history-icon" />,
  MessageSquare: () => <div data-testid="messagesquare-icon" />,
  CreditCard: () => <div data-testid="creditcard-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
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
      expect(screen.getByText('フォーム入力')).toBeInTheDocument()
      expect(screen.getByText('履歴')).toBeInTheDocument()
      expect(screen.getByText('クレジット')).toBeInTheDocument()
      expect(screen.getByText('設定')).toBeInTheDocument()
    })

    it('renders icons for each navigation item', () => {
      render(<DesktopNav />)

      expect(screen.getByTestId('dashboard-icon')).toBeInTheDocument()
      expect(screen.getByTestId('fileup-icon')).toBeInTheDocument()
      expect(screen.getByTestId('history-icon')).toBeInTheDocument()
      expect(screen.getByTestId('creditcard-icon')).toBeInTheDocument()
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

      const fillLink = container.querySelector('a[href="/fill"]')
      expect(fillLink).toHaveClass('text-gray-600', 'hover:bg-gray-100', 'hover:text-gray-900')
      expect(fillLink).not.toHaveClass('bg-blue-50', 'text-blue-700')
    })
  })

  describe('Navigation Links', () => {
    it('has correct href attributes for all navigation items', () => {
      const { container } = render(<DesktopNav />)

      expect(container.querySelector('a[href="/"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/fill"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/history"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/credits"]')).toBeInTheDocument()
      expect(container.querySelector('a[href="/settings"]')).toBeInTheDocument()
    })
  })
})
