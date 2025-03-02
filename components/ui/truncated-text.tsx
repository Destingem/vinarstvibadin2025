"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TruncatedTextProps {
  text: string
  title?: string
  date?: string
  maxLength?: number
}

export function TruncatedText({ text, title, date, maxLength = 150 }: TruncatedTextProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Zjistit, zda je text potřeba zkrátit
  const shouldTruncate = text.length > maxLength
  const truncatedText = shouldTruncate 
    ? text.substring(0, maxLength).trim() + "..." 
    : text
    
  return (
    <>
      <p>{truncatedText}</p>
      {shouldTruncate && (
        <Button 
          variant="link" 
          className="mt-2 h-auto p-0 text-primary" 
          onClick={() => setIsDialogOpen(true)}
        >
          Číst více
        </Button>
      )}
      
      {/* Dialog s celým textem */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title || "Podrobné informace"}</DialogTitle>
            {date && <DialogDescription>{date}</DialogDescription>}
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {text.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
