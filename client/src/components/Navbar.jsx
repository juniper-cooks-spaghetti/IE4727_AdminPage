import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    
    // Function to check if the link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center space-x-3">
                        <span className="text-xl font-bold">CineBox AdminPage</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                                ${isActive('/') 
                                    ? 'bg-gray-700 text-white' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            Movies
                        </Link>
                        <Link
                            to="/add"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                                ${isActive('/add') 
                                    ? 'bg-gray-700 text-white' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            Add Movie
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;