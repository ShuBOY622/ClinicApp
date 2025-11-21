import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';
import { FaUserInjured, FaCalendarCheck, FaClipboardList } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        pendingFollowUps: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-lg text-slate-600">{t('common.loading')}</div>
            </div>
        );
    }

    const statCards = [
        {
            title: t('dashboard.totalPatients'),
            value: stats.totalPatients,
            icon: FaUserInjured,
            gradient: 'from-sky-500 to-blue-600',
            bgGradient: 'from-sky-50 to-blue-50',
            iconBg: 'from-sky-100 to-blue-100',
            textColor: 'text-sky-600'
        },
        {
            title: t('dashboard.todayAppointments'),
            value: stats.todayAppointments,
            icon: FaCalendarCheck,
            gradient: 'from-emerald-500 to-teal-600',
            bgGradient: 'from-emerald-50 to-teal-50',
            iconBg: 'from-emerald-100 to-teal-100',
            textColor: 'text-emerald-600'
        },
        {
            title: t('dashboard.pendingFollowUps'),
            value: stats.pendingFollowUps,
            icon: FaClipboardList,
            gradient: 'from-orange-500 to-amber-600',
            bgGradient: 'from-orange-50 to-amber-50',
            iconBg: 'from-orange-100 to-amber-100',
            textColor: 'text-orange-600'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {t('dashboard.title')}
                </h2>
                <p className="text-slate-600">{t('dashboard.welcome')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className={`bg-gradient-to-br ${card.bgGradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-700">{card.title}</h3>
                            <div className={`bg-gradient-to-br ${card.iconBg} p-3 rounded-xl`}>
                                <card.icon className={`h-6 w-6 ${card.textColor}`} />
                            </div>
                        </div>
                        <p className={`text-4xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                            {card.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('dashboard.quickActions')}</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-sky-700 font-medium transition-all duration-200 hover:shadow-md">
                            {t('dashboard.addPatient')}
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 font-medium transition-all duration-200 hover:shadow-md">
                            {t('dashboard.createPrescription')}
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-700 font-medium transition-all duration-200 hover:shadow-md">
                            {t('dashboard.scheduleFollowUp')}
                        </button>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('dashboard.recentActivity')}</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                        <p className="flex items-center">
                            <span className="w-2 h-2 bg-sky-500 rounded-full mr-3"></span>
                            System ready for patient management
                        </p>
                        <p className="flex items-center">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                            All services operational
                        </p>
                        <p className="flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                            Database connected successfully
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
