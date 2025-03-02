import { Card, CardContent } from "@/components/ui/card"
import { BuildingIcon, ClockIcon, MapPinIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react"

interface ContactSectionProps {
  title: string
  intro: string
  details: {
    company: {
      name: string
      ico: string
    }
    owner: string
    address: string
    phones: string[]
    email: string
    openingHours: string
    gps: string
  }
}

export function ContactSection({ title, intro, details }: ContactSectionProps) {
  return (
    <section id="kontakt" className="container scroll-mt-16 py-24">
      <div className="grid gap-12 lg:grid-cols-2 min-h-[600px]">
        <div className="flex flex-col gap-8 h-full">
          <div className="flex-shrink-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              {intro}
            </p>
          </div>

          <Card className="flex-1">
            <CardContent className="grid gap-4 p-6 h-full">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <BuildingIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">{details.company.name}</h3>
                    <p className="text-sm text-muted-foreground">IČO: {details.company.ico}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <UserIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">{details.owner}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPinIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Adresa</h3>
                    <p className="text-sm text-muted-foreground">{details.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <PhoneIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Telefon</h3>
                    <div className="space-y-1">
                      {details.phones.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MailIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a
                      href={`mailto:${details.email}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {details.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ClockIcon className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Otevírací doba</h3>
                    <p className="text-sm text-muted-foreground">{details.openingHours}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-full flex flex-col gap-6">
          <div className="flex-1 w-full rounded-xl overflow-hidden relative">
            <iframe
              src="https://maps.google.com/maps?q=Vina%C5%99stv%C3%AD%20Badinovi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            />
          </div>
          <Card className="shrink-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <MapPinIcon className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium">Navigace k vinařství</p>
                  <p className="text-muted-foreground">{details.gps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
