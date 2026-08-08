/**
 * API endpoints and configuration
 */

export const apiConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    endpoints: {
        projects: {
            list: '/api/projects',
        },
    },
    // External APIs
    external: {},
} as const;

/**
 * API client helper
 */
export async function apiClient<T = any>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${apiConfig.baseUrl}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json();
}
