import { Link, useLocation } from 'react-router-dom';
import { FaUserInjured, FaPills, FaFilePrescription, FaCalendarAlt, FaHome, FaStethoscope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const navItems = [
        { path: '/dashboard', label: t('nav.dashboard'), icon: FaHome },
        { path: '/patients', label: t('nav.patients'), icon: FaUserInjured },
        { path: '/medicines', label: t('nav.medicines'), icon: FaPills },
        { path: '/prescriptions', label: t('nav.prescriptions'), icon: FaFilePrescription },
        { path: '/follow-ups', label: t('nav.followUps'), icon: FaCalendarAlt },
    ];

    return (
        <div className="flex flex-col w-64 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 h-full shadow-lg">
            <div className="flex items-center justify-center h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2 rounded-lg">
                        <FaStethoscope className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                        ClinicApp
                    </span>
                </div>
            </div>
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-2 px-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={clsx(
                                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                                    location.pathname.startsWith(item.path)
                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200 transform scale-105'
                                        : 'text-slate-600 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-700 hover:shadow-md'
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
