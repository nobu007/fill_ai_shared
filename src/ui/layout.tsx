import { APP_NAME, APP_DESCRIPTION, APP_ICON } from '../config'
import { SidebarUser } from './sidebar-user'
import { DesktopNav } from './desktop-nav'
import { SidebarWrapper } from './sidebar-wrapper'

export const dynamic = 'force-dynamic'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-white">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-gray-50 border-r border-gray-200 flex-col shrink-0">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-blue-500">{APP_ICON}</span> {APP_NAME}
          </h1>
          <p className="text-xs text-gray-400 mt-1">{APP_DESCRIPTION}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <DesktopNav />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <SidebarUser />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <SidebarWrapper />

      <main className="flex-1 overflow-auto">
        <div className="lg:hidden h-14" /> {/* spacer for mobile menu button */}
        {children}
      </main>
    </div>
  )
}
