"use client"

import type { ComponentProps } from "react"

type ToastVariant = "default" | "success" | "error"

interface ToastMessage {
  id: number
  title: string
  variant: ToastVariant
}

interface ToasterProps extends ComponentProps<"div"> {
  messages?: ToastMessage[]
}

// Minimal inline toaster used until the dedicated toast library is available.
// This keeps the API surface small while still providing visual feedback.
export function Toaster(props: ToasterProps) {
  const { className, messages = [], ...rest } = props

  if (messages.length === 0) {
    return null
  }

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 ${className ?? ""}`}
      {...rest}
    >
      {messages.map((message) => {
        const toneClasses =
          message.variant === "success"
            ? "bg-emerald-600 text-emerald-50"
            : message.variant === "error"
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted text-foreground"

        return (
          <div
            key={message.id}
            className={`pointer-events-auto max-w-sm rounded-md px-4 py-2 text-sm shadow-md ${toneClasses}`}
          >
            {message.title}
          </div>
        )
      })}
    </div>
  )
}

