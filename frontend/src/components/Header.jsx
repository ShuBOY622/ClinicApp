import { FaBell, FaUserCircle } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-slate-800">Clinic Management System</h1>
            <div className="flex items-center space-x-4">
                <button className="text-slate-500 hover:text-slate-700 transition-colors">
                    <FaBell className="h-6 w-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <FaUserCircle className="h-8 w-8 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Dr. Smith</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
