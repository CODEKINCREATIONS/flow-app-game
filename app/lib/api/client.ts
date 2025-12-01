// API Client with base configuration
import { env } from "@/app/lib/config/env";
import type { ApiResponse, ApiError } from "@/app/types/api";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = env.API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || "An error occurred",
          status: response.status,
          errors: data.errors,
        };
        // Log error in development
        if (process.env.NODE_ENV === "development") {
          console.error(`API Error [${response.status}]: ${url}`, error);
        }
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Network error occurred";
      // Log error in development
      if (process.env.NODE_ENV === "development") {
        console.error(`API Request failed: ${endpoint}`, error);
      }
      return {
        success: false,
        error: errorMsg,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
