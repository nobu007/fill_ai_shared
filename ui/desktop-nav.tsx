'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { navItems, isActive } from './nav-items'

export function DesktopNav() {
  const pathname = usePathname()

  return (
    <>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
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
    </>
  )
}
