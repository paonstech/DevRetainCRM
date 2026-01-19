"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Zap,
  Building2,
  Youtube,
  ShoppingCart,
  Sparkles,
  Home,
  FileText,
  Target,
  Users,
  Crown,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Mock auth state - in real app, this would come from NextAuth session
interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "CREATOR" | "SPONSOR" | "ADMIN"
  organizationName?: string
  plan?: "FREE" | "PRO" | "ENTERPRISE"
}

interface NavbarProps {
  user?: User | null
  notifications?: number
}

// Landing page navigation links
const landingLinks = [
  { href: "/landing#features", label: "Özellikler" },
  { href: "/landing#how-it-works", label: "Nasıl Çalışır" },
  { href: "/pricing", label: "Fiyatlandırma" },
  { href: "/landing#contact", label: "İletişim" },
]

// Dashboard navigation links based on user role
const getDashboardLinks = (role: User["role"]) => {
  const commonLinks = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/marketplace", label: "Pazaryeri", icon: ShoppingCart },
    { href: "/matches", label: "Eşleşmeler", icon: Sparkles },
  ]

  if (role === "CREATOR") {
    return [
      ...commonLinks,
      { href: "/campaigns/new", label: "Kampanyalar", icon: Target },
      { href: "/media-kit", label: "Media Kit", icon: FileText },
      { href: "/reports", label: "Raporlar", icon: FileText },
    ]
  }

  if (role === "SPONSOR") {
    return [
      ...commonLinks,
      { href: "/sponsor", label: "Portföy", icon: Building2 },
      { href: "/sponsor/discover", label: "Keşfet", icon: Users },
    ]
  }

  // Admin
  return [
    ...commonLinks,
    { href: "/admin", label: "Admin Panel", icon: Shield },
  ]
}

export function Navbar({ user, notifications = 0 }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLandingPage = pathname === "/landing" || pathname === "/pricing" || pathname === "/auth/signin"
  const isAuthenticated = !!user

  const dashboardLinks = user ? getDashboardLinks(user.role) : []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href={isAuthenticated ? "/" : "/landing"} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">DevRetain</span>
          {user?.plan === "PRO" && (
            <Badge className="ml-1 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0 text-xs">
              PRO
            </Badge>
          )}
          {user?.plan === "ENTERPRISE" && (
            <Badge className="ml-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Enterprise
            </Badge>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {!isAuthenticated ? (
            // Landing Page Navigation
            landingLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {link.label}
              </Link>
            ))
          ) : (
            // Dashboard Navigation
            dashboardLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || 
                (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            // Landing Page Actions
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                  Ücretsiz Başla
                </Button>
              </Link>
            </>
          ) : (
            // Dashboard Actions
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {notifications > 9 ? "9+" : notifications}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.organizationName || user.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        user.role === "CREATOR" && "border-violet-500/50 text-violet-600",
                        user.role === "SPONSOR" && "border-emerald-500/50 text-emerald-600",
                        user.role === "ADMIN" && "border-amber-500/50 text-amber-600"
                      )}>
                        {user.role === "CREATOR" ? "Yayıncı" : user.role === "SPONSOR" ? "Sponsor" : "Admin"}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Ayarlar
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Abonelik
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-amber-600">
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signout" className="flex items-center gap-2 cursor-pointer text-red-600">
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <nav className="container px-4 py-4 space-y-1">
            {!isAuthenticated ? (
              // Landing Page Mobile Navigation
              <>
                {landingLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                      pathname === link.href
                        ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-violet-600 hover:bg-violet-700">
                      Ücretsiz Başla
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              // Dashboard Mobile Navigation
              <>
                {dashboardLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = pathname === link.href || 
                    (link.href !== "/" && pathname.startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  )
                })}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link
                    href="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Settings className="h-5 w-5" />
                    Ayarlar
                  </Link>
                  <Link
                    href="/auth/signout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-5 w-5" />
                    Çıkış Yap
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
