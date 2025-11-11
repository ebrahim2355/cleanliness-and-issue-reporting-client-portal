import { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { AuthContext } from "../../contexts/AuthContext";

export default function Navbar() {
    const { user, logOut } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logOut();
            toast.success("Logged out successfully");
            setShowLogout(false);
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    // Close logout dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowLogout(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = user
        ? [
            { path: "/", label: "Home" },
            { path: "/all-issues", label: "All Issues" },
            { path: "/add-issue", label: "Add Issue" },
            { path: "/my-issues", label: "My Issues" },
            { path: "/my-contribution", label: "My Contribution" },
        ]
        : [
            { path: "/", label: "Home" },
            { path: "/issues", label: "Issues" },
            { path: "/login", label: "Login" },
            { path: "/register", label: "Register" },
        ];

    return (
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-extrabold text-green-700 hover:text-green-800 transition"
                >
                    Clean<span className="text-gray-700">Community</span>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center gap-6 font-medium text-gray-700">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-green-700 border-b-2 border-green-700 pb-1"
                                        : "hover:text-green-600 transition"
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}

                    {user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowLogout(!showLogout)}
                                className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition cursor-pointer"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="User"
                                        className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-2xl" />
                                )}
                                <span className="text-sm font-medium">
                                    {user.displayName || "User"}
                                </span>
                            </button>

                            {showLogout && (
                                <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-32 text-sm animate-fade-in">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-2xl text-gray-700"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div
                className={`md:hidden bg-white border-t shadow-sm transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <ul className="flex flex-col text-gray-700 font-medium px-4 py-3 space-y-2">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-green-700 border-l-4 border-green-700 pl-2"
                                        : "hover:text-green-600 transition"
                                }
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}

                    {user && (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left text-red-600 hover:text-red-700 transition"
                            >
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
