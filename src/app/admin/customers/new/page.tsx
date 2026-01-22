"use client";

import { CustomerForm } from "@/components/admin/CustomerForm";
import { useEffect, useState } from "react";

export default function NewCustomerPage() {
    const [customerGroups, setCustomerGroups] = useState([]);

    useEffect(() => {
        fetch("/api/customer-groups")
            .then((res) => res.json())
            .then((data) => setCustomerGroups(data.data || []))
            .catch((err) => console.error("Error fetching customer groups:", err));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
                <p className="text-gray-600 mt-1">Create a new customer account</p>
            </div>
            <CustomerForm customerGroups={customerGroups} />
        </div>
    );
}
