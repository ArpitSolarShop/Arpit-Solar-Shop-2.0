"use client"

import { usePathname } from "next/navigation"

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isHome = pathname === "/"

    return (
        <main
            className={`min-h-screen ${!isHome ? "pt-[var(--navbar-height)]" : ""}`}
            style={!isHome ? { paddingTop: 'var(--navbar-height, 75px)' } : {}}
        >
            {children}
        </main>
    )
}
