import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function IssueDetails() {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [issue, setIssue] = useState(null);
    const [contributors, setContributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        amount: "",
        phone: "",
        address: "",
        additionalInfo: "",
    });

    // Fetch issue details
    useEffect(() => {
        let mounted = true;

        const fetchIssue = async () => {
            try {
                const res = await axiosSecure.get(`/issues/${id}`);
                if (!res.data) {
                    if (mounted) toast.error("Issue not found");
                    return;
                }
                if (mounted) setIssue(res.data);

                const contribRes = await axiosSecure.get(`/contributions?issueId=${id}`);
                if (mounted) setContributors(contribRes.data);
            } catch (err) {
                if (mounted) toast.error("Failed to load issue details");
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchIssue();

        return () => {
            mounted = false;
        };
    }, [id, axiosSecure]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleContribution = async (e) => {
        e.preventDefault();
        const contributionData = {
            issueId: id,
            amount: parseFloat(form.amount),
            name: user?.displayName || "Anonymous",
            email: user?.email,
            phone: form.phone,
            address: form.address,
            date: new Date(),
            additionalInfo: form.additionalInfo,
        };

        try {
            await axiosSecure.post("/contributions", contributionData);
            toast.success("Thank you for your contribution!");
            setShowModal(false);
            setForm({ amount: "", phone: "", address: "", additionalInfo: "" });

            const contribRes = await axiosSecure.get(`/contributions?issueId=${id}`);
            setContributors(contribRes.data);
        } catch (error) {
            toast.error("Failed to submit contribution");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!issue) {
        return <p className="text-center text-gray-600 py-20">Issue not found.</p>;
    }

    const totalCollected = contributors.reduce((sum, c) => sum + (c.amount || 0), 0);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
            {/* Issue Details */}
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:gap-6">
                <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full md:w-1/2 h-64 md:h-auto object-cover rounded-lg mb-4 md:mb-0"
                />
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-green-700 mb-2">{issue.title}</h2>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Category:</span> {issue.category}
                        </p>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Location:</span> {issue.location}
                        </p>
                        <p className="text-gray-600 mb-1">
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
                        <p className="text-gray-700 mb-4">{issue.description}</p>
                        <p className="font-semibold text-green-700">
                            Suggested Fix Budget: ${issue.amount}
                        </p>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                        <p className="text-gray-700 font-medium">
                            Total Collected:{" "}
                            <span className="text-green-700 font-bold">${totalCollected}</span>
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition cursor-pointer"
                        >
                            Pay Clean-Up Contribution
                        </button>
                    </div>
                </div>
            </div>

            {/* Contributors Section */}
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Contributors</h3>
                {contributors.length === 0 ? (
                    <p className="text-gray-600 text-sm">
                        No contributions yet. Be the first to support this cleanup drive!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contributors.map((c, i) => (
                            <div
                                key={i}
                                className="bg-green-50 border-l-4 border-green-700 p-4 rounded-lg shadow hover:shadow-md transition flex flex-col"
                            >
                                <p>
                                    <span className="font-semibold">Name: </span>
                                    {c.name}
                                </p>
                                <p>
                                    <span className="font-semibold">Email: </span>
                                    {c.email}
                                </p>
                                <p className="text-green-700 font-semibold">
                                    <span className="font-semibold">Amount: </span>${c.amount}
                                </p>
                                <p>
                                    <span className="font-semibold">Address: </span>
                                    {c.address}
                                </p>
                                {c.additionalInfo && (
                                    <p>
                                        <span className="font-semibold">Note: </span>
                                        {c.additionalInfo}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <h3 className="text-2xl font-bold text-green-700 mb-4">
                            Contribute to Clean-Up
                        </h3>
                        <form onSubmit={handleContribution} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Issue Title</label>
                                <input
                                    type="text"
                                    value={issue.title}
                                    readOnly
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Additional Info</label>
                                <textarea
                                    name="additionalInfo"
                                    value={form.additionalInfo}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded px-3 py-2"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
