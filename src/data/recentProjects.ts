export type ProjectUpdate = {
    id: string;
    title: string;
    date: string;
    category: "Installation" | "News" | "Subsidy";
    description: string;
    image: string;
    locationSlug: string; // The slug of the city related to this update, e.g., 'varanasi'
};

export const recentProjects: ProjectUpdate[] = [
    {
        id: "1",
        title: "5kW Rooftop System Installed in Shivpur",
        date: "2024-03-15",
        category: "Installation",
        description: "Successfully commissioned a 5kW on-grid solar system for a residential home in Shivpur. Expected annual savings: ₹60,000.",
        image: "https://images.unsplash.com/photo-1625301840055-7c1b7198cfc0?q=80&w=2071&auto=format&fit=crop",
        locationSlug: "varanasi",
    },
    {
        id: "2",
        title: "New Subsidy Rates Announced for UP",
        date: "2024-03-10",
        category: "Subsidy",
        description: "The PM Surya Ghar Yojana has increased subsidy amounts for systems up to 3kW. Contact us to check your eligibility.",
        image: "https://images.unsplash.com/photo-1548613053-220e75370358?q=80&w=2070&auto=format&fit=crop",
        locationSlug: "varanasi",
    },
    {
        id: "3",
        title: "Commercial Solar Project in Lanka",
        date: "2024-02-28",
        category: "Installation",
        description: "Installed a 10kW commercial solar plant for a hotel in Lanka, Varanasi. Helping local businesses go green.",
        image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2058&auto=format&fit=crop",
        locationSlug: "varanasi",
    },
    {
        id: "4",
        title: "Off-Grid System for Farmhouse in Ramnagar",
        date: "2024-02-15",
        category: "Installation",
        description: "Complete energy independence achieved with an 8kW Off-Grid system installation in Ramnagar.",
        image: "https://images.unsplash.com/photo-1508514177221-188b1cf2efc6?q=80&w=2070&auto=format&fit=crop",
        locationSlug: "varanasi",
    },
];
