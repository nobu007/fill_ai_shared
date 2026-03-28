'use client'

import { useState } from 'react'
import { MobileMenuButton, MobileSidebar } from './sidebar-user'

export function SidebarWrapper() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <MobileMenuButton onClick={() => setIsOpen(true)} />
      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
