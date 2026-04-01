"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypographyP } from "@/components/ui/typography";
import { createClient } from "@/lib/supabase/client";
import { getApiBaseUrl } from "@/lib/utils/config";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function getAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session?.access_token ?? null;
}

async function callApi(opts: {
  baseUrl: string;
  path: string;
  method: HttpMethod;
  bodyText: string;
  includeAuth: boolean;
}): Promise<{
  ok: boolean;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
}> {
  const base = normalizeBaseUrl(opts.baseUrl);
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const url = `${base}${path}`;

  const headers: Record<string, string> = {};

  let body: string | undefined;
  const hasBody = opts.method !== "GET" && opts.method !== "DELETE";
  if (hasBody && opts.bodyText.trim()) {
    body = opts.bodyText;
    headers["Content-Type"] = "application/json";
  }

  if (opts.includeAuth) {
    const token = await getAccessToken();
    if (!token) {
      throw new Error("No Supabase session token found. Sign in first.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { method: opts.method, headers, body });
  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;
  const headerObj: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    headerObj[key] = value;
  });

  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    headers: headerObj,
    data,
  };
}

export default function ApiTestClient() {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [baseUrl, setBaseUrl] = useState(apiBaseUrl);
  const [path, setPath] = useState("/health");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [includeAuth, setIncludeAuth] = useState(true);
  const [bodyText, setBodyText] = useState<string>(
    JSON.stringify({ name: "Personal Household", is_personal: true }, null, 2),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string>("");

  const run = useCallback(async () => {
    if (!baseUrl.trim()) {
      toast.error("Missing API base URL (NEXT_PUBLIC_API_URL).");
      return;
    }

    setIsLoading(true);
    setResultText("");
    try {
      const res = await callApi({
        baseUrl: baseUrl.trim(),
        path: path.trim(),
        method,
        bodyText,
        includeAuth,
      });

      setResultText(JSON.stringify(res, null, 2));
      if (res.ok) toast.success(`${res.status} ${res.statusText}`);
      else toast.error(`${res.status} ${res.statusText}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed.";
      setResultText(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, path, method, bodyText, includeAuth]);

  return (
    <div className="grid gap-4">
      <Card className="p-4 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="baseUrl">API base URL</Label>
          <Input
            id="baseUrl"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://127.0.0.1:8000"
          />
          <TypographyP className="text-muted-foreground text-sm">
            Uses <code>NEXT_PUBLIC_API_URL</code> (or{" "}
            <code>NEXT_PUBLIC_PANTRY_API_URL</code>).
          </TypographyP>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="path">Path</Label>
            <Input
              id="path"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/health"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="method">Method</Label>
            <select
              id="method"
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="includeAuth"
            type="checkbox"
            checked={includeAuth}
            onChange={(e) => setIncludeAuth(e.target.checked)}
            className="h-4 w-4"
          />
          <Label htmlFor="includeAuth">Include Supabase bearer token</Label>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="body">JSON body (ignored for GET/DELETE)</Label>
          <Textarea
            id="body"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={8}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={run} disabled={isLoading}>
            {isLoading ? "Calling..." : "Call API"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setPath("/health");
              setMethod("GET");
              setIncludeAuth(false);
            }}
            disabled={isLoading}
          >
            Quick: GET /health
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setPath("/households/create");
              setMethod("POST");
              setIncludeAuth(true);
              setBodyText(
                JSON.stringify(
                  { name: "Personal Household", is_personal: true },
                  null,
                  2,
                ),
              );
            }}
            disabled={isLoading}
          >
            Quick: POST /households/create
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setPath("/api/pantry-items/get-household-pantry");
              setMethod("GET");
              setIncludeAuth(true);
            }}
            disabled={isLoading}
          >
            Quick: GET /api/pantry-items/get-household-pantry
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setPath("/api/pantry-items/add-single-item");
              setMethod("POST");
              setIncludeAuth(true);
              setBodyText(
                JSON.stringify(
                  {
                    name: "Test Worker Item",
                    quantity: 1,
                    unit: "piece",
                    category: "other",
                  },
                  null,
                  2,
                ),
              );
            }}
            disabled={isLoading}
          >
            Quick: POST /api/pantry-items/add-single-item
          </Button>
        </div>
      </Card>

      <Card className="p-4 grid gap-2">
        <Label htmlFor="result">Result</Label>
        <Textarea
          id="result"
          readOnly
          value={resultText}
          rows={14}
          className="font-mono text-xs"
          placeholder="Response will appear here…"
        />
      </Card>
    </div>
  );
}

