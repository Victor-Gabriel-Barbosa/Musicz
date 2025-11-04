import { type NextRequest, NextResponse } from "next/server"

const DEEZER_API_BASE = "https://api.deezer.com"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")

  if (!endpoint) return NextResponse.json({ error: "Endpoint is required" }, { status: 400 })

  try {
    const url = `${DEEZER_API_BASE}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Deezer API error response:", errorText)
      throw new Error(`Deezer API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Deezer API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: "Failed to fetch from Deezer API", details: errorMessage }, { status: 500 })
  }
}