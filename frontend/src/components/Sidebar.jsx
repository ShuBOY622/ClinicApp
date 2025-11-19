import { Link, useLocation } from 'react-router-dom';
import { FaUserInjured, FaPills, FaFilePrescription, FaCalendarAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: FaHome },
        { path: '/patients', label: 'Patients', icon: FaUserInjured },
        { path: '/medicines', label: 'Medicines', icon: FaPills },
        { path: '/prescriptions', label: 'Prescriptions', icon: FaFilePrescription },
        { path: '/follow-ups', label: 'Follow-ups', icon: FaCalendarAlt },
    ];

    return (
        <div className="flex flex-col w-64 bg-white border-r border-slate-200 h-full">
            <div className="flex items-center justify-center h-16 border-b border-slate-200">
                <span className="text-2xl font-bold text-primary">ClinicApp</span>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={clsx(
                                    'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                                    location.pathname.startsWith(item.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-200">
                <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
                    <FaSignOutAlt className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
