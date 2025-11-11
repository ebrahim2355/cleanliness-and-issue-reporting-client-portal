import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";

export default function JoinDrive() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    additionalInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [loyalUsers, setLoyalUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch top loyal users
  useEffect(() => {
    const fetchLoyalUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await axiosSecure.get("/loyalUsers");
        setLoyalUsers(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load loyal users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchLoyalUsers();
  }, [axiosSecure]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      return toast.error("Please fill in all required fields!");
    }

    try {
      setLoading(true);
      const response = await axiosSecure.post("/contributions", {
        ...formData,
        date: new Date(),
        status: "pending",
        issueId: null,
      });

      if (response.data.insertedId || response.data.acknowledged) {
        toast.success("Successfully joined the Clean-Up Drive!");
        setFormData({ name: "", email: "", phone: "", address: "", additionalInfo: "" });
      } else {
        toast.error("Failed to join the drive. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error: Could not submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 py-12">
      <div className="max-w-3xl w-full mb-8">
        <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">
          Top Volunteers
        </h2>
        {loadingUsers ? (
          <p className="text-center text-green-700">Loading loyal users...</p>
        ) : loyalUsers.length === 0 ? (
          <p className="text-center text-gray-500">No loyal users yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loyalUsers.map((user, idx) => (
              <div key={user._id || idx} className="bg-white rounded shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-green-700 font-bold">
                  {user.totalContributions}x
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          Join the Clean-Up Drive
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Fill out the form below to participate in our community cleanup initiatives.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name*"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email*"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone*"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address*"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Additional Info"
            rows={3}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold transition cursor-pointer"
          >
            {loading ? "Submitting..." : "Join Drive"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full text-green-700 underline hover:text-green-900 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
