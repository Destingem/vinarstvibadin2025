import { AdminNav } from "@/components/admin/admin-nav"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { GitHubIcon } from "@/components/github-icon"
import { UserButton } from "@/components/admin/user-button"
import { Metadata } from "next"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "Administrace | Vinařství Badin",
  description: "Administrační rozhraní pro správu obsahu webu Vinařství Badin",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Remove server-side authentication check
  // The middleware is already handling authentication for /admin/* routes
  
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="flex h-16 items-center px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <GitHubIcon className="h-6 w-6" />
              <span>Administrace</span>
            </Link>

            <div className="ml-auto flex items-center space-x-4">
              <UserButton />
            </div>
          </div>
        </header>

        <main className="flex flex-1">
          <div className="hidden w-64 border-r p-6 md:block">
            <AdminNav />
          </div>
          <div className="flex-1 p-6 pt-8 md:p-8">
            {children}
          </div>
        </main>

        <Toaster />
      </div>
    </Providers>
  )
}
