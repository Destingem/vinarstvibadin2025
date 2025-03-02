"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Wine } from "@/types"  // Explicitní import typu Wine
import { WineForm } from "@/components/admin/wine-form" // Ujistěte se, že je tato cesta správná

export default function EditWine() {
  const { id } = useParams() as { id: string }
  const [wine, setWine] = useState<Wine | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchWine = async () => {
      try {
        const response = await fetch(`/api/wines/${id}`)
        if (!response.ok) {
          throw new Error("Víno nebylo nalezeno")
        }
        const data: Wine = await response.json()
        setWine(data)
      } catch (err) {
        console.error("Chyba při načítání vína:", err)
        setError("Nepodařilo se načíst víno")
      } finally {
        setLoading(false)
      }
    }

    fetchWine()
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
          Upravit víno: {wine?.name}
        </h2>
      </div>
      
      {wine && <WineForm wine={wine} isEditing={true} />}
    </div>
  )
}
