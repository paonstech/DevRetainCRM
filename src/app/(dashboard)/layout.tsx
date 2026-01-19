"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { cn } from "@/lib/utils"

// Mock user - in real app, this would come from NextAuth session
const mockUser = {
  name: "Ahmet Yılmaz",
  email: "ahmet@devretain.com",
  plan: "PRO",
}

// Mock notifications
const mockNotifications = {
  matches: 3,
  messages: 2,
  total: 5,
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Determine user role based on pathname (in real app, this comes from session)
  const getUserRole = (): "CREATOR" | "SPONSOR" | "ADMIN" => {
    if (pathname.startsWith("/admin")) return "ADMIN"
    if (pathname.startsWith("/sponsor")) return "SPONSOR"
    return "CREATOR"
  }

  const userRole = getUserRole()

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        userRole={userRole}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        notifications={mockNotifications}
        user={mockUser}
      />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {children}
      </main>
    </div>
  )
}
