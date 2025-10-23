import { Card, CardContent } from "@/components/ui/card"
import { TruncatedText } from "@/components/ui/truncated-text"
import { Metadata } from "next"
import { fetchNews } from "@/lib/api"

// Vypnutí statické generace - vždy dynamické renderování
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: "Aktuality | Vinařství Badin",
  description: "Nejnovější informace z našeho vinařství, pozvánky na akce a novinky v nabídce vín.",
}

export default async function AktualityPage() {
  const news = await fetchNews()
  
  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Aktuality</h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Nejnovější informace z našeho vinařství, pozvánky na akce a novinky v nabídce vín.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {news && news.length > 0 ? news.map((item, index) => (
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
                    maxLength={150}
                  />
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Aktuálně nejsou k dispozici žádné novinky.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
