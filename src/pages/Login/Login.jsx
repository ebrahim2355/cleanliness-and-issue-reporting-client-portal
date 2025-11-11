import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


export default function Login() {
    const { signIn, googleSignIn } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Save user to database if new
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
                console.log("User already in DB");
            } else {
                console.log("New user saved to DB");
            }
        } catch (err) {
            console.error("Error saving user:", err);
        }
    };

    // Email/password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            const result = await signIn(email, password);
            const user = result.user;

            // Save user to DB
            await saveUserToDb(user);

            toast.success("Login successful!");
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Google login
    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            // Save new Google user to DB
            await saveUserToDb(user);

            toast.success("Google login successful!");
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex justify-center items-center bg-gray-50 py-10">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
                    Login to CleanCommunity
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-600"
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-700 text-white font-medium py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">or</div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-red-500 text-white font-medium py-2 rounded-md hover:bg-red-400 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                    Login with Google
                </button>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-green-700 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
