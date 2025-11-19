import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createDietPlan, updateDietPlan, getDietPlanById } from '../services/dietPlanService';
import { getPatientById } from '../services/patientService';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const DietPlanForm = () => {
    const { id } = useParams();
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
                    const response = await getDietPlanById(id);
                    const dietPlan = response.data;
                    Object.keys(dietPlan).forEach(key => {
                        setValue(key, dietPlan[key]);
                    });
                    // Fetch patient name for display
                    if (dietPlan.patientId) {
                        const patientResponse = await getPatientById(dietPlan.patientId);
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

            if (isEditMode) {
                await updateDietPlan(id, payload);
            } else {
                await createDietPlan(payload);
            }
            navigate(-1); // Go back to previous page (likely Patient Details)
        } catch (error) {
            console.error('Error saving diet plan:', error);
            alert('Failed to save diet plan.');
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
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Diet Plan' : 'New Diet Plan'}</h2>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Start Date</label>
                            <input
                                type="date"
                                {...register('startDate', { required: 'Start date is required' })}
                                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${errors.startDate ? 'border-red-500' : 'border-slate-300'} focus:border-primary focus:ring focus:ring-primary/20`}
                            />
                            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">End Date</label>
                            <input
                                type="date"
                                {...register('endDate', { required: 'End date is required' })}
                                className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${errors.endDate ? 'border-red-500' : 'border-slate-300'} focus:border-primary focus:ring focus:ring-primary/20`}
                            />
                            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Breakfast</label>
                        <textarea
                            {...register('breakfast')}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            placeholder="e.g. Oatmeal with fruits, Green Tea"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Lunch</label>
                        <textarea
                            {...register('lunch')}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            placeholder="e.g. Grilled Chicken Salad, Brown Rice"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Dinner</label>
                        <textarea
                            {...register('dinner')}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            placeholder="e.g. Vegetable Soup, Whole Wheat Toast"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Special Instructions</label>
                        <textarea
                            {...register('instructions')}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            placeholder="e.g. Drink 3 liters of water daily, Avoid sugar"
                        ></textarea>
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
                            <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Diet Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DietPlanForm;
