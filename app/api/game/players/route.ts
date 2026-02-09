// Get all players for a session
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionCode = searchParams.get("sessionCode");

    if (!sessionCode) {
      return NextResponse.json(
        { success: false, error: "Session code is required" },
        { status: 400 }
      );
    }

    // Call the Azure backend endpoint
    const backendUrl = `${
      env.SESSION_VERIFICATION_URL
    }/Game/players?sessionCode=${encodeURIComponent(sessionCode)}`;

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

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      data = { message: "Failed to parse backend response" };
    }

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
    console.error("Players API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
