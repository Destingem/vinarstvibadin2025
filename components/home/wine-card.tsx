import { Badge } from "@/components/ui/badge"
import { Wine } from "@/types"
import { TruncatedText } from "@/components/ui/truncated-text"

interface WineCardProps {
  wine: Wine
}

export function WineCard({ wine }: WineCardProps) {
  // Použití vlastního placeholderu pokud víno nemá obrázek
  const imageSrc = wine.image || "/wine-placeholder.svg"
  
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl">
      <div className="relative h-60 w-full overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={wine.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/wine-placeholder.svg";
          }}
        />
      </div>
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {wine.attributes.map((attr) => (
            <Badge key={attr} variant="outline" className="bg-primary/5 border-primary/20 text-primary/90">
              {attr}
            </Badge>
          ))}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold">{wine.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ročník: {wine.year}</p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block rounded-full bg-primary/5 px-4 py-1 text-lg font-semibold text-primary">
              {wine.price + " Kč"}
            </span>
          </div>
        </div>
        <div className="mt-4 text-muted-foreground">
          <TruncatedText 
            text={wine.description} 
            title={`${wine.name} (${wine.year})`} 
            maxLength={100}
          />
        </div>
      </div>
    </div>
  )
}
