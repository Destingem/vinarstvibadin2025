import { Card } from "@/components/ui/card"

interface WineCardProps {
  name: string
  year: string
  description: string
  price: string
  image: string
}

export function WineCard({ name, year, description, price, image }: WineCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-muted/40">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
      </div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="translate-y-4 transform space-y-2 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-semibold leading-tight">{name}</h3>
            <span className="shrink-0 text-sm font-medium text-white/70">{year}</span>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {description}
          </p>
          <div className="pt-4">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              {price}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

