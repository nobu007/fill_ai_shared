import {
  CreditCard,
  FileText,
  FileUp,
  Globe,
  History,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { APP_VARIANT } from '../config'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const proofNavItems: NavItem[] = [
  { href: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/proofread', label: '校正', icon: FileText },
  { href: '/sites', label: 'サイト管理', icon: Globe },
  { href: '/history', label: '履歴', icon: History },
  { href: '/prompts', label: 'プロンプト', icon: MessageSquare },
  { href: '/credits', label: 'クレジット', icon: CreditCard },
  { href: '/settings', label: '設定', icon: Settings },
]

export const fillNavItems: NavItem[] = [
  { href: '/', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/fill', label: 'フォーム入力', icon: FileUp },
  { href: '/history', label: '履歴', icon: History },
  { href: '/credits', label: 'クレジット', icon: CreditCard },
  { href: '/settings', label: '設定', icon: Settings },
]

export const navItems = APP_VARIANT === 'proof' ? proofNavItems : fillNavItems

export function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}
