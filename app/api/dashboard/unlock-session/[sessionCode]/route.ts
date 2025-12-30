import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ sessionCode: string }> | { sessionCode: string } }
) {
  try {
    // Await params if it's a promise (Next.js 15+)
    const resolvedParams = await Promise.resolve(params);
    const sessionCode = resolvedParams.sessionCode;

    console.log("Unlock Session API - session code:", sessionCode);

    if (!sessionCode) {
      return NextResponse.json(
        { success: false, message: "Session code is required" },
        { status: 400 }
      );
    }

    // Call the Azure backend endpoint from the server side
    const azureUrl = `${
      env.SESSION_VERIFICATION_URL
    }/Dashboard/UnlockSession/${encodeURIComponent(sessionCode)}`;

    console.log("Calling Azure backend:", azureUrl);

    // Generate Basic Auth header
    const credentials = `${env.API_AUTH_USERNAME}:${env.API_AUTH_PASSWORD}`;
    const encoded = Buffer.from(credentials).toString("base64");

    const response = await fetch(azureUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encoded}`,
      },
    });

    console.log("Azure response status:", response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP ${response.status}` };
      }
      console.error("Azure backend error:", response.status, errorData);
      return NextResponse.json(
        {
          message:
            errorData.message ||
            `Failed to unlock session (${response.status})`,
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      data = { message: "Session unlocked successfully" };
    }

    console.log("Azure response data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unlock session error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to unlock session",
      },
      { status: 500 }
    );
  }
}
