"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Wine, FileText, LayoutDashboard, User, LogOut, Settings, Layout } from "lucide-react"
import { signOut } from "next-auth/react"

export function AdminNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      active: pathname === "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      href: "/admin/wines",
      label: "Vína",
      active: pathname.includes("/admin/wines"),
      icon: <Wine className="h-5 w-5" />
    },
    {
      href: "/admin/news",
      label: "Aktuality",
      active: pathname.includes("/admin/news"),
      icon: <FileText className="h-5 w-5" />
    },
    {
      href: "/admin/content",
      label: "Obsah",
      active: pathname.includes("/admin/content"),
      icon: <Layout className="h-5 w-5" />
    },
    {
      href: "/admin/settings",
      label: "Nastavení",
      active: pathname === "/admin/settings",
      icon: <Settings className="h-5 w-5" />
    },
  ]

  return (
    <nav className="grid gap-1">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "secondary" : "ghost"}
          size="sm"
          className="justify-start"
          asChild
        >
          <Link href={route.href} passHref>
            <div className="flex items-center">
              <div className="mr-3">{route.icon}</div>
              {route.label}
            </div>
          </Link>
        </Button>
      ))}

      <Button 
        variant="ghost" 
        size="sm" 
        className="justify-start mt-4 text-muted-foreground hover:text-destructive"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
      >
        <LogOut className="mr-3 h-5 w-5" />
        Odhlásit se
      </Button>
    </nav>
  )
}
