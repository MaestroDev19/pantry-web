import { cn } from "@/lib/utils";
import * as React from "react";

export function TypographyH1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20  text-4xl font-extrabold tracking-tight text-balance",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      )}
    >
      {children}
    </h4>
  );
}

export function TypographyP({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("leading-7 ", className)}>{children}</p>;
}

export function TypographyBlockquote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  );
}

export function TypographyTable() {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left align-middle font-medium text-muted-foreground">
              King&apos;s Treasury
            </th>
            <th className="px-4 py-2 text-left align-middle font-medium text-muted-foreground">
              People&apos;s happiness
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-2 align-middle">Empty</td>
            <td className="px-4 py-2 align-middle">Overflowing</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-2 align-middle">Modest</td>
            <td className="px-4 py-2 align-middle">Satisfied</td>
          </tr>
          <tr>
            <td className="px-4 py-2 align-middle">Full</td>
            <td className="px-4 py-2 align-middle">Ecstatic</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TypographyList() {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners: 20 gold coins</li>
    </ul>
  );
}

export function TypographyInlineCode() {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      @radix-ui/react-alert-dialog
    </code>
  );
}

export function TypographyLead() {
  return (
    <p className="text-xl text-muted-foreground">
      A modal dialog that interrupts the user with important content and expects
      a response.
    </p>
  );
}

export function TypographyLarge() {
  return <div className="text-lg font-semibold">Are you absolutely sure?</div>;
}

export function TypographySmall() {
  return (
    <small className="text-sm leading-none font-medium">Email address</small>
  );
}

export function TypographyMuted() {
  return (
    <p className="text-sm text-muted-foreground">Enter your email address.</p>
  );
}
