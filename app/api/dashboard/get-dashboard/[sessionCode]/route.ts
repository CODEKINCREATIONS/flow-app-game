// Get dashboard data for a session
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

    if (!sessionCode) {
      return NextResponse.json(
        { success: false, error: "Session code is required" },
        { status: 400 }
      );
    }

    // Call the Azure backend endpoint
    // Try with path parameter first
    let backendUrl = `${
      env.SESSION_VERIFICATION_URL
    }/Dashboard/GetDashboard/${encodeURIComponent(sessionCode)}`;

    let response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // If first attempt fails with 400, try with query parameter
    if (response.status === 400) {
      backendUrl = `${
        env.SESSION_VERIFICATION_URL
      }/Dashboard/GetDashboard?sessionCode=${encodeURIComponent(sessionCode)}`;

      response = await fetch(backendUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = { message: "Failed to parse backend response" };
    }

    if (!response.ok) {
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
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
