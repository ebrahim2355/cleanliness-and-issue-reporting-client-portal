import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

export default function AddIssue() {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [form, setForm] = useState({
        title: "",
        category: "",
        location: "",
        description: "",
        image: "",
        amount: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.title ||
            !form.category ||
            !form.location ||
            !form.description ||
            !form.image ||
            !form.amount
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        const newIssue = {
            ...form,
            amount: parseFloat(form.amount),
            status: "ongoing",
            date: new Date(),
            email: user.email,
        };

        setLoading(true);

        try {
            const res = await axiosSecure.post("/issues", newIssue);
            if (res.data.insertedId) {
                toast.success("Issue added successfully!");
                setForm({
                    title: "",
                    category: "",
                    location: "",
                    description: "",
                    image: "",
                    amount: "",
                });
            }
        } catch (error) {
            toast.error("Failed to add issue");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
                Add New Issue
            </h2>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Issue Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter issue title"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        required
                    >
                        <option value="">Select category</option>
                        <option value="Garbage">Garbage</option>
                        <option value="Illegal Construction">Illegal Construction</option>
                        <option value="Broken Public Property">Broken Public Property</option>
                        <option value="Road Damage">Road Damage</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Enter issue location"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the issue"
                        rows="4"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={form.image}
                        onChange={handleChange}
                        placeholder="Paste image URL"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Suggested Fix Budget ($)</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter suggested budget"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 text-white font-medium py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
                >
                    {loading ? "Submitting..." : "Submit Issue"}
                </button>
            </form>
        </div>
    );
}
