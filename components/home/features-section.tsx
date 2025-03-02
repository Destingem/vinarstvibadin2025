import { Feature } from "@/types"
import { GrapeIcon, MapPinIcon, WineIcon } from "lucide-react"

// Helper funkce pro získání správné ikony
const getIcon = (iconName: string) => {
  switch(iconName) {
    case "GrapeIcon": return GrapeIcon;
    case "WineIcon": return WineIcon;
    case "MapPinIcon": return MapPinIcon;
    default: return GrapeIcon;
  }
}

interface FeaturesSectionProps {
  features: Feature[]
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="relative -mt-20 container z-20">
      <div className="grid gap-8 rounded-3xl bg-white/95 backdrop-blur-sm p-8 shadow-xl sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = getIcon(feature.icon);
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}
