// Environment configuration

export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// Type-safe environment checks
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
