import { TypographyH2, TypographyP } from "@/components/ui/typography";
import ApiTestClient from "@/components/api/api-test-client";

export default function ApiTestPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 py-6">
      <div className="space-y-1">
        <TypographyH2>API Test</TypographyH2>
        <TypographyP className="text-muted-foreground">
          Calls the FastAPI backend using your current Supabase session token.
        </TypographyP>
      </div>
      <ApiTestClient />
    </div>
  );
}

