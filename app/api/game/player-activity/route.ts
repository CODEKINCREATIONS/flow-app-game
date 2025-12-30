import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

/**
 * Proxy endpoint for fetching player activity from external API
 * GET /api/game/player-activity?sessionCode=XXX&playerId=1
 *
 * Proxies to:
 * {EXTERNAL_API_URL}/PlayerProgress/GetPlayerActivity/{sessionCode}/{playerId}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionCode = searchParams.get("sessionCode");
    const playerId = searchParams.get("playerId");

    if (!sessionCode || !playerId) {
      return NextResponse.json(
        { error: "Missing sessionCode or playerId" },
        { status: 400 }
      );
    }

    // Construct external API URL
    const externalApiUrl = `${env.SESSION_VERIFICATION_URL}/PlayerProgress/GetPlayerActivity/${sessionCode}/${playerId}`;

    console.log("[Player Activity API] Proxying request to:", externalApiUrl);

    // Generate Basic Auth header
    const credentials = `${env.API_AUTH_USERNAME}:${env.API_AUTH_PASSWORD}`;
    const encoded = Buffer.from(credentials).toString("base64");

    // Call external API
    const response = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
    });

    if (!response.ok) {
      console.error(
        `[Player Activity API] Error: ${response.status}`,
        await response.text()
      );
      return NextResponse.json(
        { error: `External API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[Player Activity API] Response:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[Player Activity API] Exception:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
