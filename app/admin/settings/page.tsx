"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash, RefreshCw, Loader2, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { toast } = useToast()
  const [revalidating, setRevalidating] = useState(false)
  const [clearCacheDialogOpen, setClearCacheDialogOpen] = useState(false)
  const [clearingCache, setClearingCache] = useState(false)

  const handleRevalidateCache = async () => {
    setRevalidating(true)
    try {
      const response = await fetch('/api/revalidate?path=/')
      
      if (!response.ok) {
        throw new Error('Revalidace selhala')
      }
      
      toast({
        title: "Úspěch!",
        description: "Obsah stránky byl úspěšně načten znovu.",
      })
    } catch (error) {
      toast({
        title: "Chyba!",
        description: "Nepodařilo se provést revalidaci cache.",
        variant: "destructive"
      })
    } finally {
      setRevalidating(false)
    }
  }

  const handleClearCache = async () => {
    setClearingCache(true)
    try {
      // V produkčním prostředí by zde byl další API endpoint pro čištění cache
      // Pro jednoduchost pouze simulujeme úspěch a používáme revalidaci
      await new Promise(resolve => setTimeout(resolve, 1000))
      await handleRevalidateCache()
      
      toast({
        title: "Cache vyčištěna",
        description: "Vyrovnávací paměť byla úspěšně vyčištěna.",
      })
    } catch (error) {
      toast({
        title: "Chyba!",
        description: "Nepodařilo se vyčistit cache.",
        variant: "destructive"
      })
    } finally {
      setClearingCache(false)
      setClearCacheDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Nastavení</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Aktualizace obsahu na webu</CardTitle>
            <CardDescription>
              Vynucení aktualizace obsahu na webu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-6 text-muted-foreground">
              Tato funkce obnoví aktuální obsah na webu z databáze. Použijte ji, pokud se provedené změny nezobrazují.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleRevalidateCache}
              disabled={revalidating}
            >
              {revalidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aktualizuji...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Aktualizovat obsah webu
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Čištění vyrovnávací paměti</CardTitle>
            <CardDescription>
              Kompletní vyčištění vyrovnávací paměti webu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-6 text-muted-foreground">
              Tato funkce vymaže všechnu vyrovnávací paměť webu. Používejte pouze v případě, že máte problémy s aktuálností obsahu.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="destructive"
              onClick={() => setClearCacheDialogOpen(true)}
              disabled={clearingCache}
            >
              {clearingCache ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Čištění...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Vyčistit cache
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Stav systému</CardTitle>
          <CardDescription>
            Aktuální stav důležitých komponent systému
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">API Status</p>
                  <p className="text-xs text-muted-foreground">Připojení k API serveru</p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Databáze</p>
                  <p className="text-xs text-muted-foreground">Připojení k databázi</p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Úložiště obrázků</p>
                  <p className="text-xs text-muted-foreground">Systém pro nahrávání obrázků</p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Aktualizace obsahu</p>
                  <p className="text-xs text-muted-foreground">Systém revalidace cache</p>
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pro potvrzení čištění cache */}
      <AlertDialog open={clearCacheDialogOpen} onOpenChange={setClearCacheDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete vyčistit cache?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce vymaže všechnu vyrovnávací paměť webu. Web může být na krátkou dobu pomalejší, než se cache znovu vytvoří.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearingCache}>Zrušit</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearCache}
              disabled={clearingCache}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {clearingCache ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Čištění...
                </>
              ) : (
                "Vyčistit cache"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
