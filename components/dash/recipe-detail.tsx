"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAtom } from "jotai"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  ChefHatIcon,
  ClockIcon,
  SparklesIcon,
  UtensilsIcon,
  HeartIcon,
  Share2Icon,
  UsersIcon,
  FlameIcon,
  BookOpenIcon,
  TimerIcon,
  PlayIcon,
  PauseIcon,
  XIcon,
  LightbulbIcon,
  ShoppingCartIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { shoppingItemsAtom } from "@/lib/state/shopping-list"
import { uuid } from "@/lib/utils/uuid"
import type { CategoryEnum } from "@/lib/types/pantrytypes"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TypographyH2, TypographyP } from "@/components/ui/typography"
import type { RecipeDetailView } from "@/lib/types/recipetypes"
import {
  formatCategoryLabel,
  sourceBadgeLabel,
} from "@/lib/utils/recipe-detail"
import { cn } from "@/lib/utils"

type RecipeDetailProps = {
  recipe: RecipeDetailView
}

// Helper to parse instruction steps into a short bold title and details
function parseInstructionStep(step: string) {
  let cleanedStep = step.trim()
  
  // Strip redundant prefix like "Step 1.", "step 1:", "Step 1 -", "step 1", etc.
  const stepPrefixRegex = /^step\s*\d+\s*(?:\.|\:|\-)?\s*/i
  const prefixMatch = cleanedStep.match(stepPrefixRegex)
  if (prefixMatch) {
    cleanedStep = cleanedStep.slice(prefixMatch[0].length).trim()
  }

  const match = cleanedStep.match(/\.\s+/)
  if (!match || match.index === undefined) {
    return { title: cleanedStep, body: "" }
  }
  const title = cleanedStep.slice(0, match.index + 1).trim()
  const body = cleanedStep.slice(match.index + match[0].length).trim()
  return { title, body }
}

