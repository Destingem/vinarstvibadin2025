"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { MenuIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SiteHeaderProps {
  className?: string
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/80"
          : "bg-transparent",
        className
      )}
    >
      {/* ...rest of the existing component code... */}
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className={cn(
            "text-xl font-bold tracking-tight transition-colors",
            isScrolled ? "text-zinc-900" : "text-white"
          )}>
            Vinařství Badin
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex">
          {[
            ["O nás", "#o-nas"],
            ["Aktuality", "#aktuality"],
            ["Naše vína", "#vina"],
            ["Kontakt", "#kontakt"],
          ].map(([text, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled 
                  ? "text-zinc-900 hover:text-primary" 
                  : "text-white hover:text-white/80"
              )}
            >
              {text}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Toggle */}
        <Button
          variant="ghost"
          className={cn(
            "w-10 p-0 md:hidden",
            isScrolled ? "text-zinc-900" : "text-white"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="container py-4 md:hidden">
          <nav className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-lg">
            {[
              ["O nás", "#o-nas"],
              ["Aktuality", "#aktuality"],
              ["Naše vína", "#vina"],
              ["Kontakt", "#kontakt"],
            ].map(([text, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-zinc-900 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {text}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
