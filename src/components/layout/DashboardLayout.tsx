"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { cn } from "@/lib/utils"

// Mock user - in real app, this would come from NextAuth session
const mockUser = {
  id: "user-1",
  name: "Ahmet Yılmaz",
  email: "ahmet@devretain.com",
  role: "CREATOR" as const,
  organizationName: "DevRetain Media",
  plan: "PRO" as const,
}

// Mock notifications
const mockNotifications = {
  matches: 3,
  messages: 2,
  total: 5,
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "CREATOR" | "SPONSOR" | "ADMIN"
  showSidebar?: boolean
}

export function DashboardLayout({ 
  children, 
  userRole = "CREATOR",
  showSidebar = true 
}: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on a page that shouldn't show sidebar
  const noSidebarPages = ["/landing", "/pricing", "/auth"]
  const shouldShowSidebar = showSidebar && !noSidebarPages.some(page => pathname.startsWith(page))

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Create user object with correct role
  const user = {
    ...mockUser,
    role: userRole,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <Navbar user={user} notifications={mockNotifications.total} />

      <div className="flex">
        {/* Sidebar */}
        {shouldShowSidebar && (
          <Sidebar
            userRole={userRole}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            notifications={mockNotifications}
          />
        )}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300",
            shouldShowSidebar && (sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"),
            !shouldShowSidebar && "ml-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
