import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer({ userType }) {
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendEmail = () => {
        const email = "support@example.com";
        const subject = "Feedback/Complaint";
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    return (
        <footer className="bg-red-600 text-white py-10 mt-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-black text-lg font-bold mb-5 underline">Page Links</h3>
                        <div className="flex flex-col space-y-2">
                            {userType === "admin" ? (
                                <>
                                    <NavLink to="/dashboard" className="hover:text-gray-300">Dashboard</NavLink>
                                    <NavLink to="/song" className="hover:text-gray-300">Song</NavLink>
                                    <NavLink to="/data" className="hover:text-gray-300">Data</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/home" className="hover:text-gray-300">Home</NavLink>
                                    <NavLink to="/playlist" className="hover:text-gray-300">Playlist</NavLink>
                                    <NavLink to="/upload" className="hover:text-gray-300">Upload</NavLink>
                                    <NavLink to="/search" className="hover:text-gray-300">Search</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                            <FontAwesomeIcon icon={faFacebook} className="h-9 w-9" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                            <FontAwesomeIcon icon={faTwitter} className="h-9 w-9" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                            <FontAwesomeIcon icon={faInstagram} className="h-9 w-9" />
                        </a>
                    </div>
                    <div className="w-full md:w-auto flex flex-col items-end mt-4 md:mt-0">
                        <textarea
                            value={message}
                            onChange={handleInputChange}
                            placeholder="Send us your feedback or complaint"
                            className="p-2 text-black rounded-md w-full md:w-64 mb-2 bg-gray-100"
                        />
                        <button onClick={handleSendEmail} className="bg-black text-red-600 hover:bg-white px-4 py-2">
                            Send
                        </button>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <p className="text-sm">&copy; 2024 Grooviex. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
