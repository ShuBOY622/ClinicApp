import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/dashboardService';

const Dashboard = () => {
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
        return <div className="p-6">Loading dashboard...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-medium text-slate-700">Total Patients</h3>
                    <p className="text-3xl font-bold text-primary mt-2">{stats.totalPatients}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-medium text-slate-700">Today's Appointments</h3>
                    <p className="text-3xl font-bold text-accent mt-2">{stats.todayAppointments}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-lg font-medium text-slate-700">Pending Follow-ups</h3>
                    <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingFollowUps}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
