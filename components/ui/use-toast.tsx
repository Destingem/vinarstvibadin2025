"use client"
import { useState, useEffect, createContext, useContext } from "react"

// Simplifikovaná verze toast hooku bez složitých stavových operací
type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

type ToastContextType = {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Jednoduchý toast systém
  const toast = ({ title, description, action, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((toasts) => [...toasts, { id, title, description, action, variant }])
    
    // Automatické odstranění po 5 sekundách
    setTimeout(() => {
      dismiss(id)
    }, 5000)
    
    return id
  }

  const dismiss = (id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  
  return context
}
