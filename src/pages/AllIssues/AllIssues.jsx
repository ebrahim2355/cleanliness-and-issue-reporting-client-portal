import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function AllIssues() {
    const axiosSecure = useAxiosSecure();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await axiosSecure.get("/issues");
                setIssues(res.data || []);
            } catch (err) {
                toast.error("Failed to load issues");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (issues.length === 0) {
        return <p className="text-center text-gray-600 py-20">No issues found.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
                All Issues
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue) => (
                    <div
                        key={issue._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                    >
                        <img
                            src={issue.image}
                            alt={issue.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {issue.title}
                                </h3>
                                <p className="text-gray-600 mb-2 text-sm">
                                    <span className="font-semibold">Category:</span>{" "}
                                    {issue.category}
                                </p>
                                <p className="text-gray-600 mb-2 text-sm">
                                    <span className="font-semibold">Location:</span>{" "}
                                    {issue.location}
                                </p>
                                <p className="text-gray-600 mb-2 text-sm">
                                    <span className="font-semibold">Status:</span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${issue.status === "ongoing"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                            }`}
                                    >
                                        {issue.status}
                                    </span>
                                </p>
                                <p className="text-gray-700 text-sm">
                                    {issue.description.length > 100
                                        ? issue.description.slice(0, 100) + "..."
                                        : issue.description}
                                </p>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <p className="font-semibold text-green-700">
                                    ${issue.amount}
                                </p>
                                <Link
                                    to={`/issues/${issue._id}`}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm"
                                >
                                    See Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
