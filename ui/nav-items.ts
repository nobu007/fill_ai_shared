import {
  BarChart3,
  CreditCard,
  Globe,
  History,
  LayoutDashboard,
  Settings,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/proofread', label: '校正する', icon: Zap },
  { href: '/sites', label: 'サイト管理', icon: Globe },
  { href: '/history', label: '履歴', icon: History },
  { href: '/usage', label: '用量監視', icon: BarChart3 },
  { href: '/credits', label: 'クレジット', icon: CreditCard },
  { href: '/subscription', label: 'サブスクリプション', icon: CreditCard },
  { href: '/settings', label: '設定', icon: Settings },
]

export function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}
