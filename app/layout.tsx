import "./globals.css"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat, Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { ToastProvider } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "@/components/session-provider"

// Definice fontů s podporou českých znaků
const playfair = Playfair_Display({ 
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap"
})

const montserrat = Montserrat({ 
  subsets: ["latin", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap"
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vinařství Badin - Rodinné vinařství z jižní Moravy",
  description: "Tradiční rodinné vinařství v Moravských Bránicích, kde každá láhev vypráví příběh naší rodiny a našeho terroir.",
  keywords: ["vinařství", "víno", "Moravské Bránice", "Badin", "jižní Morava", "rodinné vinařství"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={cn(
        "min-h-screen bg-background antialiased", 
        playfair.variable, 
        montserrat.variable, 
        "font-montserrat"
      )}>
        <SessionProvider>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

