"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserButton() {
  const router = useRouter()
  
  // Použijeme try/catch aby komponenta fungovala i bez SessionProvider
  let session
  try {
    const { data } = useSession()
    session = data
  } catch (error) {
    console.log('SessionProvider není dostupný, používám fallback')
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-xs leading-none text-muted-foreground">
              Vinařství Badin
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Nastavení</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            try {
              signOut({ callbackUrl: "/admin/login" })
            } catch (e) {
              router.push("/admin/login")
            }
          }}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Odhlásit se</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
