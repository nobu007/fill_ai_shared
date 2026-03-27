'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navItems, isActive } from './nav-items'

export function NavItemLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  onClick?: () => void
}) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive(href, pathname)
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  )
}

export { navItems }
