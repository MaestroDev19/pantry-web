"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

function MultiProgress({
  className,
  segments,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  segments: { value: number; className?: string }[]
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      {segments.map((segment, index) => (
        <div
          key={index}
          className={cn("h-full transition-all", segment.className)}
          style={{ width: `${Math.max(0, Math.min(100, segment.value))}%` }}
        />
      ))}
    </ProgressPrimitive.Root>
  )
}

export { Progress, MultiProgress }
