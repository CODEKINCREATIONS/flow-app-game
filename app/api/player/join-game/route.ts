// API proxy for join game
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

const AZURE_API_URL = env.SESSION_VERIFICATION_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Join game request body:", body);

    const response = await fetch(`${AZURE_API_URL}/Player/joinGame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log(`Join game response status: ${response.status}`);
    const responseText = await response.text();
    console.log("Join game response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText || {};
    }

    if (!response.ok) {
      console.error("Join game error response:", data);
      return NextResponse.json(
        {
          message:
            typeof data === "object" && data.message
              ? data.message
              : "Failed to join game",
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
    console.error("Join game proxy error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        errors: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
