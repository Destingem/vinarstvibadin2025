"use client"

import { useState, useEffect } from "react"
import { NewsForm } from "@/components/admin/news-form"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { NewsItem } from "@/types"  // Přidán import typu NewsItem

export default function EditNews() {
  const { id } = useParams() as { id: string }
  const [news, setNews] = useState<NewsItem | null>(null) // Explicitní typování stavu
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${id}`)
        
        if (!response.ok) {
          throw new Error("Aktualita nebyla nalezena")
        }
        
        const data = await response.json()
        setNews(data)
      } catch (err) {
        console.error("Chyba při načítání aktuality:", err)
        setError("Nepodařilo se načíst data aktuality")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 p-6 rounded-md text-destructive">
        <h2 className="text-xl font-semibold mb-2">Chyba</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Upravit aktualitu: {news?.title}
        </h2>
      </div>
      
      {news && <NewsForm newsItem={news} isEditing={true} />}
    </div>
  )
}
