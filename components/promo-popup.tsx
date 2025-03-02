"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PromoPopupProps {
  title: string
  description: string
  imageUrl?: string
  buttonText: string
  buttonLink: string
}

export function PromoPopup({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
}: PromoPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Check if we've shown this popup before
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("hasSeenPromoPopup")
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000) // Show popup after 3 seconds
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    // Remember that user has seen the popup
    localStorage.setItem("hasSeenPromoPopup", "true")
    
    // Clear this setting after 1 day so they see the popup again
    setTimeout(() => {
      localStorage.removeItem("hasSeenPromoPopup")
    }, 24 * 60 * 60 * 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Zavřít</span>
          </Button>
        </DialogHeader>
        
        {imageUrl && (
          <div className="relative h-40 w-full overflow-hidden rounded-md">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <p className="text-foreground/90">{description}</p>
        
        <DialogFooter>
          <Button asChild className="w-full">
            <a href={buttonLink}>{buttonText}</a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
