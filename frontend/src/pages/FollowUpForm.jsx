import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createFollowUp, updateFollowUpStatus, getFollowUpsByPatient } from '../services/followUpService';
import { getPatientById } from '../services/patientService';
import { FaArrowLeft, FaSave, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';

const FollowUpForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientIdParam = searchParams.get('patientId');
    const isEditMode = !!id;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [patientName, setPatientName] = useState('');

    // Get current date-time in local timezone for min attribute
    const getCurrentDateTime = () => {
        const now = new Date();
        // Format: YYYY-MM-DDTHH:MM
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEditMode) {
                    const response = await api.get(`/follow-ups/${id}`);
                    const followUp = response.data;
                    Object.keys(followUp).forEach(key => {
                        if (key === 'followUpDate') {
                            // Convert to datetime-local format
                            const date = new Date(followUp[key]);
                            const formattedDate = date.toISOString().slice(0, 16);
                            setValue(key, formattedDate);
                        } else {
                            setValue(key, followUp[key]);
                        }
                    });
                    if (followUp.patientId) {
                        const patientResponse = await getPatientById(followUp.patientId);
                        setPatientName(`${patientResponse.data.firstName} ${patientResponse.data.lastName}`);
                    }
                } else if (patientIdParam) {
                    setValue('patientId', patientIdParam);
                    const patientResponse = await getPatientById(patientIdParam);
                    setPatientName(`${patientResponse.data.firstName} ${patientResponse.data.lastName}`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id, isEditMode, patientIdParam, setValue]);

    const onSubmit = async (data) => {
        // Additional validation: Check if date is in the past
        const selectedDate = new Date(data.followUpDate);
        const now = new Date();

        if (selectedDate < now) {
            alert('Follow-up date cannot be in the past. Please select a future date and time.');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...data };
            if (patientIdParam) {
                payload.patientId = parseInt(patientIdParam);
            }

            if (isEditMode) {
                await api.put(`/follow-ups/${id}`, payload);
            } else {
                await createFollowUp(payload);
            }
            navigate(-1);
        } catch (error) {
            console.error('Error saving follow-up:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save follow-up.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 mr-4">
                        <FaArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                        {isEditMode ? 'Edit Follow-up' : 'New Follow-up'}
                    </h2>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-6">
                {patientName && (
                    <div className="mb-6 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl border border-sky-200">
                        <p className="text-xs text-slate-500 mb-1">Patient</p>
                        <p className="font-bold text-slate-900 text-lg">{patientName}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <input type="hidden" {...register('patientId')} />

                    {/* Date & Time with Validation */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <FaCalendarAlt className="text-sky-600" />
                            Follow-up Date & Time
                        </label>
                        <input
                            type="datetime-local"
                            {...register('followUpDate', {
                                required: 'Date and time is required',
                                validate: (value) => {
                                    const selectedDate = new Date(value);
                                    const now = new Date();
                                    if (selectedDate < now) {
                                        return 'Follow-up date must be in the future';
                                    }
                                    return true;
                                }
                            })}
                            min={getCurrentDateTime()}
                            className={`mt-1 block w-full rounded-xl shadow-sm p-3 border-2 transition-all ${errors.followUpDate
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-200'
                                } focus:ring focus:ring-opacity-50`}
                        />
                        {errors.followUpDate && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{errors.followUpDate.message}</p>
                            </div>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                            ℹ️ Select a future date and time for the follow-up appointment
                        </p>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                        <textarea
                            {...register('reason', { required: 'Reason is required' })}
                            rows="3"
                            className={`mt-1 block w-full rounded-xl shadow-sm p-3 border-2 transition-all ${errors.reason
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                    : 'border-slate-300 focus:border-sky-500 focus:ring-sky-200'
                                } focus:ring focus:ring-opacity-50`}
                            placeholder="e.g. Routine Checkup, Vaccination, Review Test Results"
                        ></textarea>
                        {errors.reason && (
                            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{errors.reason.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                        <select
                            {...register('status')}
                            defaultValue="PENDING"
                            className="mt-1 block w-full rounded-xl border-2 border-slate-300 shadow-sm focus:border-sky-500 focus:ring focus:ring-sky-200 focus:ring-opacity-50 p-3"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="MISSED">Missed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-white text-slate-700 px-6 py-3 rounded-xl border-2 border-slate-300 hover:bg-slate-50 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSave />
                            {loading ? 'Saving...' : 'Save Follow-up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FollowUpForm;
