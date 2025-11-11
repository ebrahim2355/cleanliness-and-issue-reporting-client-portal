import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function MyContribution() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user's contributions and enrich with issue data
    const fetchContributions = async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get(`/contributions?email=${user.email}`);
            const baseContributions = res.data || [];

            // For each contribution, fetch issue details by issueId
            const enriched = await Promise.all(
                baseContributions.map(async (c) => {
                    try {
                        const issueRes = await axiosSecure.get(`/issues/${c.issueId}`);
                        const issue = issueRes.data;
                        return {
                            ...c,
                            issueTitle: issue?.title || "N/A",
                            status: issue?.status || "N/A",
                        };
                    } catch {
                        return { ...c, issueTitle: "N/A", status: "N/A" };
                    }
                })
            );

            setContributions(enriched);
        } catch (error) {
            toast.error("Failed to fetch your contributions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) fetchContributions();
    }, [user?.email]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
                My Contributions
            </h2>

            {contributions.length === 0 ? (
                <p className="text-center text-gray-600">
                    You haven't made any contributions yet.
                </p>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm md:text-base">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="border p-2 text-left">Issue Title</th>
                                    <th className="border p-2 text-left">Amount</th>
                                    <th className="border p-2 text-left">Date</th>
                                    <th className="border p-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50">
                                        <td className="border p-2">{c.issueTitle}</td>
                                        <td className="border p-2 text-green-700 font-semibold">
                                            ${c.amount}
                                        </td>
                                        <td className="border p-2">
                                            {new Date(c.date).toLocaleDateString()}
                                        </td>
                                        <td className="border p-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs md:text-sm ${c.status === "ended"
                                                    ? "bg-red-100 text-red-700"
                                                    : c.status === "ongoing"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden flex flex-col gap-4">
                        {contributions.map((c) => (
                            <div
                                key={c._id}
                                className="border rounded-lg p-3 shadow-sm bg-white"
                            >
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">
                                                Issue Title
                                            </td>
                                            <td className="text-right text-green-700 font-semibold py-1">
                                                {c.issueTitle}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">
                                                Amount
                                            </td>
                                            <td className="text-right text-green-700 font-semibold py-1">
                                                ${c.amount}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Date</td>
                                            <td className="text-right py-1">
                                                {new Date(c.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Status</td>
                                            <td className="text-right py-1">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${c.status === "ended"
                                                        ? "bg-red-100 text-red-700"
                                                        : c.status === "ongoing"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {c.status}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
