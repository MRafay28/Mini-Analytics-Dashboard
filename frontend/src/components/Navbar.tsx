import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left section */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">Blog Analytics</h1>
                    </div>

                    {/* Desktop menu */}
                    {user && (
                        <div className="hidden sm:ml-6 sm:flex justify-center items-center sm:space-x-8">
                            <Link
                                to="/"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 border-b-2 font-medium text-sm"
                            >
                                Posts
                            </Link>
                            <Link
                                to="/add"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 border-b-2 font-medium text-sm"
                            >
                                Add Post
                            </Link>
                            <Link
                                to="/analytics"
                                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 py-2 px-1 border-b-2 font-medium text-sm"
                            >
                                Analytics
                            </Link>
                        </div>
                    )}

                    {/* Right section */}
                    <div className="flex items-center">
                        {user ? (
                            <div className="hidden sm:flex items-center space-x-4">
                                <span className="text-sm text-gray-700">Welcome, {user.username}</span>
                                <button
                                    onClick={logout}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center space-x-4">
                                <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                                    Login
                                </Link>
                                <Link to="/signup" className="text-sm text-indigo-600 hover:text-indigo-500">
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu toggle button */}
                        <button
                            className="sm:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-t border-gray-200 p-4 space-y-2">
                    {user && (
                        <>
                            <Link to="/" className="block text-gray-700 hover:text-gray-900">
                                Posts
                            </Link>
                            <Link to="/add" className="block text-gray-700 hover:text-gray-900">
                                Add Post
                            </Link>
                            <Link to="/analytics" className="block text-gray-700 hover:text-gray-900">
                                Analytics
                            </Link>
                        </>
                    )}
                    {user ? (
                        <button
                            onClick={logout}
                            className="block w-full text-left text-gray-700 hover:text-gray-900"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="block text-gray-700 hover:text-gray-900">
                                Login
                            </Link>
                            <Link to="/signup" className="block text-indigo-600 hover:text-indigo-500">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
