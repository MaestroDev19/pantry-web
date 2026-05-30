import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export default function RecipeNotFound() {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-4 md:pt-10 lg:pt-20">
      <Empty className="max-w-lg">
        <EmptyHeader>
          <EmptyTitle>Recipe not found</EmptyTitle>
          <EmptyDescription>
            This recipe isn&apos;t in your catalog yet. Try a sample recipe, open
            today&apos;s Chef ACE pick from the dashboard, or generate one from
            your pantry.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/recipes">
              <ArrowLeftIcon data-icon="inline-start" />
              All recipes
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
