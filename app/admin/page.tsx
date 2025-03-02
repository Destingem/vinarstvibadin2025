"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wine, FileText, Grape, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Stats {
  wines: number
  news: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ wines: 0, news: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Načtení statistik vín
        const winesResponse = await fetch("/api/wines")
        const wines = await winesResponse.json()
        
        // Načtení statistik aktualit
        const newsResponse = await fetch("/api/news")
        const news = await newsResponse.json()
        
        setStats({
          wines: Array.isArray(wines) ? wines.length : 0,
          news: Array.isArray(news) ? news.length : 0
        })
      } catch (error) {
        console.error("Chyba při načítání statistik:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vína v nabídce</CardTitle>
            <Wine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Načítání..." : stats.wines}
            </div>
            <p className="text-xs text-muted-foreground">
              Celkový počet vín v katalogu
            </p>
            <Button asChild className="mt-4 w-full" size="sm">
              <Link href="/admin/wines">Spravovat vína</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktuality</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Načítání..." : stats.news}
            </div>
            <p className="text-xs text-muted-foreground">
              Celkový počet aktualit
            </p>
            <Button asChild className="mt-4 w-full" size="sm">
              <Link href="/admin/news">Spravovat aktuality</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obsah webu</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Úprava textů
            </div>
            <p className="text-xs text-muted-foreground">
              Změna textů a obrázků na webu
            </p>
            <Button asChild className="mt-4 w-full" size="sm" variant="secondary">
              <Link href="/admin/content">Upravit obsah</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hlavní stránka</CardTitle>
            <Grape className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Web vinařství
            </div>
            <p className="text-xs text-muted-foreground">
              Zobrazit web vinařství
            </p>
            <Button asChild className="mt-4 w-full" size="sm" variant="outline">
              <Link href="/" target="_blank">Navštívit web</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Přidat obsah</CardTitle>
            <CardDescription>
              Rychlé přidání nového obsahu na web
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/admin/wines/new">Přidat nové víno</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/news/new">Přidat novou aktualitu</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Nápověda k administraci</CardTitle>
            <CardDescription>
              Základní informace k administraci webu
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                V sekci <strong>Vína</strong> můžete přidávat, upravovat a mazat nabídku vín.
              </li>
              <li>
                V sekci <strong>Aktuality</strong> můžete spravovat informace a novinky z vinařství.
              </li>
              <li>
                Při <strong>nahrávání obrázků</strong> používejte fotky v kvalitním rozlišení, ideálně v poměru stran 4:3.
              </li>
              <li>
                Pro <strong>odhlášení</strong> z administrace použijte tlačítko v levém menu.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
