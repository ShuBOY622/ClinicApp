import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createFollowUp, updateFollowUpStatus, getFollowUpsByPatient } from '../services/followUpService'; // Check if getFollowUpById exists or if we need to fetch differently
import { getPatientById } from '../services/patientService';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import api from '../services/api'; // Direct api call if getFollowUpById is missing in service

const FollowUpForm = () => {
    const { id } = useParams(); // FollowUp ID if editing
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientIdParam = searchParams.get('patientId');
    const isEditMode = !!id;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEditMode) {
                    // Assuming we have a getFollowUpById in service, if not we might need to add it or use direct api
                    // The controller has @GetMapping("/{id}") so we can call it.
                    const response = await api.get(`/follow-ups/${id}`);
                    const followUp = response.data;
                    Object.keys(followUp).forEach(key => {
                        setValue(key, followUp[key]);
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
        setLoading(true);
        try {
            const payload = { ...data };
            if (patientIdParam) {
                payload.patientId = parseInt(patientIdParam);
            }

            // Ensure date is in correct format if needed, but input type="datetime-local" returns ISO string usually

            if (isEditMode) {
                // Update logic - usually we might just update status or reason/date
                // The service updateFollowUpStatus is for status only. 
                // We might need a general update endpoint if we want to change date/reason.
                // Controller has @PutMapping("/{id}") which takes FollowUpDTO, so we can update everything.
                await api.put(`/follow-ups/${id}`, payload);
            } else {
                await createFollowUp(payload);
            }
            navigate(-1);
        } catch (error) {
            console.error('Error saving follow-up:', error);
            alert('Failed to save follow-up.');
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
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Follow-up' : 'New Follow-up'}</h2>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                {patientName && (
                    <div className="mb-6 p-4 bg-slate-50 rounded-md border border-slate-200">
                        <p className="text-sm text-slate-500">Patient</p>
                        <p className="font-bold text-slate-900">{patientName}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <input type="hidden" {...register('patientId')} />

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Follow-up Date & Time</label>
                        <input
                            type="datetime-local"
                            {...register('followUpDate', { required: 'Date and time is required' })}
                            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${errors.followUpDate ? 'border-red-500' : 'border-slate-300'} focus:border-primary focus:ring focus:ring-primary/20`}
                        />
                        {errors.followUpDate && <p className="text-red-500 text-xs mt-1">{errors.followUpDate.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Reason</label>
                        <textarea
                            {...register('reason', { required: 'Reason is required' })}
                            rows="3"
                            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${errors.reason ? 'border-red-500' : 'border-slate-300'} focus:border-primary focus:ring focus:ring-primary/20`}
                            placeholder="e.g. Routine Checkup, Vaccination"
                        ></textarea>
                        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <select
                            {...register('status')}
                            defaultValue="PENDING"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="MISSED">Missed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-white text-slate-700 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50 mr-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors flex items-center disabled:opacity-50"
                        >
                            <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Follow-up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FollowUpForm;
