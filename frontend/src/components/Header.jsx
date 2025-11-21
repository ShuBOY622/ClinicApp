import { useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import LanguageToggle from './LanguageToggle';

const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Dr. Ramesh Tarakh Clinic
            </h1>
            <div className="flex items-center space-x-4">
                <LanguageToggle />
                <button className="text-slate-500 hover:text-slate-700 transition-colors">
                    <FaBell className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <FaUserCircle className="h-8 w-8 text-sky-600" />
                    <span className="text-sm font-medium text-slate-700">{user.username || 'Doctor'}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
                >
                    <FaSignOutAlt className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
