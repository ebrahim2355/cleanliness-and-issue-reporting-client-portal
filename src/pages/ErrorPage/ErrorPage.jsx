import React from "react";
import { useNavigate } from "react-router";

export default function ErrorPage({ status = 404, message = "Page Not Found" }) {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="text-center bg-white p-12 rounded shadow-md max-w-md w-full">
                <h1 className="text-6xl font-bold text-red-600 mb-4">{status}</h1>
                <h2 className="text-2xl font-semibold mb-4">{message}</h2>
                <p className="text-gray-600 mb-6">
                    Oops! The page you are looking for doesn’t exist or an error occurred.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition cursor-pointer"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
}
