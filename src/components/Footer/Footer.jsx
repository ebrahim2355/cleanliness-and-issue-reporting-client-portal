import { Link } from "react-router";
import { FaFacebook, FaXTwitter, FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-700 border-t ">
            <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
                {/* Logo & Description */}
                <div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">
                        CleanCommunity
                    </h2>
                    <p className="text-sm">
                        Empowering communities to report, track, and resolve cleanliness
                        issues together for a greener, cleaner city.
                    </p>
                </div>

                {/* Useful Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Useful Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-green-700">Home</Link></li>
                        <li><Link to="/all-issues" className="hover:text-green-700">All Issues</Link></li>
                        <li><Link to="/add-issue" className="hover:text-green-700">Report Issue</Link></li>
                        <li><Link to="/my-contribution" className="hover:text-green-700">My Contribution</Link></li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Me</h3>
                    <ul className="space-y-2 text-sm mb-3">
                        <li>Name: MD. Ebrahim Ali</li>
                        <li>
                            GitHub:{" "}
                            <a
                                href="https://github.com/ebrahim2355"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-green-700"
                            >
                                github.com/ebrahim2355
                            </a>
                        </li>
                        <li>
                            Email:{" "}
                            <a
                                href="mailto:web.ebrahimali@gmail.com"
                                className="hover:text-green-700"
                            >
                                web.ebrahimali@gmail.com
                            </a>
                        </li>
                    </ul>
                    <h3 className="text-lg font-semibold mb-2">Follow Me</h3>
                    <div className="flex gap-4 text-xl">
                        <a target="_blank"
                                rel="noopener noreferrer" href="https://www.facebook.com/ebrahim2355" className="hover:text-green-700"><FaFacebook /></a>
                        <a target="_blank"
                                rel="noopener noreferrer" href="https://www.x.com/ebrahim2355" className="hover:text-green-700"><FaXTwitter /></a>
                        <a href="#" className="hover:text-green-700"><FaInstagram /></a>
                        <a
                            href="https://github.com/ebrahim2355"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-700"
                        >
                            <FaGithub />
                        </a>
                        <a href="mailto:web.ebrahimali@gmail.com" className="hover:text-green-700">
                            <FaEnvelope />
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t text-center py-3 text-sm bg-gray-50">
                © {new Date().getFullYear()} CleanCommunity. All rights reserved.
            </div>
        </footer>
    );
}
