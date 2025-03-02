import { cn } from "@/lib/utils"
import Image from "next/image"

interface GitHubIconProps {
  className?: string
}

export function GitHubIcon({ className }: GitHubIconProps) {
  return (
    <div className={cn("h-6 w-6 relative overflow-hidden", className)}>
      <div className="flex items-center justify-center w-full h-full rounded-full bg-primary/10">
        <span className="text-primary text-xs font-semibold">VB</span>
      </div>
    </div>
  )
}
