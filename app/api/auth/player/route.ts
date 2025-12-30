// API proxy for player authentication
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

const AZURE_API_URL = env.SESSION_VERIFICATION_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try the /Player/login endpoint
    const playerLoginUrl = `${AZURE_API_URL}/Player/login`;

    // Generate Basic Auth header
    const credentials = `${env.API_AUTH_USERNAME}:${env.API_AUTH_PASSWORD}`;
    const encoded = Buffer.from(credentials).toString("base64");

    const response = await fetch(playerLoginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText || {};
    }

    if (!response.ok) {
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
    return NextResponse.json(
      {
        message: "Internal server error",
        errors: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
