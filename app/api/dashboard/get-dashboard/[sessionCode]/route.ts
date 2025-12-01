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

    console.log("Dashboard API - session code:", sessionCode);
    console.log("Backend URL base:", env.SESSION_VERIFICATION_URL);

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

    console.log("Calling backend URL (method 1 - path param):", backendUrl);

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

      console.log("Trying method 2 - query param:", backendUrl);

      response = await fetch(backendUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log("Backend response status:", response.status);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      data = { message: "Failed to parse backend response" };
    }

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
      data: data,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
