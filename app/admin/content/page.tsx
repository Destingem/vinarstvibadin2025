"use client"

import { useState, useEffect } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { Button } from "@/components/ui/button"
import { Loader2, Save, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ContentData } from "@/types"
import { fetchContent, updateContent } from "@/lib/api"
import { set } from "lodash"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContentPage() {
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchContent()
        setContent(data)
      } catch (err) {
        console.error("Chyba při načítání obsahu:", err)
        setError("Nepodařilo se načíst obsah webu. Zkuste to znovu.")
        toast({
          title: "Chyba při načítání",
          description: "Nepodařilo se načíst obsah webu. Zkuste to znovu.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [toast])

  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    setError(null)
    
    try {
      await updateContent(content)
      
      toast({
        title: "Uloženo!",
        description: "Obsah webu byl úspěšně aktualizován.",
        variant: "success"
      })
    } catch (err) {
      console.error("Chyba při ukládání obsahu:", err)
      setError("Nepodařilo se uložit obsah webu. Zkuste to znovu.")
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit obsah webu. Zkuste to znovu.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (path: string, value: any) => {
    if (!content) return

    setContent(prevContent => {
      if (!prevContent) return null
      
      // Hluboká kopie content objektu pro bezpečnější aktualizaci
      const newContent = JSON.parse(JSON.stringify(prevContent));
      
      try {
        // Speciální zpracování pro timeline a features
        if (path === 'timeline') {
          newContent.about.timeline = value;
          return newContent;
        } 
        else if (path === 'features') {
          newContent.features = value;
          return newContent;
        }
        
        // Standardní zpracování pro ostatní cesty
        const fullPath = path ? (path.startsWith('.') ? path.substring(1) : path) : '';
        if (fullPath) {
          set(newContent, fullPath, value);
        }
        return newContent;
      } catch (err) {
        console.error("Chyba při změně hodnoty:", err);
        toast({
          title: "Chyba změny hodnoty",
          description: `Nepodařilo se změnit hodnotu na cestě ${path}`,
          variant: "destructive"
        });
        return prevContent;
      }
    });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!content) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Chyba</AlertTitle>
        <AlertDescription>
          Nepodařilo se načíst obsah webu. Zkuste obnovit stránku.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chyba</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Správa obsahu webu</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ukládání...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Uložit změny
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <SectionEditor
          title="Úvodní sekce (Hero)"
          data={content.hero}
          path="hero"
          onChange={handleChange}
        />

        <SectionEditor
          title="O nás"
          data={content.about}
          path="about"
          onChange={handleChange}
        />

        <SectionEditor
          title="Aktuality"
          data={content.news}
          path="news"
          onChange={handleChange}
        />

        <SectionEditor
          title="Vína"
          data={content.wines}
          path="wines"
          onChange={handleChange}
        />

        <SectionEditor
          title="Kontakt"
          data={content.contact}
          path="contact"
          onChange={handleChange}
        />

        <SectionEditor
          title="Funkce (Features)"
          data={{ features: content.features }}
          path=""
          onChange={handleChange}
        />

        <SectionEditor
          title="Popup"
          data={content.popup}
          path="popup"
          onChange={handleChange}
        />
      </div>

      <div className="pt-8 pb-16 flex justify-center">
        <Button size="lg" onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Ukládání...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" /> Uložit všechny změny
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
