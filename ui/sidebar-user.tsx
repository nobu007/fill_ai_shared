'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Menu, X, Globe } from 'lucide-react'
import { createClient } from '../auth/client'
import { getNavItems, isActive } from './nav-items'
import { APP_ICON, APP_NAME } from '@/shared/config'
import { LOCALE_LABELS, type Locale } from '../../lib/i18n'

export function SidebarUser() {
  const [displayName, setDisplayName] = useState('読み込み中...')
  const [membership, setMembership] = useState('free')
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    const supabase = createClient()

    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setDisplayName(user.email?.split('@')[0] || 'ユーザー')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setDisplayName(profile.display_name || user.email?.split('@')[0] || 'ユーザー')
        setMembership(profile.membership || 'free')
        setCredits(profile.credits || 0)
      }
    }

    loadUser()
  }, [])

  return (
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            membership === 'pro' ? 'bg-blue-100 text-blue-700' :
            membership === 'beta' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {membership === 'pro' ? 'PRO' : membership === 'beta' ? 'BETA' : 'FREE'}
          </span>
          <span className="text-xs text-gray-400">{credits} 枚</span>
        </div>
      </div>
      <form action="/auth/signout" method="post">
        <button type="submit" className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <LogOut size={16} />
        </button>
      </form>
    </div>
  )
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 lg:hidden"
      aria-label="メニュー"
    >
      <Menu size={20} className="text-gray-700" />
    </button>
  )
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const locale = pathname.startsWith('/en') ? 'en' : 'ja'
  const navItems = getNavItems(locale)

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onClose} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-200 transform transition-transform lg:hidden flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900"><span className="text-blue-500">{APP_ICON}</span> {APP_NAME}</span>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive(href, pathname)
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <SidebarUser />
        </div>
      </div>
    </>
  )
}

/**
 * Language switcher component — renders a dropdown or button to toggle locale.
 * Works in both / (ja) and /en/* routes.
 */
export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname()

  const switchLocale: Locale = currentLocale === 'ja' ? 'en' : 'ja'

  // Build the new path: for /en/ routes, swap /en prefix; for / routes, prepend /en
  let newPath: string
  if (currentLocale === 'ja') {
    // /foo → /en/foo
    newPath = `/en${pathname === '/' ? '' : pathname}`
  } else {
    // /en/foo → /foo (strip /en prefix)
    newPath = pathname.replace(/^\/en/, '') || '/'
  }

  const label = LOCALE_LABELS[switchLocale]

  return (
    <Link
      href={newPath}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
      title={label}
    >
      <Globe size={16} />
      <span>{label}</span>
    </Link>
  )
}
