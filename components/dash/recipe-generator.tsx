"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SparklesIcon, AlertCircleIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { generateRecipeWithAI } from "@/lib/server/rag-recipe"

type RecipeGeneratorProps = {
  accessToken: string | null
}

const SUGGESTIONS = [
  "Quick dinner with leftover chicken and veggies",
  "High-protein breakfast bowl with eggs",
  "Creamy vegetarian soup for a cold day",
  "Healthy low-carb dinner with fish",
]

const LOADING_STAGES = [
  "Consulting Chef ACE...",
  "Reviewing culinary combinations...",
  "Selecting optimized ingredients...",
  "Formulating step-by-step instructions...",
  "Plating the details...",
]

export function RecipeGenerator({ accessToken }: RecipeGeneratorProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Cycle loading messages to keep the user engaged
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (loading) {
      setStageIndex(0)
      interval = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % LOADING_STAGES.length)
      }, 3000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [loading])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    if (!accessToken) {
      setError("You must be signed in to generate recipes.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const recipe = await generateRecipeWithAI(accessToken, prompt.trim())
      // Redirect to the newly generated recipe page
      router.push(`/dashboard/recipes/${recipe.id}`)
    } catch (err) {
      setLoading(false)
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      )
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      <form
        onSubmit={handleGenerate}
        className="relative flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-card/40 border border-border/70 backdrop-blur-md shadow-lg"
      >
        <div className="relative flex-1">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="Tell Chef ACE what you want to cook today..."
            className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-foreground placeholder:text-muted-foreground/70 pl-4 text-base"
          />
        </div>
        
        <Button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="h-12 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 gap-2 shrink-0"
        >
          {loading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <SparklesIcon className="size-4 animate-pulse" />
          )}
          {loading ? "Generating..." : "Ask Chef ACE"}
        </Button>
      </form>

      {/* Suggested prompts row */}
      {!loading && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-muted-foreground/80 font-semibold uppercase tracking-wider mr-1">
            Suggestions:
          </span>
          {SUGGESTIONS.map((suggestion) => (
            <Badge
              key={suggestion}
              variant="secondary"
              onClick={() => setPrompt(suggestion)}
              className="cursor-pointer bg-muted/40 hover:bg-muted/90 text-muted-foreground hover:text-foreground transition-all text-xs font-medium py-1 px-3"
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      )}

      {/* Loading feedback overlay */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-6 gap-3 rounded-2xl bg-muted/20 border border-border/40 animate-pulse mt-1">
          <Loader2Icon className="size-6 text-primary animate-spin" />
          <span className="text-sm font-semibold text-foreground tracking-wide">
            {LOADING_STAGES[stageIndex]}
          </span>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircleIcon className="size-4 shrink-0" />
          <p className="flex-1">{error}</p>
        </div>
      )}
    </div>
  )
}
