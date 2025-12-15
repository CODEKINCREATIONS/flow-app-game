// Get game progress for a session
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

    console.log("[GameProgress API] session code:", sessionCode);
    console.log(
      "[GameProgress API] Backend URL base:",
      env.SESSION_VERIFICATION_URL
    );

    if (!sessionCode) {
      return NextResponse.json(
        { success: false, error: "Session code is required" },
        { status: 400 }
      );
    }

    // Call the Azure backend endpoint
    const backendUrl = `${
      env.SESSION_VERIFICATION_URL
    }/GameProgress/GetGameProgress/${encodeURIComponent(sessionCode)}`;

    console.log("[GameProgress API] Calling backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

    // Return the data directly - the API client will wrap it with success: true
    return NextResponse.json(data);
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
