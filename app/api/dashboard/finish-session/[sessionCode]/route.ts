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

    console.log("Finish Session API - session code:", sessionCode);

    if (!sessionCode) {
      return NextResponse.json(
        { success: false, message: "Session code is required" },
        { status: 400 }
      );
    }

    // Call the Azure backend endpoint from the server side
    const azureUrl = `${
      env.SESSION_VERIFICATION_URL
    }/Dashboard/FinishSession/${encodeURIComponent(sessionCode)}`;

    console.log("Calling Azure backend:", azureUrl);

    const response = await fetch(azureUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("Azure response status:", response.status, "data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          message: data.message || "Failed to finish session",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Finish session error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to finish session",
      },
      { status: 500 }
    );
  }
}
