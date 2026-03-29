import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarUser, MobileMenuButton, MobileSidebar } from './sidebar-user'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  LogOut: () => <div data-testid="logout-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
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
  usePathname: () => '/fill',
}))

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, className }: { children: React.ReactNode; href: string; onClick?: () => void; className: string }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}))

// Mock Supabase client
const mockGetUser = vi.fn().mockResolvedValue({
  data: { user: { id: 'test-user-id', email: 'test@example.com' } },
})

const mockSingle = vi.fn().mockResolvedValue({
  data: { display_name: 'Test User', membership: 'pro', credits: 100 },
})

const mockEq = vi.fn(() => ({ single: mockSingle }))
const mockSelect = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ select: mockSelect }))

vi.mock('../auth/client', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}))

describe('SidebarUser Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Initial Render', () => {
    it('renders loading state initially', () => {
      render(<SidebarUser />)

      expect(screen.getByText('読み込み中...')).toBeInTheDocument()
    })

    it('displays user display name after loading', async () => {
      render(<SidebarUser />)

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument()
      })
    })

    it('displays membership badge', async () => {
      render(<SidebarUser />)

      await waitFor(() => {
        expect(screen.getByText('PRO')).toBeInTheDocument()
      })
    })

    it('displays credits count', async () => {
      render(<SidebarUser />)

      await waitFor(() => {
        expect(screen.getByText('100 枚')).toBeInTheDocument()
      })
    })

    it('renders logout button', () => {
      render(<SidebarUser />)

      expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    })
  })

  describe('Membership Badges', () => {
    it('displays PRO badge for pro membership', async () => {
      mockSingle.mockResolvedValueOnce({
        data: { display_name: 'Test User', membership: 'pro', credits: 100 },
      })

      render(<SidebarUser />)

      await waitFor(() => {
        const badge = screen.getByText('PRO')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('bg-blue-100', 'text-blue-700')
      })
    })

    it('displays BETA badge for beta membership', async () => {
      mockSingle.mockResolvedValueOnce({
        data: { display_name: 'Test User', membership: 'beta', credits: 50 },
      })

      render(<SidebarUser />)

      await waitFor(() => {
        const badge = screen.getByText('BETA')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('bg-purple-100', 'text-purple-700')
      })
    })

    it('displays FREE badge for free membership', async () => {
      mockSingle.mockResolvedValueOnce({
        data: { display_name: 'Test User', membership: 'free', credits: 10 },
      })

      render(<SidebarUser />)

      await waitFor(() => {
        const badge = screen.getByText('FREE')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('bg-gray-100', 'text-gray-600')
      })
    })
  })

  describe('Logout Form', () => {
    it('renders logout form with correct action', async () => {
      const { container } = render(<SidebarUser />)

      await waitFor(() => {
        const form = container.querySelector('form[action="/auth/signout"]')
        expect(form).toBeInTheDocument()
        expect(form).toHaveAttribute('method', 'post')
      })
    })

    it('renders logout button with icon', async () => {
      render(<SidebarUser />)

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        const logoutButton = buttons.find(b => b.querySelector('[data-testid="logout-icon"]'))
        expect(logoutButton).toBeInTheDocument()
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
      })
    })
  })

  describe('Email Fallback', () => {
    it('uses email username when display_name is not available', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'test-user-id', email: 'user@example.com' } },
      })
      mockSingle.mockResolvedValueOnce({
        data: { display_name: null, membership: 'free', credits: 0 },
      })

      render(<SidebarUser />)

      await waitFor(() => {
        expect(screen.getByText('user')).toBeInTheDocument()
      })
    })

    it('uses "ユーザー" fallback when both display_name and email are unavailable', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: { id: 'test-user-id', email: null } },
      })
      mockSingle.mockResolvedValueOnce({
        data: { display_name: null, membership: 'free', credits: 0 },
      })

      render(<SidebarUser />)

      await waitFor(() => {
        expect(screen.getByText('ユーザー')).toBeInTheDocument()
      })
    })
  })
})

describe('MobileMenuButton Component', () => {
  it('renders menu button', () => {
    const handleClick = vi.fn()
    render(<MobileMenuButton onClick={handleClick} />)

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument()
  })

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<MobileMenuButton onClick={handleClick} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has correct aria-label', () => {
    render(<MobileMenuButton onClick={() => {}} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'メニュー')
  })
})

describe('MobileSidebar Component', () => {
  it('does not render sidebar when isOpen is false', () => {
    const { container } = render(<MobileSidebar isOpen={false} onClose={() => {}} />)

    expect(container.querySelector('.translate-x-0')).not.toBeInTheDocument()
    expect(container.querySelector('.-translate-x-full')).toBeInTheDocument()
  })

  it('renders sidebar when isOpen is true', () => {
    const { container } = render(<MobileSidebar isOpen={true} onClose={() => {}} />)

    expect(container.querySelector('.translate-x-0')).toBeInTheDocument()
    expect(container.querySelector('.-translate-x-full')).not.toBeInTheDocument()
  })

  it('renders overlay when isOpen is true', () => {
    const { container } = render(<MobileSidebar isOpen={true} onClose={() => {}} />)

    const overlay = container.querySelector('.bg-black\\/30')
    expect(overlay).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    render(<MobileSidebar isOpen={true} onClose={() => {}} />)

    expect(screen.getByText('ダッシュボード')).toBeInTheDocument()
    expect(screen.getByText('フォーム入力')).toBeInTheDocument()
    expect(screen.getByText('履歴')).toBeInTheDocument()
    expect(screen.getByText('クレジット')).toBeInTheDocument()
    expect(screen.getByText('設定')).toBeInTheDocument()
  })

  it('renders close button', () => {
    render(<MobileSidebar isOpen={true} onClose={() => {}} />)

    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
  })

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    const { container } = render(<MobileSidebar isOpen={true} onClose={handleClose} />)

    const overlay = container.querySelector('.bg-black\\/30')
    if (overlay) {
      await user.click(overlay)
      expect(handleClose).toHaveBeenCalledTimes(1)
    }
  })
})
