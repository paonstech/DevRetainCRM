"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Heart,
  LayoutDashboard,
  Palette,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Target,
  Zap,
  Youtube,
  Crown,
  Bell,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Try to import subscription context (optional)
let useSubscription: any = null
try {
  const subscriptionModule = require("@/contexts/subscription-context")
  useSubscription = subscriptionModule.useSubscription
} catch {
  // Context not available
}

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
  user?: {
    name: string
    email: string
    plan?: string
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
  notifications = {},
  user = { name: "Ahmet Yılmaz", email: "ahmet@devretain.com", plan: "PRO" }
}: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  
  // Get subscription context if available
  const subscription = useSubscription ? useSubscription() : null
  const currentPlan = subscription?.plan || user.plan
  const setPlan = subscription?.setPlan

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
        href={item.href as any}
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
          "fixed left-0 top-0 h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-40",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo & Brand */}
        <div className={cn(
          "h-16 flex items-center border-b border-slate-200 dark:border-slate-800",
          isCollapsed ? "justify-center px-2" : "px-4"
        )}>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 dark:text-white leading-tight">DevRetain</span>
                {currentPlan && (
                  <Badge className={cn(
                    "w-fit mt-0.5 border-0 text-[10px] px-1.5 py-0",
                    currentPlan === "FREE" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
                    currentPlan === "PRO" && "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                    currentPlan === "ENTERPRISE" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  )}>
                    {currentPlan === "ENTERPRISE" && <Crown className="h-2.5 w-2.5 mr-0.5" />}
                    {currentPlan}
                  </Badge>
                )}
              </div>
            )}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={handleCollapse}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors z-50"
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
          {/* Notifications */}
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="w-full flex items-center justify-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  {notifications.total && notifications.total > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {notifications.total > 9 ? "9+" : notifications.total}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Bildirimler {notifications.total ? `(${notifications.total})` : ""}
              </TooltipContent>
            </Tooltip>
          ) : (
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="flex-1 text-left">Bildirimler</span>
              {notifications.total && notifications.total > 0 && (
                <Badge className="h-5 min-w-5 px-1.5 flex items-center justify-center bg-red-500 text-white text-xs">
                  {notifications.total > 9 ? "9+" : notifications.total}
                </Badge>
              )}
            </button>
          )}

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

        {/* Plan Switcher (Demo) */}
        {!isCollapsed && setPlan && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 px-1">Demo: Plan Değiştir</p>
            <Select value={currentPlan} onValueChange={(value) => setPlan(value as any)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    FREE
                  </span>
                </SelectItem>
                <SelectItem value="PRO">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />
                    PRO
                  </span>
                </SelectItem>
                <SelectItem value="ENTERPRISE">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    ENTERPRISE
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* User Profile */}
        <div className={cn(
          "p-3 border-t border-slate-200 dark:border-slate-800",
          isCollapsed ? "flex justify-center" : ""
        )}>
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link href="/settings" className="block">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link href="/settings" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shrink-0">
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}

export default Sidebar
