import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecipesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-4 md:pt-10 lg:pt-20">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Recipes</CardTitle>
          <CardDescription>
            Recipe suggestions from your pantry are not available yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This area will connect to Chef ACE and your inventory when the backend
          integration is ready.
        </CardContent>
        <CardFooter>
          <Button asChild variant="secondary">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
