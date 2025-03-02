"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploader } from "@/components/admin/image-uploader"
import { useToast } from "@/components/ui/use-toast"
import { NewsItem } from "@/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface NewsFormProps {
  newsItem?: NewsItem
  isEditing?: boolean
}

export function NewsForm({ newsItem, isEditing = false }: NewsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: newsItem?.title || "",
    content: newsItem?.content || "",
    date: newsItem?.date || new Date().toLocaleDateString("cs-CZ"),
    imageUrl: newsItem?.imageUrl || ""
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = isEditing ? `/api/news/${newsItem?.id}` : "/api/news"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Chyba při ukládání aktuality")
      }

      toast({
        title: isEditing ? "Aktualita aktualizována" : "Aktualita vytvořena",
        description: isEditing 
          ? "Aktualita byla úspěšně aktualizována" 
          : "Nová aktualita byla úspěšně vytvořena",
        variant: "success"
      })

      // Po úspěšném uložení přesměrujeme na seznam aktualit
      router.push("/admin/news")
      router.refresh()
    } catch (err) {
      console.error("Chyba při ukládání:", err)
      setError("Nepodařilo se uložit aktualitu. Zkuste to znovu.")
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit aktualitu",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Název aktuality</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Formát: DD.MM.YYYY (např. 12.5.2023)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Obsah aktuality</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Obrázek aktuality</Label>
              <ImageUploader
                currentImage={formData.imageUrl}
                onImageUploaded={handleImageUpload}
                disabled={loading}
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2 mt-4">
              <h4 className="font-medium">Tipy pro zadávání aktualit</h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Stručné, ale výstižné názvy přitáhnou více čtenářů</li>
                <li>Vždy přidávejte obrázek pro zvýšení atraktivity aktuality</li>
                <li>Správně formátujte datum pro konzistentní vzhled</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Zrušit
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              {isEditing ? "Aktualizuji..." : "Vytvářím..."}
            </>
          ) : (
            isEditing ? "Aktualizovat aktualitu" : "Vytvořit aktualitu"
          )}
        </Button>
      </div>
    </form>
  );
}
