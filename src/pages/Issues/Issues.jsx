import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import toast from "react-hot-toast";

export default function Issues() {
    const axiosPublic = useAxiosPublic();
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await axiosPublic.get("/issues");
                setIssues(res.data);
            } catch (err) {
                toast.error("Failed to load issues. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, [axiosPublic]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
                Reported Community Issues
            </h2>

            {issues.length === 0 ? (
                <p className="text-center text-gray-600">No issues reported yet.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {issues.map((issue) => (
                        <div
                            key={issue._id}
                            className="bg-white rounded-xl shadow hover:shadow-md transition p-4 border border-gray-100 flex flex-col"
                        >
                            <img
                                src={issue.image}
                                alt={issue.title}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {issue.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium text-green-700">Category:</span>{" "}
                                {issue.category}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                                <span className="font-medium text-green-700">Location:</span>{" "}
                                {issue.location}
                            </p>
                            <p className="text-gray-700 text-sm flex-grow">
                                {issue.description.length > 100
                                    ? issue.description.slice(0, 100) + "..."
                                    : issue.description}
                            </p>

                            <Link
                                to={`/issues/${issue._id}`}
                                className="mt-4 inline-block text-center bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
                            >
                                See Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
