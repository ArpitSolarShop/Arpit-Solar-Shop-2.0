"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAdminSession } from "@/lib/admin-auth";
import { useState } from "react";
import { adminNavigation, type NavigationItem } from "@/config/admin-navigation";
import { cn } from "@/lib/utils";

function NavItem({ item, level = 0 }: { item: NavigationItem; level?: number }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const hasChildren = item.children && item.children.length > 0;

    // Check if this item or any of its children are active
    const isActive = pathname === item.href ||
        (item.href !== '/admin' && pathname.startsWith(item.href)) ||
        (hasChildren && item.children?.some(child =>
            pathname === child.href ||
            (child.href !== '/admin' && pathname.startsWith(child.href))
        ));

    // Auto-expand if a child is active
    const shouldBeOpen = isActive && hasChildren;

    if (hasChildren) {
        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors",
                        level === 0 && "font-medium",
                        isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                >
                    <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                        {item.badge && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </div>
                    {(isOpen || shouldBeOpen) ? (
                        <ChevronDown className="w-4 h-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </button>

                {(isOpen || shouldBeOpen) && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-2">
                        {item.children?.map((child) => (
                            <NavItem key={child.href} item={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center px-4 py-3 rounded-lg transition-colors",
                level === 0 && "font-medium",
                level > 0 && "text-sm",
                isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
        >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
            {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}

export default function AdminSidebar() {
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        clearAdminSession();
        router.push('/admin/login');
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="bg-white"
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </div>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-16 px-4 bg-gray-800">
                        <h1 className="text-xl font-bold">Arpit Solar Admin</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {adminNavigation.map((item) => (
                            <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                                <NavItem item={item} />
                            </div>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-800">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
