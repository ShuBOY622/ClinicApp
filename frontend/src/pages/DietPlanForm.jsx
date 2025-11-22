import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createDietPlan, updateDietPlan, getDietPlanById } from '../services/dietPlanService';
import { getPatientById } from '../services/patientService';
import { FaArrowLeft, FaSave, FaCalendarAlt } from 'react-icons/fa';

const DietPlanForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientIdParam = searchParams.get('patientId');
    const isEditMode = !!id;

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [activeDay, setActiveDay] = useState('monday');

    const days = [
        { id: 'monday', label: 'Monday', marathi: 'सोमवार' },
        { id: 'tuesday', label: 'Tuesday', marathi: 'मंगळवार' },
        { id: 'wednesday', label: 'Wednesday', marathi: 'बुधवार' },
        { id: 'thursday', label: 'Thursday', marathi: 'गुरुवार' },
        { id: 'friday', label: 'Friday', marathi: 'शुक्रवार' },
        { id: 'saturday', label: 'Saturday', marathi: 'शनिवार' },
        { id: 'sunday', label: 'Sunday', marathi: 'रविवार' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isEditMode) {
                    const response = await getDietPlanById(id);
                    const dietPlan = response.data;

                    // Set basic fields
                    setValue('startDate', dietPlan.startDate);
                    setValue('endDate', dietPlan.endDate);
                    setValue('instructions', dietPlan.instructions);
                    setValue('patientId', dietPlan.patientId);

                    // Parse and set weekly plan data
                    if (dietPlan.weeklyPlanJson) {
                        const weeklyPlan = JSON.parse(dietPlan.weeklyPlanJson);
                        Object.keys(weeklyPlan).forEach(day => {
                            const dayData = weeklyPlan[day];
                            Object.keys(dayData).forEach(slot => {
                                const slotData = dayData[slot];
                                Object.keys(slotData).forEach(field => {
                                    setValue(`weeklyPlan.${day}.${slot}.${field}`, slotData[field]);
                                });
                            });
                        });
                    }

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
            // Structure the weekly plan data
            const weeklyPlan = {};
            days.forEach(day => {
                weeklyPlan[day.id] = {
                    slot1: data.weeklyPlan?.[day.id]?.slot1 || {},
                    slot2: data.weeklyPlan?.[day.id]?.slot2 || {},
                    slot3: data.weeklyPlan?.[day.id]?.slot3 || {},
                    slot4: data.weeklyPlan?.[day.id]?.slot4 || {},
                    slot5: data.weeklyPlan?.[day.id]?.slot5 || {}
                };
            });

            const payload = {
                patientId: parseInt(data.patientId),
                startDate: data.startDate,
                endDate: data.endDate,
                instructions: data.instructions,
                weeklyPlanJson: JSON.stringify(weeklyPlan),
                // Keep these for backward compatibility if needed, or send empty
                breakfast: '',
                lunch: '',
                dinner: ''
            };

            if (isEditMode) {
                await updateDietPlan(id, payload);
            } else {
                await createDietPlan(payload);
            }
            navigate(-1);
        } catch (error) {
            console.error('Error saving diet plan:', error);
            alert('Failed to save diet plan.');
        } finally {
            setLoading(false);
        }
    };

    const copyToAllDays = (currentDayId) => {
        if (!window.confirm(`Copy ${currentDayId}'s plan to all other days? This will overwrite existing data.`)) return;

        const currentDayData = watch(`weeklyPlan.${currentDayId}`);
        days.forEach(day => {
            if (day.id !== currentDayId) {
                setValue(`weeklyPlan.${day.id}`, currentDayData);
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 mr-4">
                        <FaArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Weekly Diet Plan' : 'New Weekly Diet Plan'}</h2>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {patientName && (
                    <div className="p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <FaCalendarAlt /> Patient
                        </div>
                        <p className="font-bold text-slate-900 text-lg">{patientName}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <input type="hidden" {...register('patientId')} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                {...register('startDate', { required: 'Start date is required' })}
                                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                            />
                            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                            <input
                                type="date"
                                {...register('endDate', { required: 'End date is required' })}
                                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                            />
                            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
                        </div>
                    </div>

                    {/* Day Tabs */}
                    <div className="flex overflow-x-auto border-b border-slate-200 mb-6 gap-1 pb-1">
                        {days.map(day => (
                            <button
                                key={day.id}
                                type="button"
                                onClick={() => setActiveDay(day.id)}
                                className={`px-4 py-2 rounded-t-lg font-medium text-sm whitespace-nowrap transition-colors ${activeDay === day.id
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {day.label} ({day.marathi})
                            </button>
                        ))}
                    </div>

                    {/* Day Content */}
                    <div className="space-y-8">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => copyToAllDays(activeDay)}
                                className="text-sm text-primary hover:text-primary-dark font-medium"
                            >
                                Copy {days.find(d => d.id === activeDay)?.label}'s plan to all days
                            </button>
                        </div>

                        {/* Slot 1: Morning 6 AM */}
                        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                            <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                                <span className="bg-orange-200 text-orange-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                सकाळी – ६ वाजता (Morning – 6 AM)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Input label="वेळ / Time" name={`weeklyPlan.${activeDay}.slot1.time`} register={register} />
                                <Input label="पेयाचे नाव / Drink name" name={`weeklyPlan.${activeDay}.slot1.drinkName`} register={register} />
                                <Input label="मात्रा (मिली/ग्रॅम) / Quantity" name={`weeklyPlan.${activeDay}.slot1.quantity`} register={register} />
                                <Input label="अतिरिक्त घटक / Additional ingredients" name={`weeklyPlan.${activeDay}.slot1.additional`} register={register} />
                                <Input label="तूप (ग्रॅम) / Ghee (g)" name={`weeklyPlan.${activeDay}.slot1.ghee`} register={register} />
                            </div>
                        </div>

                        {/* Slot 2: Morning 8 AM */}
                        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                            <h3 className="font-bold text-yellow-800 mb-4 flex items-center gap-2">
                                <span className="bg-yellow-200 text-yellow-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                सकाळी – ८ वाजता (Morning – 8 AM)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Input label="वेळ / Time" name={`weeklyPlan.${activeDay}.slot2.time`} register={register} />
                                <Input label="पाणी (मिली) / Water (ml)" name={`weeklyPlan.${activeDay}.slot2.water`} register={register} />
                                <div className="col-span-2">
                                    <Input label="मिश्रित पेय सूचना / Instructions" name={`weeklyPlan.${activeDay}.slot2.instructions`} register={register} />
                                </div>
                                <Input label="पदार्थ १ नाव / Item 1 Name" name={`weeklyPlan.${activeDay}.slot2.item1Name`} register={register} />
                                <Input label="पदार्थ १ मात्रा / Item 1 Qty" name={`weeklyPlan.${activeDay}.slot2.item1Qty`} register={register} />
                                <Input label="पदार्थ २ नाव / Item 2 Name" name={`weeklyPlan.${activeDay}.slot2.item2Name`} register={register} />
                                <Input label="पदार्थ २ मात्रा / Item 2 Qty" name={`weeklyPlan.${activeDay}.slot2.item2Qty`} register={register} />
                                <Input label="पदार्थ ३ नाव / Item 3 Name" name={`weeklyPlan.${activeDay}.slot2.item3Name`} register={register} />
                                <Input label="पदार्थ ३ मात्रा / Item 3 Qty" name={`weeklyPlan.${activeDay}.slot2.item3Qty`} register={register} />
                            </div>
                        </div>

                        {/* Slot 3: Afternoon 12 PM */}
                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                                <span className="bg-green-200 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                दुपारी – १२ वाजता (Afternoon – 12 PM)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Input label="वेळ / Time" name={`weeklyPlan.${activeDay}.slot3.time`} register={register} />
                                <Input label="भाकरी प्रकार / Roti type" name={`weeklyPlan.${activeDay}.slot3.rotiType`} register={register} />
                                <Input label="भाकरी संख्या / No. of rotis" name={`weeklyPlan.${activeDay}.slot3.rotiCount`} register={register} />
                                <Input label="पीठ (ग्रॅम) / Flour (g)" name={`weeklyPlan.${activeDay}.slot3.flourQty`} register={register} />
                                <Input label="उसळ / Curry (g)" name={`weeklyPlan.${activeDay}.slot3.sabjiQty`} register={register} />
                                <Input label="दही मात्रा / Curd" name={`weeklyPlan.${activeDay}.slot3.curdQty`} register={register} />
                                <Input label="भाजी नाव / Veg Name" name={`weeklyPlan.${activeDay}.slot3.vegName`} register={register} />
                                <Input label="भाजी मात्रा / Veg Qty" name={`weeklyPlan.${activeDay}.slot3.vegQty`} register={register} />
                            </div>
                        </div>

                        {/* Slot 4: Evening 4 PM */}
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                                <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                                सायंकाळी – ४ वाजता (Evening – 4 PM)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input label="वेळ / Time" name={`weeklyPlan.${activeDay}.slot4.time`} register={register} />
                                <Input label="पेयाचे नाव / Drink name" name={`weeklyPlan.${activeDay}.slot4.drinkName`} register={register} />
                                <Input label="पेय मात्रा (मिली) / Quantity" name={`weeklyPlan.${activeDay}.slot4.drinkQty`} register={register} />
                            </div>
                        </div>

                        {/* Slot 5: Night 8 PM */}
                        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                            <h3 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
                                <span className="bg-indigo-200 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
                                रात्री – ८ वाजता (Night – 8 PM)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Input label="वेळ / Time" name={`weeklyPlan.${activeDay}.slot5.time`} register={register} />
                                <Input label="भाकरी प्रकार / Roti type" name={`weeklyPlan.${activeDay}.slot5.rotiType`} register={register} />
                                <Input label="भाकरी संख्या / No. of rotis" name={`weeklyPlan.${activeDay}.slot5.rotiCount`} register={register} />
                                <Input label="मूग डाळ / Moong dal (g)" name={`weeklyPlan.${activeDay}.slot5.moongDalQty`} register={register} />
                                <Input label="डाळ-पालक / Dal-Palak (g)" name={`weeklyPlan.${activeDay}.slot5.dalPalakQty`} register={register} />
                                <div className="lg:col-span-3">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">कच्ची सलाड भाजी / Raw salad items</label>
                                    <textarea
                                        {...register(`weeklyPlan.${activeDay}.slot5.salad`)}
                                        rows="2"
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <label className="block text-sm font-medium text-slate-700 mb-1">General Instructions</label>
                        <textarea
                            {...register('instructions')}
                            rows="4"
                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20"
                            placeholder="General instructions applicable for the entire week..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="bg-white text-slate-700 px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 mr-4 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-8 py-2.5 rounded-lg hover:bg-sky-600 transition-colors flex items-center disabled:opacity-50 font-medium shadow-sm hover:shadow"
                        >
                            <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Diet Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Input = ({ label, name, register }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
        <input
            type="text"
            {...register(name)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 text-sm"
        />
    </div>
);

export default DietPlanForm;
