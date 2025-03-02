import { Card, CardContent } from "@/components/ui/card"
import { NewsItem } from "@/types"

interface NewsCardProps {
  news: NewsItem
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={news.imageUrl || "/wine-placeholder.svg"}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground mb-2">{news.date}</div>
        <h3 className="text-xl font-semibold mb-3">{news.title}</h3>
        <p className="text-muted-foreground">{news.content}</p>
      </CardContent>
    </Card>
  )
}
