import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function MyIssues() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [currentIssue, setCurrentIssue] = useState(null);

    const [form, setForm] = useState({
        title: "",
        category: "",
        location: "",
        description: "",
        amount: "",
        status: "ongoing",
    });

    // Fetch user's issues
    const fetchIssues = async () => {
        try {
            setLoading(true);
            const res = await axiosSecure.get(`/issues?email=${user.email}`);
            setIssues(res.data);
        } catch (error) {
            toast.error("Failed to fetch your issues");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) fetchIssues();
    }, [user?.email]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const openUpdateModal = (issue) => {
        setCurrentIssue(issue);
        setForm({
            title: issue.title,
            category: issue.category,
            location: issue.location,
            description: issue.description,
            amount: issue.amount,
            status: issue.status,
        });
        setShowUpdateModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosSecure.put(`/issues/${currentIssue._id}`, form);
            // console.log(res)
            toast.success("Issue updated successfully");
            fetchIssues();
            setShowUpdateModal(false);
        } catch (error) {
            toast.error("Failed to update issue");
        }
    };

    const handleDelete = async (issueId) => {
        const confirmResult = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the issue!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmResult.isConfirmed) {
            try {
                await axiosSecure.delete(`/issues/${issueId}`);
                toast.success("Issue deleted successfully");
                fetchIssues();
            } catch (error) {
                toast.error("Failed to delete issue");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">My Issues</h2>

            {issues.length === 0 ? (
                <p className="text-center text-gray-600">You have not reported any issues yet.</p>
            ) : (
                <>
                    {/* Table for Desktop */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm md:text-base">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="border p-2 text-left">Title</th>
                                    <th className="border p-2 text-left">Category</th>
                                    <th className="border p-2 text-left">Location</th>
                                    <th className="border p-2 text-left">Amount</th>
                                    <th className="border p-2 text-left">Status</th>
                                    <th className="border p-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue) => (
                                    <tr key={issue._id} className="hover:bg-gray-50">
                                        <td className="border p-2">{issue.title}</td>
                                        <td className="border p-2">{issue.category}</td>
                                        <td className="border p-2">{issue.location}</td>
                                        <td className="border p-2">${issue.amount}</td>
                                        <td className="border p-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs md:text-sm ${issue.status === "ongoing"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td className="border-r border-b p-2 flex justify-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => openUpdateModal(issue)}
                                                className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs md:text-sm cursor-pointer"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDelete(issue._id)}
                                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs md:text-sm cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards for Mobile */}
                    <div className="md:hidden flex flex-col gap-4">
                        {issues.map((issue) => (
                            <div
                                key={issue._id}
                                className="border rounded-lg p-3 shadow-sm bg-white"
                            >
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Title</td>
                                            <td className="text-right text-green-700 font-semibold py-1">
                                                {issue.title}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Category</td>
                                            <td className="text-right py-1">{issue.category}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Location</td>
                                            <td className="text-right py-1">{issue.location}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Amount</td>
                                            <td className="text-right text-green-700 font-semibold py-1">
                                                ${issue.amount}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Status</td>
                                            <td className="text-right py-1">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${issue.status === "ongoing"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                        }`}
                                                >
                                                    {issue.status}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-medium text-gray-600 py-1">Actions</td>
                                            <td className="text-right py-1 flex justify-end gap-2">
                                                <button
                                                    onClick={() => openUpdateModal(issue)}
                                                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs cursor-pointer"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(issue._id)}
                                                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <h3 className="text-2xl font-bold text-green-700 mb-4">
                            Update Issue
                        </h3>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="Garbage">Garbage</option>
                                    <option value="Illegal Construction">Illegal Construction</option>
                                    <option value="Broken Public Property">Broken Public Property</option>
                                    <option value="Road Damage">Road Damage</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded px-3 py-2"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="ongoing">Ongoing</option>
                                    <option value="ended">Ended</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
