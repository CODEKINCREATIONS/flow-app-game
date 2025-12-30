// Get game progress for a player in a session
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ sessionCode: string }> | { sessionCode: string } }
) {
  try {
    // Await params if it's a promise
    const resolvedParams = await Promise.resolve(params);
    const sessionCode = resolvedParams.sessionCode;

    // Get playerId from query params
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get("playerId");

    console.log(
      "[GameProgress API] session code:",
      sessionCode,
      "playerId:",
      playerId
    );
    console.log(
      "[GameProgress API] Backend URL base:",
      env.SESSION_VERIFICATION_URL
    );

    if (!sessionCode || !playerId) {
      return NextResponse.json(
        { success: false, error: "Session code and playerId are required" },
        { status: 400 }
      );
    }

    // Call the new Azure backend endpoint: /GameProgress/SessionCode/{sessionCode}/PlayerId/{playerId}
    const backendUrl = `${
      env.SESSION_VERIFICATION_URL
    }/GameProgress/SessionCode/${encodeURIComponent(
      sessionCode
    )}/PlayerId/${encodeURIComponent(playerId)}`;

    console.log("[GameProgress API] Calling backend URL:", backendUrl);

    // Generate Basic Auth header
    const credentials = `${env.API_AUTH_USERNAME}:${env.API_AUTH_PASSWORD}`;
    const encoded = Buffer.from(credentials).toString("base64");

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
    });

    console.log("[GameProgress API] Backend response status:", response.status);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("[GameProgress API] Failed to parse response as JSON:", e);
      data = { message: "Failed to parse backend response" };
    }

    console.log("[GameProgress API] Backend response data:", data);

    if (!response.ok) {
      console.error(
        "[GameProgress API] Backend returned non-200 status:",
        response.status,
        data
      );
      return NextResponse.json(
        {
          message: data.message || `Backend error: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    // Extract the nested data structure from backend response
    // Backend returns: { message, data: { gameSession, gameProgress } }
    // We return just the inner data so apiClient wraps it correctly
    const innerData = data.data || data;

    return NextResponse.json(innerData);
  } catch (error) {
    console.error("[GameProgress API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
