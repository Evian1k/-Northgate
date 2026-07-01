/**
 * Centralized API client.
 *
 * In development: points to the built-in Next.js API routes (relative /api/*).
 * In production: points to the Laravel backend via NEXT_PUBLIC_API_URL env var.
 *
 * The Laravel backend must implement the same REST API contract documented in
 * /docs/LARAVEL_BACKEND_SPEC.md
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const IS_LARAVEL = !!API_BASE_URL;

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

/**
 * Get the auth token from cookies (client-side) or headers (server-side).
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  if (typeof window !== "undefined") {
    // Client-side: read token from localStorage (set by Sanctum login)
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Build the full API URL. Uses Laravel base URL if configured, otherwise relative path.
 */
function buildUrl(path: string): string {
  if (IS_LARAVEL) {
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  }
  return path; // Relative path for Next.js API routes
}

/**
 * Main API client with typed methods.
 */
export const api = {
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", path, undefined, options);
  },

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("POST", path, body, options);
  },

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PATCH", path, body, options);
  },

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PUT", path, body, options);
  },

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },

  /** Get the auth token (for Sanctum bearer auth) */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  /** Set the auth token after login */
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  },

  /** Clear the auth token on logout */
  clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
  },

  /** Whether we're using a Laravel backend */
  isLaravel(): boolean {
    return IS_LARAVEL;
  },
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...options?.headers,
  };

  // For Next.js API routes, we use cookies (httpOnly) — don't send Authorization header
  if (!IS_LARAVEL) {
    delete headers["Authorization"];
  }

  const res = await fetch(buildUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: IS_LARAVEL ? "include" : "same-origin",
    ...options,
  });

  // Handle 401 — clear token and redirect to login
  if (res.status === 401 && typeof window !== "undefined") {
    api.clearToken();
    // Don't auto-redirect — let the calling component handle it
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as any).error || (data as any).message || "Request failed",
      res.status,
      (data as any).details
    );
  }

  // Next.js API routes return { success, data } — unwrap
  if (!IS_LARAVEL && (data as any).data !== undefined) {
    return (data as any).data as T;
  }

  // Laravel returns data directly
  return data as T;
}

export class ApiError extends Error {
  constructor(message: string, public status: number, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * TanStack Query default configuration.
 */
export const queryClientDefaults = {
  staleTime: 30_000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
  retry: (failureCount: number, error: unknown) => {
    if (error instanceof ApiError && error.status === 401) return false;
    if (error instanceof ApiError && error.status === 403) return false;
    return failureCount < 2;
  },
};
