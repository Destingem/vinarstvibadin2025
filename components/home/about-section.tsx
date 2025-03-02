import { Button } from "@/components/ui/button"
import { Timeline } from "@/types/timeline"

interface AboutSectionProps {
  badge: string
  title: string
  paragraphs: string[]
  timeline: Timeline[]
  cta: string
}

export function AboutSection({ badge, title, paragraphs, timeline, cta }: AboutSectionProps) {
  return (
    <section id="o-nas" className="scroll-mt-16 py-24 bg-muted/30">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Text Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:h-fit">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                {badge}
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}

              {/* Timeline */}
              <div className="mt-12 space-y-8">
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-muted">
                    <div className="absolute left-0 top-0 flex h-6 w-6 -translate-x-[11px] items-center justify-center rounded-full bg-background shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">{item.year}</div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Button size="lg" variant="default" asChild>
                  <a href="#kontakt">{cta}</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="lg:col-span-7">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="grid gap-8">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="/vinohrad.jpg"
                    alt="Vinný sklep"
                    className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="/vine.avif"
                    alt="Vinice"
                    className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
              <div className="grid gap-8 md:translate-y-16">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="/glass.avif"
                    alt="Lahve vína"
                    className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src="/cork.jpg"
                    alt="Vinařství"
                    className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
