import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import DashboardLayout from './layout'

// Mock child components
vi.mock('./desktop-nav', () => ({
  DesktopNav: () => <div data-testid="desktop-nav">Desktop Navigation</div>,
}))

vi.mock('./sidebar-user', () => ({
  SidebarUser: () => <div data-testid="sidebar-user">Sidebar User</div>,
}))

vi.mock('./sidebar-wrapper', () => ({
  SidebarWrapper: () => <div data-testid="sidebar-wrapper">Mobile Sidebar</div>,
}))

// Mock shared config
vi.mock('../config', () => ({
  APP_NAME: 'Fill AI',
  APP_DESCRIPTION: 'PDFフォーム自動入力サービス',
  APP_ICON: '📄',
}))

describe('DashboardLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Layout Structure', () => {
    it('renders main container with flex layout', () => {
      const { container } = render(<DashboardLayout>Test Content</DashboardLayout>)

      const mainContainer = container.firstChild as HTMLElement
      expect(mainContainer).toHaveClass('flex', 'h-screen', 'bg-white')
    })

    it('renders desktop sidebar', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument()
    })

    it('renders mobile sidebar wrapper', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('sidebar-wrapper')).toBeInTheDocument()
    })

    it('renders main content area', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('renders sidebar user section', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('sidebar-user')).toBeInTheDocument()
    })
  })

  describe('Desktop Sidebar', () => {
    it('renders app name with icon', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByText('Fill AI')).toBeInTheDocument()
      expect(screen.getByText('📄')).toBeInTheDocument()
    })

    it('renders app description', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByText('PDFフォーム自動入力サービス')).toBeInTheDocument()
    })

    it('desktop sidebar has correct width and styling', () => {
      const { container } = render(<DashboardLayout>Test Content</DashboardLayout>)

      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('w-60', 'bg-gray-50', 'border-r', 'border-gray-200')
      expect(aside).toHaveClass('hidden', 'lg:flex')
    })
  })

  describe('Main Content Area', () => {
    it('renders children content', () => {
      render(
        <DashboardLayout>
          <div>Child Component 1</div>
          <div>Child Component 2</div>
        </DashboardLayout>
      )

      expect(screen.getByText('Child Component 1')).toBeInTheDocument()
      expect(screen.getByText('Child Component 2')).toBeInTheDocument()
    })

    it('main content has overflow auto', () => {
      const { container } = render(<DashboardLayout>Test Content</DashboardLayout>)

      const main = container.querySelector('main')
      expect(main).toHaveClass('flex-1', 'overflow-auto')
    })

    it('renders mobile spacer', () => {
      const { container } = render(<DashboardLayout>Test Content</DashboardLayout>)

      const main = container.querySelector('main')
      const spacer = main?.querySelector('div')
      expect(spacer).toHaveClass('lg:hidden', 'h-14')
    })
  })

  describe('Responsive Design', () => {
    it('desktop sidebar is hidden on mobile', () => {
      const { container } = render(<DashboardLayout>Test Content</DashboardLayout>)

      const aside = container.querySelector('aside')
      expect(aside).toHaveClass('hidden', 'lg:flex')
    })

    it('mobile spacer is hidden on desktop', () => {
      const { container } = render(<DashboardLayout>Test Content</DashboardLayout>)

      const main = container.querySelector('main')
      const spacer = main?.querySelector('div')
      expect(spacer).toHaveClass('lg:hidden')
    })
  })

  describe('Component Integration', () => {
    it('integrates DesktopNav component', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument()
    })

    it('integrates SidebarUser component', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('sidebar-user')).toBeInTheDocument()
    })

    it('integrates SidebarWrapper component for mobile', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('sidebar-wrapper')).toBeInTheDocument()
    })
  })

  describe('Layout Zones', () => {
    it('desktop sidebar has header zone with app info', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      const aside = screen.getByRole('complementary') || screen.getByTestId('desktop-nav').closest('aside')
      const header = aside?.querySelector('.border-b')

      expect(header).toBeInTheDocument()
      expect(screen.getByText('Fill AI')).toBeInTheDocument()
      expect(screen.getByText('📄')).toBeInTheDocument()
      expect(screen.getByText('PDFフォーム自動入力サービス')).toBeInTheDocument()
    })

    it('desktop sidebar has navigation zone', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument()
    })

    it('desktop sidebar has footer zone with user info', () => {
      render(<DashboardLayout>Test Content</DashboardLayout>)

      expect(screen.getByTestId('sidebar-user')).toBeInTheDocument()
    })
  })
})
