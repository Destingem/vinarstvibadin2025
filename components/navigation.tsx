"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "O nás", href: "/#o-nas" },
  { name: "Vína", href: "/#vina" },
  { name: "Kde nás najdete", href: "/#kontakt" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : ""
      }`}
    >
      <nav className={`container flex h-16 items-center ${!isScrolled ? "text-white" : ""}`}>
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">Vinařství Badin</span>
          </Link>
          <div className="flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-primary" : isScrolled ? "text-muted-foreground" : "text-white/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className={`mr-2 ${!isScrolled ? "text-white hover:text-white" : ""}`} size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold">Vinařství Badin</span>
            </Link>
            <div className="mt-6 flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/#kontakt" className="hidden md:inline-block">
              <Button
                variant={isScrolled ? "default" : "outline"}
                className={!isScrolled ? "text-white border-white hover:text-white" : ""}
              >
                Navštivte nás
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

