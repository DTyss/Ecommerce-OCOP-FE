import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "";

// Construct full API URL with prefix
const getApiUrl = () => {
    const baseUrl = API_BASE_URL.replace(/\/$/, ""); // Remove trailing slash
    const prefix = API_PREFIX.replace(/^\/|\/$/g, ""); // Remove leading/trailing slashes
    return prefix ? `${baseUrl}/${prefix}` : baseUrl;
};

// Get access token from Zustand persisted storage
const getAccessToken = (): string | null => {
    try {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
            const parsed = JSON.parse(authStorage);
            return parsed.state?.accessToken ?? null;
        }
    } catch {
        // Ignore parse errors
    }
    return null;
};

// Set access token in Zustand persisted storage
const setAccessToken = (token: string): void => {
    try {
        const authStorage = localStorage.getItem("auth-storage");
        const parsed = authStorage ? JSON.parse(authStorage) : { state: {} };
        parsed.state.accessToken = token;
        localStorage.setItem("auth-storage", JSON.stringify(parsed));
    } catch {
        // Ignore errors
    }
};

// Clear auth storage
const clearAuthStorage = (): void => {
    localStorage.removeItem("auth-storage");
};

// Token refresh state - prevent concurrent refresh calls
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });
    failedQueue = [];
};

export const api = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // For refresh token cookies
});

// Request interceptor - Add auth token
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh and unwrap API response
api.interceptors.response.use(
    (response) => {
        // Automatically unwrap API responses with { success: true, result: ... } format
        if (response.data && typeof response.data === "object") {
            if (response.data.success === true && "result" in response.data) {
                response.data = response.data.result;
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || "";

        // Auth endpoints that should NOT trigger token refresh
        const authEndpoints = [
            "/admin/auth/login",
            "/admin/auth/register",
            "/admin/auth/refresh",
            "/auth/logout-session"
        ];

        const isAuthEndpoint = authEndpoints.some((endpoint) => requestUrl.includes(endpoint));

        // Auth error codes that should trigger token refresh (token-related errors)
        const authErrorCodes = [
            "AUTH_001",
            "AUTH_002",
            "AUTH_003",
            "AUTH_004",
            "AUTH_005",
            "AUTH_006",
            "AUTH_007",
            "AUTH_010",
            "AUTH_026"
        ];
        const errorCode = error.response?.data?.errorCode;
        const isAuthError = authErrorCodes.includes(errorCode);

        // Only try refresh if:
        // 1. Status is 401 OR has auth error code
        // 2. Not already retried
        // 3. Not an auth endpoint
        // 4. Has existing access token (user was logged in)
        // Note: refresh token is stored in httpOnly cookie, browser sends it automatically
        const shouldRefresh =
            (error.response?.status === 401 || isAuthError) &&
            !originalRequest._retry &&
            !isAuthEndpoint &&
            getAccessToken();

        if (shouldRefresh) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: (err: unknown) => {
                            reject(err);
                        }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Use axios directly to avoid interceptors
                // Refresh token is stored in httpOnly cookie, sent automatically with withCredentials
                const response = await axios.post(
                    `${getApiUrl()}/admin/auth/refresh`,
                    {},
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true
                    }
                );

                // Unwrap response if needed
                const data = response.data?.result ?? response.data;

                // API returns snake_case: access_token
                const newAccessToken = data.access_token || data.accessToken;

                if (newAccessToken) {
                    setAccessToken(newAccessToken);
                    processQueue(null, newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }

                throw new Error("No access token in refresh response");
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Refresh failed - clear tokens and redirect to login
                clearAuthStorage();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Handle auth errors that didn't go through refresh flow
        // This includes: retry failed, no access token, or unknown auth errors
        const is401Error = error.response?.status === 401;
        const hasRetried = originalRequest._retry === true;

        if ((is401Error || isAuthError) && !isAuthEndpoint) {
            // If already retried once and still getting 401, force logout
            // Or if it's a 401/auth error but no token to refresh
            if (hasRetried || !getAccessToken()) {
                clearAuthStorage();
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
