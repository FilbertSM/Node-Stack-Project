import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null); // State untuk menyimpan data pengguna
    const navigate = useNavigate();

    // Mengambil data profil pengguna saat komponen dimuat
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/users/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include' // Ini sudah benar
                });

                if (!res.ok) {
                    let errorMessage = 'Failed to fetch user profile.';
                    // Try to read the error message from the backend's JSON response
                    try {
                        const errorData = await res.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (jsonError) {
                        // If response is not JSON (e.g., HTML error page), log the raw response
                        console.error("Error parsing user profile fetch error (non-JSON response). Raw response likely HTML:", jsonError);
                        const rawResponseText = await res.text(); // Read raw text for debugging
                        console.error("Raw response from /api/users/profile:", rawResponseText);
                        errorMessage = `Server responded with status ${res.status}. ${errorMessage}`;
                    }

                    // If it's a 401, it means unauthenticated. Clear user data and potentially redirect.
                    if (res.status === 401) {
                        console.log("User not authenticated or session expired. Clearing user data.");
                        setUser(null); // Clear user state
                        // Optionally, navigate to login if profile fetch fails due to auth
                        // navigate('/login'); // Uncomment if you want immediate redirect
                    }
                    throw new Error(errorMessage); // Throw error to be caught by outer catch
                }

                const userData = await res.json();
                console.log("User Profile Data (success):", userData);
                setUser(userData); // <--- FIX: Set the user state here!
                return userData; // Return the data (though not used by useEffect directly)
            } catch (error) {
                console.error("Failed to fetch user profile (caught error):", error.message);
                setUser(null); // Ensure user is null on any error
                // You might want to add a more user-friendly notification here.
            }
        };

        fetchUserProfile();
    }, [navigate]); // navigate as a dependency, though it's stable

    // Fungsi untuk menangani proses logout
    const handleLogout = async () => {
        try {
            // Memanggil endpoint logout di backend untuk menghapus cookie token
            // IMPORTANT: Add credentials: 'include' for logout as well!
            const res = await fetch('http://localhost:3000/api/users/logout', { // Use absolute URL for consistency
                method: 'POST',
                credentials: 'include' // <--- ADD THIS HERE for logout
            });

            if (!res.ok) {
                let errorMessage = 'Logout failed.';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error("Error parsing logout response (non-JSON response):", jsonError);
                    errorMessage = `Server responded with status ${res.status}. ${errorMessage}`;
                }
                throw new Error(errorMessage);
            }
            console.log("Logout successful on backend.");

        } catch (error) {
            console.error('Logout failed:', error.message);
            // Even if backend logout failed, try to clear client state
        } finally {
            setUser(null); // Clear user state on frontend
            // Arahkan pengguna ke halaman login setelah logout
            navigate('/login');
        }
    };

    return (
        <div>
            <nav className="bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-600">
                <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logo} className="h-8" alt="Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">DoNote</span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm px-4 py-2 text-center transition"
                        >
                            Logout
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                            aria-controls="navbar-sticky"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className={`${menuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-700 rounded-lg bg-gray-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-900">
                            <li>
                                <Link to="/home" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-500 md:p-0" aria-current="page">Home</Link>
                            </li>
                            <li>
                                <Link to="/list" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-500 md:p-0">List</Link>
                            </li>
                            <li>
                                {/* Menampilkan nama pengguna jika sudah login */}
                                <Link to="/profile" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-500 md:p-0">
                                    {user ? user.username : 'Profile'}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;