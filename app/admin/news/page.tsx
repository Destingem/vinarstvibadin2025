"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
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

interface NewsItem {
  id: string
  date: string
  title: string
  content: string
  imageUrl: string
  createdAt: string
}

export default function NewsPage() {
  const router = useRouter()
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        
        if (!response.ok) {
          throw new Error("Nelze načíst aktuality")
        }
        
        const data = await response.json()
        setNewsItems(data)
      } catch (err) {
        console.error("Chyba při načítání aktualit:", err)
        setError("Nepodařilo se načíst aktuality")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    setDeleting(true)
    
    try {
      const response = await fetch(`/api/news/${itemToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Nelze odstranit aktualitu")
      }

      // Odstranit položku ze seznamu
      setNewsItems((items) => items.filter((item) => item.id !== itemToDelete))
      
    } catch (err) {
      console.error("Chyba při odstraňování:", err)
      setError("Nepodařilo se odstranit aktualitu")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
      router.refresh()
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
        <h2 className="text-xl font-semibold">Seznam aktualit</h2>
        <Button asChild>
          <Link href="/admin/news/new">
            <Plus className="mr-2 h-4 w-4" />
            Přidat aktualitu
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Název</TableHead>
                <TableHead>Obrázek</TableHead>
                <TableHead className="w-[120px]">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.length > 0 ? (
                newsItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-muted-foreground line-clamp-1 text-sm">
                        {item.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.imageUrl && (
                        <div className="h-10 w-16 overflow-hidden rounded-sm">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/admin/news/edit/${item.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Upravit</span>
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(item.id)}
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
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Zatím nebyly přidány žádné aktuality
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
            <AlertDialogTitle>Opravdu chcete smazat tuto aktualitu?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Aktualita bude trvale odstraněna ze systému.
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
