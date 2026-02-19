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
        image: "/Hybrid.webp",
        locationSlug: "varanasi",
    },
    {
        id: "2",
        title: "New Subsidy Rates Announced for UP",
        date: "2024-03-10",
        category: "Subsidy",
        description: "The PM Surya Ghar Yojana has increased subsidy amounts for systems up to 3kW. Contact us to check your eligibility.",
        image: "/city-solar-bg.webp",
        locationSlug: "varanasi",
    },
    {
        id: "3",
        title: "Commercial Solar Project in Lanka",
        date: "2024-02-28",
        category: "Installation",
        description: "Installed a 10kW commercial solar plant for a hotel in Lanka, Varanasi. Helping local businesses go green.",
        image: "/Integrated.webp",
        locationSlug: "varanasi",
    },
    {
        id: "4",
        title: "Off-Grid System for Farmhouse in Ramnagar",
        date: "2024-02-15",
        category: "Installation",
        description: "Complete energy independence achieved with an 8kW Off-Grid system installation in Ramnagar.",
        image: "/Shakti Solar.webp",
        locationSlug: "varanasi",
    },
];
