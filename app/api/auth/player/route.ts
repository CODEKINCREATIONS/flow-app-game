// API proxy for player authentication
import { NextRequest, NextResponse } from "next/server";

const AZURE_API_URL =
  process.env.NEXT_PUBLIC_SESSION_VERIFICATION_URL ||
  "https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Player auth request body:", JSON.stringify(body, null, 2));

    // Try the /Player/login endpoint
    const playerLoginUrl = `${AZURE_API_URL}/Player/login`;
    console.log(`Attempting to call: ${playerLoginUrl}`);

    const response = await fetch(playerLoginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log(`Player auth response status: ${response.status}`);
    const responseText = await response.text();
    console.log("Player auth response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText || {};
    }

    if (!response.ok) {
      console.error("Player auth error response:", data);
      return NextResponse.json(
        {
          message:
            typeof data === "object" && data.message
              ? data.message
              : "Authentication failed",
          errors:
            typeof data === "object" && data.errors
              ? data.errors
              : responseText,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Player auth proxy error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        errors: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
