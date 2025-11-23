import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTodayFollowUps, getFollowUps, updateFollowUpStatus, sendReminder } from '../services/followUpService';
import { FaCheckCircle, FaClock, FaCalendarCheck, FaUser, FaPhone, FaPlus, FaCalendarAlt, FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const FollowUpList = () => {
    const { t } = useTranslation();
    const [todayFollowUps, setTodayFollowUps] = useState([]);
    const [allFollowUps, setAllFollowUps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('today'); // 'today' or 'all'
    const [sendingReminder, setSendingReminder] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

    const handleSendReminder = async (followUpId) => {
        setSendingReminder(followUpId);
        try {
            await sendReminder(followUpId);
            showToast('WhatsApp reminder sent successfully!', 'success');
            fetchFollowUps();
        } catch (error) {
            console.error('Error sending reminder:', error);
            const errorMsg = error.response?.data?.message || 'Failed to send reminder';
            showToast(errorMsg, 'error');
        } finally {
            setSendingReminder(null);
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
    };

    const getStatusConfig = (status) => {
        const configs = {
            'Completed': {
                bg: 'from-green-500 to-emerald-600',
                badge: 'bg-green-100 text-green-800',
                icon: FaCheckCircle,
            },
            'Pending': {
                bg: 'from-yellow-500 to-orange-600',
                badge: 'bg-yellow-100 text-yellow-800',
                icon: FaClock,
            },
            'Missed': {
                bg: 'from-red-500 to-pink-600',
                badge: 'bg-red-100 text-red-800',
                icon: FaClock,
            },
        };
        return configs[status] || configs['Pending'];
    };

    const renderList = (list) => {
        if (list.length === 0) {
            return (
                <div className="text-center py-20">
                    <FaCalendarCheck className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg">{t('followUp.noFollowUps')}</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((followUp) => {
                    const statusConfig = getStatusConfig(followUp.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <div
                            key={followUp.id}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                        >
                            {/* Card Header */}
                            <div className={`bg-gradient-to-r ${statusConfig.bg} p-4`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-white mb-2">
                                            <FaUser className="text-white/80" />
                                            <h3 className="font-bold text-lg">
                                                {followUp.patientName || `Patient ID: ${followUp.patientId}`}
                                            </h3>
                                        </div>
                                        {followUp.patientPhone && (
                                            <div className="flex items-center gap-2 text-white/90 text-sm">
                                                <FaPhone className="text-white/70" />
                                                <span>{followUp.patientPhone}</span>
                                            </div>
                                        )}
                                    </div>
                                    <StatusIcon className="text-white/80 text-2xl" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-4">
                                {/* Date & Time */}
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl">
                                        <FaCalendarAlt className="text-sky-600 text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Follow-up Date</p>
                                        <p className="font-semibold text-slate-900">
                                            {new Date(followUp.followUpDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-slate-600">
                                            {new Date(followUp.followUpDate).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Reason */}
                                <div className="bg-gradient-to-br from-slate-50 to-sky-50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Reason</p>
                                    <p className="text-sm text-slate-700 font-medium">{followUp.reason}</p>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.badge}`}>
                                        {followUp.status}
                                    </span>
                                    {followUp.reminderStatus === 'SENT' && (
                                        <span className="text-xs text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                            <FaCheckCircle className="text-green-500" />
                                            Reminder Sent
                                        </span>
                                    )}
                                    {followUp.reminderStatus === 'FAILED' && (
                                        <span className="text-xs text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-full" title={followUp.reminderError}>
                                            Failed
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer */}
                            {followUp.status !== 'Completed' && (
                                <div className="px-4 pb-4 space-y-2">
                                    <button
                                        onClick={() => handleStatusChange(followUp.id, 'Completed')}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
                                    >
                                        <FaCheckCircle /> {t('followUp.markCompleted')}
                                    </button>
                                    <button
                                        onClick={() => handleSendReminder(followUp.id)}
                                        disabled={sendingReminder === followUp.id}
                                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sendingReminder === followUp.id ? (
                                            <>
                                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaWhatsapp className="text-lg" /> Send WhatsApp Reminder
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                        {t('followUp.title')}
                    </h2>
                    <p className="text-slate-600 mt-1">Track and manage patient follow-ups</p>
                </div>
                <Link
                    to="/follow-ups/new"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
                >
                    <FaPlus /> Add Follow-up
                </Link>
            </div>

            {/* View Toggle */}
            <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-sky-200">
                <div className="flex gap-4">
                    <button
                        onClick={() => setView('today')}
                        className={`flex-1 px-6 py-4 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${view === 'today'
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105'
                            : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white border border-slate-200'
                            }`}
                    >
                        <FaClock className="text-lg" />
                        <div className="text-left">
                            <div className="text-sm">{t('followUp.todayFollowUps')}</div>
                            {view === 'today' && (
                                <div className="text-xs opacity-90">{todayFollowUps.length} appointments</div>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setView('all')}
                        className={`flex-1 px-6 py-4 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${view === 'all'
                            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105'
                            : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white border border-slate-200'
                            }`}
                    >
                        <FaCalendarCheck className="text-lg" />
                        <div className="text-left">
                            <div className="text-sm">{t('followUp.allFollowUps')}</div>
                            {view === 'all' && (
                                <div className="text-xs opacity-90">{allFollowUps.length} total</div>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20 text-slate-600">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
                    <p className="mt-4">{t('common.loading')}</p>
                </div>
            ) : (
                renderList(view === 'today' ? todayFollowUps : allFollowUps)
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50 ${toast.type === 'success'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                    }`}>
                    {toast.type === 'success' ? (
                        <FaCheckCircle className="text-2xl" />
                    ) : (
                        <FaClock className="text-2xl" />
                    )}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}
        </div>

    );
};

export default FollowUpList;
