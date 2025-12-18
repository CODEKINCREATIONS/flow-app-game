// Unlock a chest with code verification
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/app/lib/config/env";
import crypto from "crypto";

interface GameBox {
  boxID: number;
  status: number;
  padLockPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionCode, boxID, password, playerId } = body;

    console.log("[Unlock API] Request:", {
      sessionCode,
      boxID,
      playerId,
      passwordLength: password?.length,
    });

    if (!sessionCode || !boxID || !password) {
      return NextResponse.json(
        { message: "sessionCode, boxID, and password are required" },
        { status: 400 }
      );
    }

    // Get the game progress to find the stored password hash
    // Use new endpoint: /GameProgress/SessionCode/{sessionCode}/PlayerId/{playerId}
    const gameProgressUrl = `${
      env.SESSION_VERIFICATION_URL
    }/GameProgress/SessionCode/${sessionCode}/PlayerId/${playerId || 1}`;

    console.log("[Unlock API] Fetching game progress from:", gameProgressUrl);

    const gameProgressResponse = await fetch(gameProgressUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!gameProgressResponse.ok) {
      console.error(
        "[Unlock API] Failed to fetch game progress:",
        gameProgressResponse.status
      );
      return NextResponse.json(
        { message: "Failed to fetch game progress" },
        { status: 500 }
      );
    }

    const gameData = await gameProgressResponse.json();
    console.log(
      "[Unlock API] Game progress fetched, total boxes:",
      gameData.gameProgress?.length
    );

    // Handle nested data structure from backend
    let gameProgressArray = gameData.gameProgress;
    if (!gameProgressArray && gameData.data && gameData.data.gameProgress) {
      gameProgressArray = gameData.data.gameProgress;
    }

    // Find the matching box
    const targetBox = gameProgressArray.find(
      (box: GameBox) => box.boxID === boxID
    );

    if (!targetBox) {
      console.warn("[Unlock API] Box not found:", boxID);
      return NextResponse.json({ message: "Box not found" }, { status: 404 });
    }

    console.log("[Unlock API] Box found, status:", targetBox.status);

    if (targetBox.status === 1) {
      console.log("[Unlock API] Box already unlocked");
      return NextResponse.json(
        { message: "Box already unlocked", success: true },
        { status: 200 }
      );
    }

    // Hash the provided password using SHA256
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    console.log("[Unlock API] Password hash comparison:");
    console.log("  Provided (hashed):", hashedPassword);
    console.log("  Stored (from API):", targetBox.padLockPassword);

    // Compare the hashes
    if (hashedPassword === targetBox.padLockPassword) {
      console.log("[Unlock API] Password verified - CORRECT");
      return NextResponse.json(
        {
          success: true,
          message: "Password verified",
          unlocked: true,
        },
        { status: 200 }
      );
    } else {
      console.log("[Unlock API] Password mismatch - INCORRECT");
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
          unlocked: false,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("[Unlock API] Error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
