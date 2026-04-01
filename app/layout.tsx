import type { Metadata } from "next"
import { Figtree, Nunito } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/themeProvider"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-sans" })
export const metadata: Metadata = {
  title: "Pantry",
  description:
    "Pantry is a smart pantry management system that helps you manage your pantry, recipes and shopping list.",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
