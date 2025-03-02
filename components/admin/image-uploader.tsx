"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  currentImage?: string
  onImageUploaded: (url: string) => void
  disabled?: boolean
  placeholderImageUrl?: string
}

export function ImageUploader({ 
  currentImage, 
  onImageUploaded, 
  disabled, 
  placeholderImageUrl = "/wine-placeholder.svg" 
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Validace typu souboru
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError("Neplatný typ souboru. Povolené formáty: JPG, PNG, WEBP")
      return
    }
    
    // Validace velikosti (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Soubor je příliš velký. Maximální velikost je 5 MB")
      return
    }
    
    setError(null)
    setUploading(true)
    
    try {
      // Vytvoření FormData pro nahrání souboru
      const formData = new FormData()
      formData.append('file', file)
      
      // Nahrání souboru na server
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Chyba při nahrávání obrázku')
      }
      
      const data = await response.json()
      
      // Nastavení náhledu a předání URL obrázku rodiči
      setPreview(data.url)
      onImageUploaded(data.url)
    } catch (err) {
      console.error('Chyba nahrávání:', err)
      setError(err instanceof Error ? err.message : 'Nepodařilo se nahrát obrázek. Zkuste to znovu.')
    } finally {
      setUploading(false)
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const clearImage = () => {
    setPreview(null)
    onImageUploaded("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-destructive/10 p-3 text-sm rounded-md text-destructive">
          {error}
        </div>
      )}
      
      {preview ? (
        <div className="relative overflow-hidden rounded-md bg-muted">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img
              src={preview}
              alt="Náhled obrázku"
              className="h-full w-full object-cover"
            />
          </div>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2"
            onClick={clearImage}
            disabled={disabled || uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={!disabled && !uploading ? handleClickUpload : undefined}
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-md border border-dashed p-8",
            !disabled && !uploading && "cursor-pointer hover:bg-muted/50"
          )}
        >
          <div className="rounded-full bg-muted/60 p-3">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {uploading ? "Nahrávání..." : "Klikněte pro nahrání obrázku"}
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (max 5MB)</p>
            <p className="text-xs text-primary mt-1">
              Bez obrázku bude použit výchozí placeholder s hrozny.
            </p>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
      
      {!preview && (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={disabled || uploading}
          onClick={handleClickUpload}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Nahrávání...
            </>
          ) : (
            "Vybrat obrázek"
          )}
        </Button>
      )}
    </div>
  )
}
