import { createHash } from "node:crypto"

import { LRUCache } from "lru-cache"
import { NextRequest, NextResponse } from "next/server"

import { getPantryUpstreamOrigin } from "@/lib/server/pantry-upstream"

const readCache = new LRUCache<string, { status: number; body: string }>({
  max: 500,
  ttl: 45_000,
  ttlAutopurge: true,
})

function authFingerprint(auth: string | null): string {
  if (!auth) return "anon"
  return createHash("sha256").update(auth, "utf8").digest("hex").slice(0, 32)
}

function invalidateReadsForAuth(auth: string | null): void {
  const prefix = `${authFingerprint(auth)}:`
  for (const key of readCache.keys()) {
    if (key.startsWith(prefix)) readCache.delete(key)
  }
}

async function proxy(
  request: NextRequest,
  slugParts: string[],
): Promise<NextResponse> {
  const upstream = getPantryUpstreamOrigin()
  const pathSuffix = slugParts.filter(Boolean).join("/")
  const targetPath = pathSuffix
    ? `/api/pantry-items/${pathSuffix}`
    : "/api/pantry-items"
  const search = request.nextUrl.search
  const url = `${upstream}${targetPath}${search}`

  const auth = request.headers.get("authorization")
  const method = request.method.toUpperCase()

  const cacheKey =
    method === "GET"
      ? `${authFingerprint(auth)}:GET:${targetPath}${search}`
      : null

  if (cacheKey) {
    const hit = readCache.get(cacheKey)
    if (hit) {
      return new NextResponse(hit.body, {
        status: hit.status,
        headers: {
          "content-type": "application/json",
          "x-pantry-bff-cache": "HIT",
        },
      })
    }
  }

  const forwardHeaders = new Headers()
  if (auth) forwardHeaders.set("authorization", auth)
  const incomingCt = request.headers.get("content-type")
  if (incomingCt) forwardHeaders.set("content-type", incomingCt)

  let body: ArrayBuffer | undefined
  if (!["GET", "HEAD"].includes(method)) {
    body = await request.arrayBuffer()
  }

  const upstreamRes = await fetch(url, {
    method,
    headers: forwardHeaders,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
  })

  const buf = await upstreamRes.arrayBuffer()
  const text = new TextDecoder().decode(buf)

  if (cacheKey && upstreamRes.ok) {
    readCache.set(cacheKey, { status: upstreamRes.status, body: text })
  } else if (!["GET", "HEAD"].includes(method) && upstreamRes.ok) {
    invalidateReadsForAuth(auth)
  }

  const contentType =
    upstreamRes.headers.get("content-type") ?? "application/json"

  return new NextResponse(text, {
    status: upstreamRes.status,
    headers: {
      "content-type": contentType,
      ...(cacheKey ? { "x-pantry-bff-cache": "MISS" } : {}),
    },
  })
}

type RouteCtx = { params: Promise<{ slug?: string[] }> }

export async function GET(request: NextRequest, ctx: RouteCtx) {
  const { slug } = await ctx.params
  return proxy(request, slug ?? [])
}

export async function POST(request: NextRequest, ctx: RouteCtx) {
  const { slug } = await ctx.params
  return proxy(request, slug ?? [])
}

export async function PATCH(request: NextRequest, ctx: RouteCtx) {
  const { slug } = await ctx.params
  return proxy(request, slug ?? [])
}

export async function DELETE(request: NextRequest, ctx: RouteCtx) {
  const { slug } = await ctx.params
  return proxy(request, slug ?? [])
}
