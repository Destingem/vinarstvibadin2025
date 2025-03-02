"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  // Zjednodušená verze bez complex state management
  const { toasts } = useToast() || { toasts: [] }

  return (
    <div className="toaster-container">
      <ToastProvider>
        <div>
          {toasts.map((toast) => (
            <Toast key={toast.id} variant={toast.variant}>
              <div className="flex-1">
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
              </div>
              {toast.action}
              <ToastClose />
            </Toast>
          ))}
        </div>
        <ToastViewport />
      </ToastProvider>
    </div>
  )
}
