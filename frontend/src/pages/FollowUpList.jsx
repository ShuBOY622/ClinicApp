import { useState, useEffect } from 'react';
import { getTodayFollowUps, getFollowUps, updateFollowUpStatus } from '../services/followUpService';
import { FaCheckCircle, FaClock, FaCalendarCheck } from 'react-icons/fa';

const FollowUpList = () => {
    const [todayFollowUps, setTodayFollowUps] = useState([]);
    const [allFollowUps, setAllFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('today'); // 'today' or 'all'

    useEffect(() => {
        fetchFollowUps();
    }, [view]);

    const fetchFollowUps = async () => {
        setLoading(true);
        try {
            if (view === 'today') {
                const response = await getTodayFollowUps();
                setTodayFollowUps(response.data);
            } else {
                const response = await getFollowUps();
                setAllFollowUps(response.data.content);
            }
        } catch (error) {
            console.error('Error fetching follow-ups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateFollowUpStatus(id, newStatus);
            fetchFollowUps();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const renderList = (list) => {
        if (list.length === 0) {
            return <div className="text-center py-10 text-slate-500">No follow-ups found.</div>;
        }

        return (
            <div className="space-y-4">
                {list.map((followUp) => (
                    <div key={followUp.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-slate-900">
                                {followUp.patientName || `Patient ID: ${followUp.patientId}`}
                            </div>
                            <div className="text-sm text-slate-600">{followUp.reason}</div>
                            <div className="text-xs text-slate-500 flex items-center mt-1">
                                <FaCalendarCheck className="mr-1" /> {new Date(followUp.followUpDate).toLocaleDateString()}
                                <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${followUp.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        followUp.status === 'Missed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {followUp.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {followUp.status !== 'Completed' && (
                                <button
                                    onClick={() => handleStatusChange(followUp.id, 'Completed')}
                                    className="text-green-600 hover:bg-green-50 p-2 rounded-full"
                                    title="Mark as Completed"
                                >
                                    <FaCheckCircle size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Follow-ups</h2>
                <div className="flex bg-slate-100 p-1 rounded-md">
                    <button
                        onClick={() => setView('today')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'today' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setView('all')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'all' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        All Upcoming
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                renderList(view === 'today' ? todayFollowUps : allFollowUps)
            )}
        </div>
    );
};

export default FollowUpList;
