import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  badge: string
  title: string
  subtitle: string
  buttonPrimary: string
  buttonSecondary: string
  backgroundImage: string
}

export function HeroSection({
  badge,
  title,
  subtitle,
  buttonPrimary,
  buttonSecondary,
  backgroundImage
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-muted/30" />
        <img
          src={backgroundImage || "/vinice.jpeg"}
          alt="Vinice Vinařství Badin"
          className="h-full w-full object-cover object-center motion-safe:animate-ken-burns"
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 pt-20">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-10">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm 
                        font-medium text-white backdrop-blur transition-colors hover:bg-white/20">
              {badge}
            </div>
            <div className="space-y-8">
              <h1 className="text-gradient bg-gradient-to-b from-white via-white to-white/80 bg-clip-text font-bold 
                         tracking-tight text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
                {title}
              </h1>
              <p className="max-w-2xl text-xl text-white/90 md:text-2xl font-light leading-relaxed">
                {subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-medium transition-transform hover:scale-105 bg-white text-zinc-900 
                         hover:bg-white hover:text-zinc-900 hover:opacity-90 rounded-full"
                asChild
              >
                <a href="#vina">{buttonPrimary}</a>
              </Button>
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-medium transition-transform hover:scale-105 bg-white/10 text-white 
                         backdrop-blur hover:bg-white/20 border-white/20 rounded-full"
                variant="outline"
                asChild
              >
                <a href="#kontakt">{buttonSecondary}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
