import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-hot-toast";
import Slider from "react-slick";

const banners = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1605602560709-bd03f0366628?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
        title: "Clean Your Community",
        subtitle: "Join hands to make your neighborhood cleaner!"
    },
    {
        id: 2,
        image: "https://plus.unsplash.com/premium_photo-1661266825180-f571c30ca07c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=869",
        title: "Report Issues Easily",
        subtitle: "Track and report environmental problems instantly!"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
        title: "Support Sustainability",
        subtitle: "Contribute to cleanup drives and initiatives!"
    }
];

const categories = [
    { name: "Garbage", image: "/images/garbage.jpg" },
    { name: "Illegal Construction", image: "/images/illegal-construction.jpg" },
    { name: "Broken Public Property", image: "/images/broken-property.jpg" },
    { name: "Road Damage", image: "/images/road-damage.jpg" },
];

export default function Home() {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const [latestIssues, setLatestIssues] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, resolved: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch latest issues
    useEffect(() => {
        const fetchIssuesAndStats = async () => {
            try {
                setLoading(true);
                const [issuesRes, usersRes] = await Promise.all([
                    axiosSecure.get("/issues"),
                    axiosSecure.get("/users")
                ]);

                const sortedIssues = issuesRes.data
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 6);

                const resolvedCount = issuesRes.data.filter(i => i.status === "ended").length;
                const pendingCount = issuesRes.data.filter(i => i.status === "ongoing").length;

                setLatestIssues(sortedIssues);
                setStats({ totalUsers: usersRes.data.length, resolved: resolvedCount, pending: pendingCount });
            } catch (err) {
                console.error(err);
                toast.error("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchIssuesAndStats();
    }, [axiosSecure]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
        adaptiveHeight: true,
    };

    return (
        <div className="min-h-screen">
            {/* Banner Slider */}
            <section className="mb-10">
                <Slider {...sliderSettings}>
                    {banners.map((banner) => (
                        <div key={banner.id} className="relative h-64 sm:h-96">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-center text-white p-4">
                                <h1 className="text-2xl sm:text-4xl font-bold">{banner.title}</h1>
                                <p className="mt-2 sm:text-lg">{banner.subtitle}</p>
                                <button
                                    onClick={() => navigate("/all-issues")}
                                    className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded font-semibold transition cursor-pointer"
                                >
                                    View All Issues
                                </button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </section>

            {/* Category Section */}
            <section className="max-w-7xl mx-auto px-4 mb-10">
                <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map(c => (
                        <div
                            key={c.name}
                            className="border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-lg"
                            onClick={() => navigate(`/all-issues?category=${c.name}`)}
                        >
                            <img src={c.image} alt={c.name} className="w-full h-32 object-cover" />
                            <h3 className="text-center text-lg font-semibold py-2">{c.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Complaints */}
            <section className="max-w-7xl mx-auto px-4 mb-10">
                <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Recent Complaints</h2>
                {loading ? (
                    <p className="text-center text-green-700">Loading latest issues...</p>
                ) : latestIssues.length === 0 ? (
                    <p className="text-center text-gray-500">No recent complaints found.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {latestIssues.map(issue => (
                            <div key={issue._id} className="border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                                <img
                                    src={issue.image || "/images/default-issue.jpg"}
                                    alt={issue.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2 flex-1">
                                        {issue.description.length > 80
                                            ? issue.description.slice(0, 80) + "..."
                                            : issue.description}
                                    </p>
                                    <p className="text-sm font-medium mb-2">
                                        Category: <span className="text-green-700">{issue.category}</span>
                                    </p>
                                    <p className="text-sm font-medium mb-2">Location: {issue.location}</p>
                                    <button
                                        onClick={() => navigate(`/issues/${issue._id}`)}
                                        className="mt-auto inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                                    >
                                        See Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Community Stats */}
            <section className="bg-green-50 rounded-lg p-6 flex flex-col md:flex-row justify-around items-center gap-4 mb-12 max-w-7xl mx-auto">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-700">{stats.totalUsers}</h3>
                    <p className="text-gray-600">Registered Users</p>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-700">{stats.resolved}</h3>
                    <p className="text-gray-600">Resolved Issues</p>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-green-700">{stats.pending}</h3>
                    <p className="text-gray-600">Pending Issues</p>
                </div>
            </section>

            {/* Volunteer Call-to-Action */}
            <section className="bg-green-600 text-white rounded-lg p-8 text-center max-w-7xl mx-auto mb-10">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Join Our Clean-Up Drive</h2>
                <p className="mb-4">Participate in community cleanup and make your neighborhood a better place.</p>
                <button
                    onClick={() => navigate("/join-drive")}
                    className="px-6 py-3 bg-white text-green-700 font-semibold rounded hover:bg-gray-100 cursor-pointer"
                >
                    Join Now
                </button>
            </section>
        </div>
    );
}
