import {
  LayoutDashboard, Settings, History, FileUp, CreditCard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/fill', label: 'フォーム入力', icon: FileUp },
  { href: '/history', label: '履歴', icon: History },
  { href: '/credits', label: 'クレジット', icon: CreditCard },
  { href: '/settings', label: '設定', icon: Settings },
]

export function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}
