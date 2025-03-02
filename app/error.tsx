'use client'

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-6">Ups! Něco se pokazilo</h1>
        <p className="text-muted-foreground mb-8">
          Při načítání stránky došlo k chybě. Zkuste stránku obnovit nebo se vraťte na domovskou stránku.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>Zkusit znovu</Button>
          <Button variant="outline" asChild>
            <a href="/">Zpět na hlavní stránku</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