// Helper to extract timer duration from step instruction text (in minutes)
function findTimerDuration(stepText: string): number | null {
  const rangeRegex = /(\d+)\s*(?:-|–|to)\s*(\d+)\s*(?:minutes|minute|min)/i
  const singleRegex = /(\d+)\s*(?:minutes|minute|min)/i

  const rangeMatch = stepText.match(rangeRegex)
  if (rangeMatch) {
    return parseInt(rangeMatch[2], 10)
  }

  const singleMatch = stepText.match(singleRegex)
  if (singleMatch) {
    return parseInt(singleMatch[1], 10)
  }

  return null
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const tags = recipe.tags ?? []

  // Filter and clean instructions list to remove empty placeholder step labels
  const cleanedSteps = recipe.instructions
    .map((step) => {
      let cleaned = step.trim()
      // Strip leading checkboxes, bullets, and symbols
      cleaned = cleaned.replace(/^[▢☐☑☒•\-\*\+\s\u2022]+/u, "").trim()
      cleaned = cleaned.replace(/^\[[\sXx]?\]\s*/, "").trim()
      const prefixMatch = cleaned.match(/^step\s*\d+\s*(?:\.|\:|\-)?\s*/i)
      if (prefixMatch) {
        cleaned = cleaned.slice(prefixMatch[0].length).trim()
      }
      return { original: step, cleaned }
    })
    .filter((item) => item.cleaned.length > 0 && /[\p{L}\p{N}]/u.test(item.cleaned))

  // Checklist state for ingredients
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set())

  const [, setShoppingItems] = useAtom(shoppingItemsAtom)

  const addMissingToShoppingList = () => {
    const missing = recipe.ingredients.filter((ing) => !checkedIngredients.has(ing))
    if (missing.length === 0) {
      toast.info("All ingredients are already checked!")
      return
    }

    const newItems = missing.map((ing) => ({
      id: uuid(),
      name: ing,
      category: (recipe.category as CategoryEnum) || "Other",
      quantity: 1,
      bought: false,
    }))

    setShoppingItems((prev) => [...prev, ...newItems])
    toast.success(`Added ${missing.length} ingredient${missing.length === 1 ? "" : "s"} to your shopping list!`)
  }

  // Floating timer state
  const [timerDuration, setTimerDuration] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [timerPaused, setTimerPaused] = useState<boolean>(false)

  // Deterministic metadata estimates based on recipe content
  const prepTime = (recipe.ingredients.length * 2) + 5
  const cookTime = (cleanedSteps.length * 3) + 10
  const servings = recipe.ingredients.length % 2 === 0 ? 2 : 4
  const energy = (recipe.ingredients.length * 55) + 180

  const toggleIngredient = (ingredient: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev)
      if (next.has(ingredient)) {
        next.delete(ingredient)
      } else {
        next.add(ingredient)
      }
      return next
    })
  }

  const startTimer = (seconds: number) => {
    setTimerDuration(seconds)
    setTimeLeft(seconds)
    setTimerActive(true)
    setTimerPaused(false)
  }

  const stopTimer = () => {
    setTimerActive(false)
    setTimeLeft(0)
    setTimerDuration(0)
  }

  const toggleTimerPause = () => {
    setTimerPaused((prev) => !prev)
  }

  // Effect to drive the countdown timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerActive && !timerPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timerPaused, timeLeft])

  const hasSplitIngredients =
    (recipe.pantry_ingredients && recipe.pantry_ingredients.length > 0) ||
    (recipe.additional_ingredients && recipe.additional_ingredients.length > 0)

  return (
    <div className="flex flex-1 flex-col gap-6 pt-4 md:pt-8 relative">
      {/* Back to recipes navigation row */}
      <div className="flex flex-col gap-3">
        <Button variant="ghost" size="sm" className="w-fit px-0 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/dashboard/recipes">
            <ArrowLeftIcon className="mr-2 size-4" />
            Back to recipes
          </Link>
        </Button>
      </div>

      {/* Main layout: responsive dual-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-2">
        
        {/* Left Column: Ingredients Checklist (Sticky on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-20">
          <Card className="shadow-md border-border overflow-hidden bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row justify-between items-center bg-muted/20 border-b border-border/50 py-4 px-6">
              <CardTitle className="text-xl flex items-center gap-2 font-bold text-foreground">
                <UtensilsIcon className="size-5 text-primary" />
                Ingredients
              </CardTitle>
              <Badge variant="secondary" className="font-semibold text-xs py-0.5">
                {recipe.ingredients.length} items
              </Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-0.5">
              {hasSplitIngredients ? (
                <div className="flex flex-col gap-4">
                  {/* Pantry items — what they already have */}
                  {recipe.pantry_ingredients && recipe.pantry_ingredients.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        ✓ In your pantry
                      </p>
                      {recipe.pantry_ingredients.map((ing) => (
                        <div key={ing} className="flex items-center gap-3 p-1">
                          <Checkbox
                            id={ing}
                            checked={checkedIngredients.has(ing)}
                            onCheckedChange={() => toggleIngredient(ing)}
                            className="border-emerald-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                          />
                          <label
                            htmlFor={ing}
                            className={cn(
                              "text-sm cursor-pointer select-none",
                              checkedIngredients.has(ing) && "line-through text-muted-foreground"
                            )}
                          >
                            {ing}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Additional items — needs shopping */}
                  {recipe.additional_ingredients && recipe.additional_ingredients.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        ⚠ You&apos;ll need to buy
                      </p>
                      {recipe.additional_ingredients.map((ing) => (
                        <div key={ing} className="flex items-center gap-3 p-1">
                          <Checkbox
                            id={ing}
                            checked={checkedIngredients.has(ing)}
                            onCheckedChange={() => toggleIngredient(ing)}
                            className="border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                          />
                          <label
                            htmlFor={ing}
                            className={cn(
                              "text-sm cursor-pointer select-none text-amber-700 dark:text-amber-300",
                              checkedIngredients.has(ing) && "line-through text-muted-foreground"
                            )}
                          >
                            {ing}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Coverage note — when pantry doesn't match the request */}
                  {recipe.pantry_coverage_note && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                      <LightbulbIcon className="size-3.5 mt-0.5 shrink-0" />
                      {recipe.pantry_coverage_note}
                    </div>
                  )}
                </div>
              ) : (
                recipe.ingredients.map((ingredient) => {
                  const isChecked = checkedIngredients.has(ingredient)
                  return (
                    <label
                      key={ingredient}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleIngredient(ingredient)}
                        className="mt-1"
                      />
                      <span
                        className={cn(
                          "flex-1 text-sm font-medium transition-colors text-foreground",
                          isChecked && "line-through text-muted-foreground/60"
                        )}
                      >
                        {ingredient}
                      </span>
                    </label>
                  )
                })
              )}

              <div className="pt-4 px-3">
                <Button
                  onClick={addMissingToShoppingList}
                  className="w-full gap-2 rounded-xl"
                  variant="secondary"
                >
                  <ShoppingCartIcon data-icon="inline-start" />
                  Add missing to Shopping List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recipe Details & Instructions */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Header section with metadata */}
          <div className="flex flex-col gap-6 pb-6 border-b border-border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3 flex-1 min-w-0">
                {/* Category & Tags Badge Row */}
                {recipe.category && (
                  <div className="flex flex-wrap items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {formatCategoryLabel(recipe.category)}
                    {tags.length > 0 && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/45" />
                        <span className="text-muted-foreground font-semibold">{tags[0]}</span>
                      </>
                    )}
                  </div>
                )}
                
                <TypographyH2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-none border-none p-0">
                  {recipe.title}
                </TypographyH2>

                {recipe.subtitle && (
                  <TypographyP className="text-lg text-muted-foreground/90 font-medium leading-normal">
                    {recipe.subtitle}
                  </TypographyP>
                )}

                {recipe.description && (
                  <TypographyP className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
                    {recipe.description}
                  </TypographyP>
                )}
              </div>

              {/* Action buttons (Favorites, Share) */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="icon" className="h-10 w-10 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all" title="Save to Favorites">
                  <HeartIcon className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all" title="Share Recipe">
                  <Share2Icon className="size-4" />
                </Button>
              </div>
            </div>

            {/* Tags Row */}
            {tags.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(1).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs font-normal capitalize py-0.5 px-2.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Dynamic Metric Metadata Badges */}
            <div className="flex flex-wrap gap-3 mt-2">
              <div className="flex items-center gap-2.5 bg-muted/40 border border-border/70 px-4 py-2.5 rounded-xl">
                <ClockIcon className="size-4 text-amber-500" />
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wide">Prep Time</span>
                  <span className="text-sm font-bold text-foreground">{prepTime} min</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 bg-muted/40 border border-border/70 px-4 py-2.5 rounded-xl">
                <ChefHatIcon className="size-4 text-orange-500" />
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wide">Cook Time</span>
                  <span className="text-sm font-bold text-foreground">{cookTime} min</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-muted/40 border border-border/70 px-4 py-2.5 rounded-xl">
                <UsersIcon className="size-4 text-sky-500" />
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wide">Servings</span>
                  <span className="text-sm font-bold text-foreground">{servings} ppl</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-muted/40 border border-border/70 px-4 py-2.5 rounded-xl">
                <FlameIcon className="size-4 text-emerald-500" />
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wide">Energy</span>
                  <span className="text-sm font-bold text-foreground">{energy} kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cooking Instructions Card list */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground tracking-tight">
              <BookOpenIcon className="size-5 text-primary" />
              Instructions
            </h3>
            
            <div className="flex flex-col">
              {cleanedSteps.map((stepItem, index) => {
                const { title, body } = parseInstructionStep(stepItem.cleaned)
                const duration = findTimerDuration(stepItem.original)

                return (
                  <div key={index} className="flex gap-4 md:gap-6 group relative">
                    {/* Visual Timeline connector */}
                    <div className="flex-none flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-muted border border-border text-foreground font-bold flex items-center justify-center shadow-sm z-10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        {index + 1}
                      </div>
                      {index < cleanedSteps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border/60 -my-2" />
                      )}
                    </div>
                    
                    {/* Step details content */}
                    <div className="flex-1 pb-8 group-last:pb-2 pt-1.5">
                      <h4 className="text-lg font-bold text-foreground leading-snug">
                        {title}
                      </h4>
                      {body && (
                        <p className="text-muted-foreground mt-2 leading-relaxed text-sm">
                          {body}
                        </p>
                      )}
                      
                      {/* Interactive inline timer triggers */}
                      {duration && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startTimer(duration * 60)}
                          className="mt-3 gap-1.5 h-8 text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                        >
                          <TimerIcon className="size-3.5" />
                          Start {duration}m Timer
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AI Generation Context Panel */}
          {recipe.retrieved_context && recipe.retrieved_context.length > 0 ? (
            <Card className="border-dashed border-border bg-muted/10">
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-1.5">
                  <SparklesIcon className="size-4 text-primary" />
                  Pantry context used
                </CardTitle>
                <CardDescription className="text-xs">
                  Snippets Chef ACE used when generating this recipe
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-5">
                <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {recipe.retrieved_context.map((snippet) => (
                    <li key={snippet} className="border-l-2 border-primary/30 pl-3 italic text-xs">
                      {snippet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}

        </div>
      </div>

      {/* Floating Active Timer Widget */}
      {timerActive && timeLeft > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-card/95 border border-border shadow-2xl rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-300 backdrop-blur-sm max-w-sm w-full sm:w-auto">
          <div className="relative size-12 shrink-0">
            <svg className="size-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-muted fill-none stroke-[3.5]"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-primary fill-none stroke-[3.5] transition-all duration-1000"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * timeLeft) / timerDuration}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <TimerIcon className="size-5 text-primary animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cooking Timer</span>
            <span className="text-xl font-extrabold tabular-nums text-foreground">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 hover:bg-muted/70"
              onClick={toggleTimerPause}
            >
              {timerPaused ? <PlayIcon className="size-4" /> : <PauseIcon className="size-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:bg-destructive/10"
              onClick={stopTimer}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
