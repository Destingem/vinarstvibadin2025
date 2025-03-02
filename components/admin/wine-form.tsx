"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/admin/image-uploader"

interface WineFormProps {
  wine?: {
    id?: string
    name: string
    year: string
    description: string
    price: string
    image: string
    type: string
    attributes: string[]
  }
  isEditing?: boolean
}

export function WineForm({ wine, isEditing = false }: WineFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: wine?.name || "",
    year: wine?.year || new Date().getFullYear().toString(),
    description: wine?.description || "",
    price: wine?.price || "",
    image: wine?.image || "",
    type: wine?.type || "bile",
    attributes: wine?.attributes?.join(", ") || ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      image: url
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Převedení atributů z formátu oddělených čárkami na pole
      const attributes = formData.attributes
        .split(",")
        .map(attr => attr.trim())
        .filter(attr => attr !== "")

      const wineData = {
        ...formData,
        attributes
      }

      // Určení URL a metody podle toho, zda vytváříme nebo upravujeme
      const url = isEditing && wine?.id 
        ? `/api/wines/${wine.id}` 
        : "/api/wines"
      
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wineData),
      })

      if (!response.ok) {
        throw new Error("Chyba při ukládání vína")
      }

      // Po úspěšném uložení přesměrujeme na seznam vín
      router.push("/admin/wines")
      router.refresh()
    } catch (err) {
      console.error("Chyba při ukládání:", err)
      setError("Nepodařilo se uložit víno. Zkuste to znovu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Název vína</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Ročník</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Typ vína</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange(value, "type")}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte typ vína" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bile">Bílé víno</SelectItem>
                  <SelectItem value="cervene">Červené víno</SelectItem>
                  <SelectItem value="ruzove">Růžové víno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Cena</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="např. 120 Kč"
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attributes">Vlastnosti (oddělené čárkou)</Label>
              <Input
                id="attributes"
                name="attributes"
                value={formData.attributes}
                onChange={handleChange}
                placeholder="např. suché, aromatické"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Zadejte vlastnosti oddělené čárkami, např.: suché, aromatické, plné
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Popis vína</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Obrázek vína</Label>
              {!formData.image && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Náhled výchozího obrázku:
                  </p>
                  <div className="rounded-md overflow-hidden border w-40 h-40">
                    <img 
                      src="/wine-placeholder.svg" 
                      alt="Výchozí obrázek vína" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              )}
              <ImageUploader
                currentImage={formData.image}
                onImageUploaded={handleImageUpload}
                disabled={loading}
                placeholderImageUrl="/wine-placeholder.svg"
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2 mt-4">
              <h4 className="font-medium">Tipy pro zadávání vín</h4>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                <li>Pro bílá vína používejte detailní popis chutí a vůní</li>
                <li>Pro červená vína uveďte i vhodné párování s jídlem</li>
                <li>Do atributů přidejte informace jako "suché", "polosladké" atd.</li>
                <li>Pro nejlepší zobrazení nahrajte obrázek lahve na neutrálním pozadí</li>
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
          {loading ? "Ukládání..." : isEditing ? "Aktualizovat" : "Vytvořit"}
        </Button>
      </div>
    </form>
  )
}
