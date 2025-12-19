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
 * POST - Record a player's box attempt OR unlock a box with password
 * Two modes:
 * 1. Record attempt (backward compatible): POST with { playerId, boxId }
 * 2. Unlock box: POST with { playerId, boxId, password }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerId, boxId, password } = body;

    console.log("[PlayerProgress POST] Request:", {
      playerId,
      boxId,
      hasPassword: !!password,
    });

    if (!playerId || !boxId) {
      return NextResponse.json(
        { error: "playerId and boxId are required" },
        { status: 400 }
      );
    }

    // If password is provided, do full unlock flow
    if (password) {
      console.log("[PlayerProgress POST] Unlock flow with password");

      // Step 1: Get the progressId by posting PlayerId and BoxId
      const getProgressUrl = `${env.SESSION_VERIFICATION_URL}/PlayerProgress/PlayerId/${playerId}/BoxId/${boxId}`;
      console.log(
        "[PlayerProgress POST] Getting progress from:",
        getProgressUrl
      );

      const getProgressResponse = await fetch(getProgressUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const getProgressData = await getProgressResponse.json();
      console.log(
        "[PlayerProgress POST] Get progress response:",
        getProgressData
      );

      // Extract progressId - handle both success and "Already Exist" responses
      let progressId = null;

      if (getProgressData.data) {
        progressId = getProgressData.data;
      } else if (
        getProgressData.message &&
        getProgressData.message.toLowerCase().includes("already exist")
      ) {
        // For "Already Exist", the data field contains the progressId
        progressId = getProgressData.data;
      }

      if (!progressId) {
        console.error(
          "[PlayerProgress POST] No progressId found in response:",
          getProgressData
        );
        return NextResponse.json(
          {
            message: getProgressData.message || "Failed to get progress record",
          },
          { status: 400 }
        );
      }

      console.log("[PlayerProgress POST] Got progressId:", progressId);

      // Step 2: Verify password by putting the password with progressId
      const verifyUrl = `${env.SESSION_VERIFICATION_URL}/PlayerProgress/${progressId}/PadlockPassword/${password}`;
      console.log("[PlayerProgress POST] Verifying password at:", verifyUrl);

      const verifyResponse = await fetch(verifyUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const verifyData = await verifyResponse.json();
      console.log("[PlayerProgress POST] Verify response:", verifyData);

      return NextResponse.json(verifyData, {
        status: verifyResponse.status,
      });
    }

    // Otherwise, just record the attempt (backward compatible)
    console.log("[PlayerProgress POST] Recording attempt (no password)");

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
 * PUT - REMOVED - No longer needed
 * Password verification is now handled in the POST endpoint
 */
