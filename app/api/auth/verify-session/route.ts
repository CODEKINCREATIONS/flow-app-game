import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let sessionCode = searchParams.get("sessionCode");

    if (!sessionCode) {
      return NextResponse.json(
        { success: false, message: "Session code is required" },
        { status: 400 },
      );
    }

    // Decode the session code since it's already URL-encoded from the frontend
    sessionCode = decodeURIComponent(sessionCode);

    // Call the Azure endpoint from the server side (no CORS issues)
    const azureUrl = `${
      env.SESSION_VERIFICATION_URL
    }/Session/verifySessionCode?sessionCode=${encodeURIComponent(sessionCode)}`;

    // Generate Basic Auth header
    const credentials = `${env.API_AUTH_USERNAME}:${env.API_AUTH_PASSWORD}`;
    const encoded = Buffer.from(credentials).toString("base64");

    const response = await fetch(azureUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Invalid session code",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to verify session",
      },
      { status: 500 },
    );
  }
}
