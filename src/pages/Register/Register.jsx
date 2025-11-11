import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


export default function Register() {
    const { createUser, updateUserProfile, googleSignIn } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        photo: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Save user to DB if new
    const saveUserToDb = async (user) => {
        try {
            const userInfo = {
                name: user.displayName || "No Name",
                email: user.email,
                photo: user.photoURL || "",
                role: "user",
                createdAt: new Date(),
            };

            const response = await axiosSecure.post("/users", userInfo);
            if (response.data.message === "User already exists") {
                console.log("User already exists in DB");
            } else {
                console.log("New user saved to DB");
            }
        } catch (err) {
            console.error("Error saving user:", err);
        }
    };

    // Handle registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { name, email, password, photo } = form;

        // Password validation
        const uppercase = /[A-Z]/.test(password);
        const lowercase = /[a-z]/.test(password);
        if (!uppercase || !lowercase || password.length < 6) {
            toast.error(
                "Password must be at least 6 characters with uppercase & lowercase letters"
            );
            setLoading(false);
            return;
        }

        try {
            const result = await createUser(email, password);
            const user = result.user;

            // Update name & photo in Firebase
            await updateUserProfile(name, photo);

            // Save user in MongoDB
            await saveUserToDb(user);

            toast.success("Registration successful!");
            navigate("/");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Google sign up
    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            await saveUserToDb(user);

            toast.success("Signed up with Google!");
            navigate("/");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex justify-center items-center bg-gray-50 py-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
                    Create Your Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your name"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible size={20}/> : <AiFillEye size={20} />}
                            </span>
                        </div>
                    </div>

                    {/* Photo URL */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Photo URL</label>
                        <input
                            type="text"
                            name="photo"
                            value={form.photo}
                            onChange={handleChange}
                            placeholder="Paste photo URL (optional)"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-700 text-white font-medium py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">or</div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-red-500 text-white font-medium py-2 rounded-md hover:bg-red-400 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                    Sign Up with Google
                </button>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-700 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
