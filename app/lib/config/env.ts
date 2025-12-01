// Environment configuration

// Get the API URL - use relative path for same-origin requests on production
const getApiUrl = () => {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // On production (Vercel), use relative path for API routes
  if (typeof window === "undefined") {
    // Server-side: use localhost for development
    return process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";
  }
  
  // Client-side: use relative path (empty string = current origin)
  return "";
};

export const env = {
  API_URL: getApiUrl(),
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000",
  SESSION_VERIFICATION_URL:
    process.env.NEXT_PUBLIC_SESSION_VERIFICATION_URL ||
    "https://flowapp-hdx-d5d7hvdeeee4g3dr.uaenorth-01.azurewebsites.net",
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// Type-safe environment checks
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
