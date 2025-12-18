// Record player progress and verify passwords
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

/**
 * GET - Get player progress (deprecated, kept for backward compatibility)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionCode = searchParams.get("sessionCode");

    console.log("Player progress API - session code:", sessionCode);
    console.log("Backend URL base:", env.SESSION_VERIFICATION_URL);

    if (!sessionCode) {
      return NextResponse.json(
        { success: false, error: "Session code is required" },
        { status: 400 }
      );
    }

    // Call the Azure backend endpoint
    const backendUrl = `${
      env.SESSION_VERIFICATION_URL
    }/PlayerProgress?sessionCode=${encodeURIComponent(sessionCode)}`;

    console.log("Calling backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      data = { message: "Failed to parse backend response" };
    }

    console.log("Backend response status:", response.status);
    console.log("Backend response data:", data);

    if (!response.ok) {
      console.error("Backend returned non-200 status:", response.status, data);
      return NextResponse.json(
        {
          success: false,
          error: data.message || `Backend error: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: Array.isArray(data) ? data : data.data || [],
    });
  } catch (error) {
    console.error("Player progress API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Record a player's box attempt
 * Endpoint: POST /api/game/player-progress
 * Body: { playerId, boxId }
 * Proxies to: POST /PlayerProgress/PlayerId/{playerId}/BoxId/{boxId}
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, boxId } = body;

    console.log("[PlayerProgress POST] Recording attempt:", {
      playerId,
      boxId,
    });

    if (!playerId || !boxId) {
      return NextResponse.json(
        { error: "playerId and boxId are required" },
        { status: 400 }
      );
    }

    // Call external API
    const externalApiUrl = `${env.SESSION_VERIFICATION_URL}/PlayerProgress/PlayerId/${playerId}/BoxId/${boxId}`;

    console.log("[PlayerProgress POST] Calling:", externalApiUrl);

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("[PlayerProgress POST] Response:", data);

    if (!response.ok) {
      // "Already Exist" is not really an error - it means the record is already there
      const errorMessage = data.message || response.statusText;
      if (errorMessage.toLowerCase().includes("already exist")) {
        console.log(
          "[PlayerProgress POST] Record already exists (expected on retry)"
        );
        // Return success since the record is already created
        return NextResponse.json({
          message: "Record already exists",
          data: data.data,
        });
      }

      console.error(`[PlayerProgress POST] Error: ${response.status}`, data);
      return NextResponse.json(
        {
          error: `Failed to record attempt: ${errorMessage}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[PlayerProgress POST] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Verify/update password for a box
 * Endpoint: PUT /api/game/player-progress/verify
 * Body: { playerId, padlockPassword }
 * Proxies to: PUT /PlayerProgress/{playerId}/PadlockPassword/{padlockPassword}
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, padlockPassword } = body;

    console.log("[PlayerProgress PUT] Verifying password:", { playerId });

    if (!playerId || !padlockPassword) {
      return NextResponse.json(
        { error: "playerId and padlockPassword are required" },
        { status: 400 }
      );
    }

    // Call external API
    const externalApiUrl = `${
      env.SESSION_VERIFICATION_URL
    }/PlayerProgress/${playerId}/PadlockPassword/${encodeURIComponent(
      padlockPassword
    )}`;

    console.log("[PlayerProgress PUT] Calling:", externalApiUrl);
    console.log("[PlayerProgress PUT] Payload:", { playerId, padlockPassword });

    const response = await fetch(externalApiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // Send empty body as password is in URL
    });

    const data = await response.json();
    console.log("[PlayerProgress PUT] Response:", data);

    if (!response.ok) {
      console.error(`[PlayerProgress PUT] Error: ${response.status}`, data);
      return NextResponse.json(
        {
          error: `Failed to verify password: ${
            data.message || response.statusText
          }`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[PlayerProgress PUT] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
