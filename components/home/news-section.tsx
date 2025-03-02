import { Card, CardContent } from "@/components/ui/card"
import { NewsItem } from "@/types"
import { TruncatedText } from "@/components/ui/truncated-text"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface NewsSectionProps {
  title: string
  subtitle: string
  news: NewsItem[]
}

export function NewsSection({ title, subtitle, news }: NewsSectionProps) {
  return (
    <section id="aktuality" className="scroll-mt-16 py-24 bg-white">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {news && news.length > 0 ? news.slice(0, 3).map((item, index) => (
            <Card key={item.id || index} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground mb-2">{item.date}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <TruncatedText 
                  text={item.content}
                  title={item.title}
                  date={item.date}
                  maxLength={120}
                />
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Aktuálně nejsou k dispozici žádné novinky.
            </div>
          )}
        </div>
        
        {news && news.length > 3 && (
          <div className="mt-12 text-center">
            <Button variant="outline" asChild>
              <Link href="/aktuality">Zobrazit všechny aktuality</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
