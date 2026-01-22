"use client";

import { CustomerForm } from "@/components/admin/CustomerForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditCustomerPage() {
    const params = useParams();
    const [customer, setCustomer] = useState(null);
    const [customerGroups, setCustomerGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch customer groups
                const groupsRes = await fetch("/api/customer-groups");
                const groupsData = await groupsRes.json();
                setCustomerGroups(groupsData.data || []);

                // Fetch customer
                const customerRes = await fetch("/api/customers");
                const customerData = await customerRes.json();
                const foundCustomer = customerData.data?.find((c: any) => c.id === params.id);
                setCustomer(foundCustomer || null);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading customer...</p>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Customer not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Customer</h1>
                <p className="text-gray-600 mt-1">Update customer information</p>
            </div>
            <CustomerForm customer={customer} customerGroups={customerGroups} />
        </div>
    );
}
