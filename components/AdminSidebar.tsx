'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

interface NavGroup {
  label: string
  icon: ReactNode
  items: NavItem[]
  isOpen?: boolean
}

const defaultNavGroups: NavGroup[] = [
  {
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
      </svg>
    ),
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        icon: <span className="w-2 h-2 bg-blue-400 rounded-full"></span>,
      },
    ],
  },
  {
    label: 'Manage',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      </svg>
    ),
    items: [
      {
        label: 'All Sections',
        href: '/admin/sections',
        icon: <span className="w-2 h-2 bg-blue-400 rounded-full"></span>,
      },
    ],
  },
  {
    label: 'Create Section',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    items: [
      {
        label: 'Hero',
        href: '/admin/hero',
        icon: <span className="w-2 h-2 bg-purple-400 rounded-full"></span>,
      },
      {
        label: 'Features',
        href: '/admin/features',
        icon: <span className="w-2 h-2 bg-purple-400 rounded-full"></span>,
      },
      {
        label: 'Services',
        href: '/admin/services',
        icon: <span className="w-2 h-2 bg-purple-400 rounded-full"></span>,
      },
      {
        label: 'Process',
        href: '/admin/process',
        icon: <span className="w-2 h-2 bg-purple-400 rounded-full"></span>,
      },
      {
        label: 'Products',
        href: '/admin/products',
        icon: <span className="w-2 h-2 bg-purple-400 rounded-full"></span>,
      },
      {
        label: 'CTA',
        href: '/admin/cta',
        icon: <span className="w-2 h-2 bg-purple-400 rounded-full"></span>,
      },
      {
        label: 'Footer',
        href: '/admin/footer',
        icon: <span className="w-2 h-2 bg-purple-400 rounded-full"></span>,
      },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  // Initialize open groups with Create Section open by default
  useEffect(() => {
    setOpenGroups({
      'Create Section': true,
    })
  }, [])

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    window.location.href = '/'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto fixed h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <div>
            <p className="font-bold text-gray-900">CMS Admin</p>
            <p className="text-xs text-gray-600">v1.0</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {defaultNavGroups.map((group) => {
          const isGroupOpen = openGroups[group.label]
          const hasMultipleItems = group.items.length > 1
          const firstItemActive = group.items.length > 0 && isItemActive(group.items[0].href)
          const anyItemActive = group.items.some((item) => isItemActive(item.href))

          return (
            <div key={group.label} className="mb-1">
              {hasMultipleItems ? (
                // Collapsible Group
                <>
                  <button
                    onClick={() => toggleGroup(group.label)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${
                      anyItemActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`${anyItemActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`}>
                      {group.icon}
                    </span>
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isGroupOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isGroupOpen && (
                    <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                      {group.items.map((item) => {
                        const isActive = isItemActive(item.href)
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'text-blue-700 bg-blue-50 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                // Single Item (no dropdown)
                <Link
                  href={group.items[0].href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium group ${
                    firstItemActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`${firstItemActive ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'}`}>
                    {group.icon}
                  </span>
                  {group.label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom Links */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Public Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  )
}