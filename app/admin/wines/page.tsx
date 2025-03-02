"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, Loader2, Wine as WineIcon, Filter } from "lucide-react"
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
import { useRouter } from "next/navigation"
import { Wine } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function WinesPage() {
  const router = useRouter()
  const [wines, setWines] = useState<Wine[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "bile" | "ruzove" | "cervene">("all")
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const response = await fetch("/api/wines")
        
        if (!response.ok) {
          throw new Error("Nelze načíst vína")
        }
        
        const data = await response.json()
        setWines(data)
      } catch (err) {
        console.error("Chyba při načítání vín:", err)
        setError("Nepodařilo se načíst vína")
      } finally {
        setLoading(false)
      }
    }

    fetchWines()
  }, [])

  const filteredWines = filter === "all" 
    ? wines 
    : wines.filter(wine => wine.type === filter)

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    setDeleting(true)
    
    try {
      const response = await fetch(`/api/wines/${itemToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Nelze odstranit víno")
      }

      // Odstranit položku ze seznamu
      setWines((items) => items.filter((item) => item.id !== itemToDelete))
      
    } catch (err) {
      console.error("Chyba při odstraňování:", err)
      setError("Nepodařilo se odstranit víno")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      router.refresh()
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bile": return "Bílé";
      case "cervene": return "Červené";
      case "ruzove": return "Růžové";
      default: return "Neznámé";
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bile": return "bg-amber-100 text-amber-800 border-amber-200";
      case "cervene": return "bg-red-100 text-red-800 border-red-200";
      case "ruzove": return "bg-pink-100 text-pink-800 border-pink-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
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
        <h2 className="text-xl font-semibold">Seznam vín</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filter === "all" ? "Všechna vína" : 
                 filter === "bile" ? "Bílá vína" : 
                 filter === "ruzove" ? "Růžová vína" : "Červená vína"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrovat podle typu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("all")}>
                Všechna vína
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("bile")}>
                Bílá vína
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("ruzove")}>
                Růžová vína
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("cervene")}>
                Červená vína
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="/admin/wines/new">
              <Plus className="mr-2 h-4 w-4" />
              Přidat víno
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Název</TableHead>
                <TableHead>Ročník</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Cena</TableHead>
                <TableHead className="w-[120px]">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWines.length > 0 ? (
                filteredWines.map((wine) => (
                  <TableRow key={wine.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-sm">
                          <img 
                            src={wine.image || "/wine-placeholder.svg"} 
                            alt={wine.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/wine-placeholder.svg";
                            }} 
                          />
                        </div>
                        <div className="font-medium">{wine.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{wine.year}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getTypeColor(wine.type)}`}>
                        {getTypeLabel(wine.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{wine.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/admin/wines/edit/${wine.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Upravit</span>
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(wine.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Odstranit</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {filter !== "all" 
                      ? `Nenalezena žádná ${filter === "bile" ? "bílá" : filter === "ruzove" ? "růžová" : "červená"} vína`
                      : "Zatím nebyla přidána žádná vína"
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Potvrzovací dialog pro smazání */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat toto víno?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Víno bude trvale odstraněno z nabídky.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Zrušit</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mazání...
                </>
              ) : (
                "Smazat"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
