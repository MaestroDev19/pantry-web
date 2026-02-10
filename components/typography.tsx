import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

// Small collection of typography primitives used across the app.
// These components wrap semantic HTML elements with consistent Tailwind styles.
type TypographyProps = HTMLAttributes<HTMLElement>

export function TypographyH1(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <h1
      className={cn(
        "scroll-m-20 text-balance text-center text-4xl font-extrabold tracking-tight",
        className,
      )}
      {...rest}
    />
  )
}

export function TypographyH2(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...rest}
    />
  )
}

export function TypographyH3(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...rest}
    />
  )
}

export function TypographyH4(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
      {...rest}
    />
  )
}

export function TypographyP(
  props: Omit<TypographyProps, "children"> & { children: React.ReactNode },
) {
  const { className, ...rest } = props

  return (
    <p className={cn("leading-7 not-first:mt-6", className)} {...rest} />
  )
}

export function TypographyBlockquote(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...rest}
    />
  )
}

export function TypographyList(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...rest}
    />
  )
}

export function TypographyInlineCode(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <code
      className={cn(
        "bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className,
      )}
      {...rest}
    />
  )
}

export function TypographyLead(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <p className={cn("text-xl text-muted-foreground", className)} {...rest} />
  )
}

export function TypographyLarge(props: TypographyProps) {
  const { className, ...rest } = props

  return <div className={cn("text-lg font-semibold", className)} {...rest} />
}

export function TypographySmall(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...rest}
    />
  )
}

export function TypographyMuted(props: TypographyProps) {
  const { className, ...rest } = props

  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...rest} />
  )
}
