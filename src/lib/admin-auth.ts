// Admin authentication utilities

export interface AdminSession {
    isAuthenticated: boolean;
    timestamp: number;
}

const SESSION_KEY = 'admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function setAdminSession(): void {
    if (typeof window === 'undefined') return;

    const session: AdminSession = {
        isAuthenticated: true,
        timestamp: Date.now(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getAdminSession(): AdminSession | null {
    if (typeof window === 'undefined') return null;

    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    try {
        const session: AdminSession = JSON.parse(sessionStr);

        // Check if session is expired
        if (Date.now() - session.timestamp > SESSION_DURATION) {
            clearAdminSession();
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

export function clearAdminSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
}

export function isAdminAuthenticated(): boolean {
    const session = getAdminSession();
    return session?.isAuthenticated ?? false;
}
