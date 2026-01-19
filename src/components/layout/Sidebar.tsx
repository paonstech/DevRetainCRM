"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Heart,
  Home,
  LayoutDashboard,
  MessageSquare,
  Palette,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  Youtube,
  Crown,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// User role type
type UserRole = "CREATOR" | "SPONSOR" | "ADMIN"

interface SidebarProps {
  userRole: UserRole
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  notifications?: {
    matches?: number
    messages?: number
    total?: number
  }
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number | string
  roles: UserRole[]
  children?: NavItem[]
}

// Navigation items configuration
const navItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["CREATOR", "SPONSOR", "ADMIN"],
  },
  // Creator specific items
  {
    href: "/campaigns/new",
    label: "Kampanyalar",
    icon: Target,
    roles: ["CREATOR"],
  },
  {
    href: "/media-kit",
    label: "Media Kit",
    icon: Palette,
    roles: ["CREATOR"],
  },
  {
    href: "/reports",
    label: "Raporlar",
    icon: FileText,
    roles: ["CREATOR"],
  },
  // Sponsor specific items
  {
    href: "/sponsor",
    label: "Portföyüm",
    icon: Heart,
    roles: ["SPONSOR"],
  },
  {
    href: "/sponsor/discover",
    label: "Keşfet",
    icon: Search,
    roles: ["SPONSOR"],
  },
  // Common items
  {
    href: "/matches",
    label: "Eşleşmeler",
    icon: Sparkles,
    roles: ["CREATOR", "SPONSOR"],
  },
  {
    href: "/marketplace",
    label: "Pazaryeri",
    icon: ShoppingCart,
    roles: ["CREATOR", "SPONSOR"],
  },
  // Admin items
  {
    href: "/admin",
    label: "Admin Panel",
    icon: Shield,
    roles: ["ADMIN"],
  },
]

// Bottom navigation items
const bottomNavItems: NavItem[] = [
  {
    href: "/settings",
    label: "Ayarlar",
    icon: Settings,
    roles: ["CREATOR", "SPONSOR", "ADMIN"],
  },
  {
    href: "/help",
    label: "Yardım",
    icon: HelpCircle,
    roles: ["CREATOR", "SPONSOR", "ADMIN"],
  },
]

export function Sidebar({ 
  userRole, 
  collapsed = false, 
  onCollapsedChange,
  notifications = {}
}: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(collapsed)

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))
  const filteredBottomItems = bottomNavItems.filter(item => item.roles.includes(userRole))

  // Add notification badges
  const getItemBadge = (href: string): number | undefined => {
    if (href === "/matches" && notifications.matches) return notifications.matches
    if (href === "/messages" && notifications.messages) return notifications.messages
    return undefined
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon
    const isActive = pathname === item.href || 
      (item.href !== "/" && pathname.startsWith(item.href))
    const badge = getItemBadge(item.href)

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
          isActive
            ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-violet-600 dark:text-violet-400")} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {badge && (
              <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs">
                {badge > 9 ? "9+" : badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    )

    if (isCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2">
            {item.label}
            {badge && (
              <Badge className="h-5 min-w-5 px-1.5 bg-red-500 text-white text-xs">
                {badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      )
    }

    return linkContent
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-40",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse Toggle */}
        <button
          onClick={handleCollapse}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          )}
        </button>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Role Badge */}
          {!isCollapsed && (
            <div className="px-3 py-2 mb-4">
              <Badge 
                variant="outline" 
                className={cn(
                  "w-full justify-center py-1.5",
                  userRole === "CREATOR" && "border-violet-500/50 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400",
                  userRole === "SPONSOR" && "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                  userRole === "ADMIN" && "border-amber-500/50 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                )}
              >
                {userRole === "CREATOR" && <Youtube className="h-3 w-3 mr-1" />}
                {userRole === "SPONSOR" && <Building2 className="h-3 w-3 mr-1" />}
                {userRole === "ADMIN" && <Crown className="h-3 w-3 mr-1" />}
                {userRole === "CREATOR" ? "Yayıncı Modu" : userRole === "SPONSOR" ? "Sponsor Modu" : "Admin Modu"}
              </Badge>
            </div>
          )}

          {/* Navigation Links */}
          {filteredNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          {filteredBottomItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}

          {/* Logout */}
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="/auth/signout"
                  className="flex items-center justify-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Çıkış Yap
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/auth/signout"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Çıkış Yap</span>
            </Link>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default Sidebar
