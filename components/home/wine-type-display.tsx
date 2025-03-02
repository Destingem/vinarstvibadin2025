import { WineCard } from "@/components/home/wine-card"
import { Wine } from "@/types"

interface WineTypeDisplayProps {
  wines: Wine[]
  type: "bile" | "cervene" | "ruzove" | "all"
  bgClass: string
  secondaryBgClass: string
}

export function WineTypeDisplay({ wines, type, bgClass, secondaryBgClass }: WineTypeDisplayProps) {
  // Filtrování vín podle typu, pokud není "all"
  const filteredWines = type === "all" 
    ? wines 
    : wines.filter(wine => wine.type === type)
  
  return (
    <div className="relative">
      <div className={`absolute -top-20 right-0 w-full h-[600px] ${bgClass} rounded-[40%] opacity-70 blur-2xl -z-10`} />
      <div className={`absolute bottom-0 left-20 w-2/3 h-[400px] ${secondaryBgClass} rounded-full opacity-60 blur-3xl -z-10`} />
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWines.length > 0 ? (
          filteredWines.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            {type === "bile" && "Aktuálně nejsou k dispozici žádná bílá vína."}
            {type === "cervene" && "Aktuálně nejsou k dispozici žádná červená vína."}
            {type === "ruzove" && "Aktuálně nejsou k dispozici žádná růžová vína."}
            {type === "all" && "Aktuálně nejsou k dispozici žádná vína."}
          </div>
        )}
      </div>
    </div>
  )
}
