import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    BarChart3,
    Settings,
    FileText,
    UserCog,
    Tag,
    Megaphone,
    Boxes,
    Grid3x3,
    Palette,
    Warehouse,
    CreditCard,
    Truck,
    Receipt,
    RotateCcw,
    UsersRound,
    Award,
    Mail,
    Percent,
    Image,
    Search,
    DollarSign,
    Activity,
    ShoppingBag,
    Newspaper,
    Menu,
    FolderTree,
    type LucideIcon
} from "lucide-react";

export interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
    badge?: number;
    children?: NavigationItem[];
}

export const adminNavigation: NavigationItem[] = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        name: "Product Management",
        href: "/admin/products",
        icon: Package,
        children: [
            {
                name: "Products",
                href: "/admin/products",
                icon: Package,
            },
            {
                name: "Categories",
                href: "/admin/categories",
                icon: FolderTree,
            },
            {
                name: "Attributes",
                href: "/admin/attributes",
                icon: Grid3x3,
            },
            {
                name: "Inventory",
                href: "/admin/inventory",
                icon: Warehouse,
            },
            {
                name: "Brands",
                href: "/admin/brands",
                icon: Tag,
            },
        ],
    },
    {
        name: "Order Management",
        href: "/admin/orders",
        icon: ShoppingCart,
        children: [
            {
                name: "Orders",
                href: "/admin/orders",
                icon: ShoppingCart,
            },
            {
                name: "Invoices",
                href: "/admin/invoices",
                icon: Receipt,
            },
            {
                name: "Shipments",
                href: "/admin/shipments",
                icon: Truck,
            },
            {
                name: "Returns",
                href: "/admin/returns",
                icon: RotateCcw,
            },
        ],
    },
    {
        name: "Customers",
        href: "/admin/customers",
        icon: Users,
        children: [
            {
                name: "All Customers",
                href: "/admin/customers",
                icon: Users,
            },
            {
                name: "Customer Groups",
                href: "/admin/customer-groups",
                icon: UsersRound,
            },
            {
                name: "Loyalty Program",
                href: "/admin/loyalty",
                icon: Award,
            },
        ],
    },
    {
        name: "Marketing",
        href: "/admin/marketing",
        icon: Megaphone,
        children: [
            {
                name: "Campaigns",
                href: "/admin/marketing/campaigns",
                icon: Mail,
            },
            {
                name: "Coupons",
                href: "/admin/marketing/coupons",
                icon: Percent,
            },
            {
                name: "Banners",
                href: "/admin/marketing/banners",
                icon: Image,
            },
            {
                name: "SEO",
                href: "/admin/marketing/seo",
                icon: Search,
            },
        ],
    },
    {
        name: "Reports",
        href: "/admin/reports",
        icon: BarChart3,
        children: [
            {
                name: "Sales Reports",
                href: "/admin/reports/sales",
                icon: DollarSign,
            },
            {
                name: "Traffic & Behavior",
                href: "/admin/reports/traffic",
                icon: Activity,
            },
            {
                name: "Customer Reports",
                href: "/admin/reports/customers",
                icon: Users,
            },
            {
                name: "Inventory Reports",
                href: "/admin/reports/inventory",
                icon: Boxes,
            },
            {
                name: "Marketing Reports",
                href: "/admin/reports/marketing",
                icon: TrendingUp,
            },
        ],
    },
    {
        name: "CMS",
        href: "/admin/cms",
        icon: FileText,
        children: [
            {
                name: "Pages",
                href: "/admin/cms/pages",
                icon: FileText,
            },
            {
                name: "Blog",
                href: "/admin/cms/blog",
                icon: Newspaper,
            },
            {
                name: "Menus",
                href: "/admin/cms/menus",
                icon: Menu,
            },
            {
                name: "Media Library",
                href: "/admin/cms/media",
                icon: Image,
            },
        ],
    },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
    {
        name: "Users & Roles",
        href: "/admin/users",
        icon: UserCog,
        children: [
            {
                name: "Admin Users",
                href: "/admin/users",
                icon: UserCog,
            },
            {
                name: "Roles & Permissions",
                href: "/admin/users/roles",
                icon: Award,
            },
            {
                name: "Activity Log",
                href: "/admin/users/activity-log",
                icon: Activity,
            },
        ],
    },
];
