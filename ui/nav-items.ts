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
import { type Locale } from '../../lib/i18n'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS_CONFIG: Array<{
  href: string
  labelJa: string
  labelEn: string
  icon: LucideIcon
}> = [
  { href: '/', labelJa: 'ダッシュボード', labelEn: 'Dashboard', icon: LayoutDashboard },
  { href: '/proofread', labelJa: '校正する', labelEn: 'Proofread', icon: Zap },
  { href: '/fill', labelJa: 'PDF入力', labelEn: 'PDF Fill', icon: Zap },
  { href: '/sites', labelJa: 'サイト管理', labelEn: 'Sites', icon: Globe },
  { href: '/history', labelJa: '履歴', labelEn: 'History', icon: History },
  { href: '/usage', labelJa: '用量監視', labelEn: 'Usage', icon: BarChart3 },
  { href: '/credits', labelJa: 'クレジット', labelEn: 'Credits', icon: CreditCard },
  { href: '/subscription', labelJa: 'サブスクリプション', labelEn: 'Subscription', icon: CreditCard },
  { href: '/settings', labelJa: '設定', labelEn: 'Settings', icon: Settings },
]

export function getNavItems(locale: Locale): NavItem[] {
  const isEn = locale === 'en'
  return NAV_ITEMS_CONFIG.map((item) => ({
    href: item.href,
    label: isEn ? item.labelEn : item.labelJa,
    icon: item.icon,
  }))
}

/**
 * Legacy export — always returns Japanese nav items for backward compat.
 * Dashboard components that use the shared layout get Japanese labels.
 * English dashboard (src/app/[locale]/(dashboard)/) uses getNavItems('en').
 */
export const navItems: NavItem[] = NAV_ITEMS_CONFIG.map((item) => ({
  href: item.href,
  label: item.labelJa,
  icon: item.icon,
}))

export function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}
