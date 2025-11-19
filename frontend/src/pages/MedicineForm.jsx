import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createMedicine, updateMedicine, getMedicineById } from '../services/medicineService';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const MedicineForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchMedicine = async () => {
                try {
                    const response = await getMedicineById(id);
                    const medicine = response.data;
                    Object.keys(medicine).forEach(key => {
                        setValue(key, medicine[key]);
                    });
                } catch (error) {
                    console.error('Error fetching medicine:', error);
                }
            };
            fetchMedicine();
        }
    }, [id, isEditMode, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                await updateMedicine(id, data);
            } else {
                await createMedicine(data);
            }
            navigate('/medicines');
        } catch (error) {
            console.error('Error saving medicine:', error);
            alert('Failed to save medicine.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link to="/medicines" className="text-slate-500 hover:text-slate-700 mr-4">
                        <FaArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Medicine' : 'Add New Medicine'}</h2>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Medicine Name *</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Medicine name is required' })}
                                className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Generic Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Generic Name</label>
                            <input
                                type="text"
                                {...register('genericName')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Category</label>
                            <select
                                {...register('category')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            >
                                <option value="">Select Category</option>
                                <option value="Antibiotic">Antibiotic</option>
                                <option value="Painkiller">Painkiller</option>
                                <option value="Vitamin">Vitamin</option>
                                <option value="Antihistamine">Antihistamine</option>
                                <option value="Cardiovascular">Cardiovascular</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Form Type */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Form Type</label>
                            <select
                                {...register('formType')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            >
                                <option value="">Select Form</option>
                                <option value="Tablet">Tablet</option>
                                <option value="Syrup">Syrup</option>
                                <option value="Injection">Injection</option>
                                <option value="Capsule">Capsule</option>
                                <option value="Cream">Cream</option>
                                <option value="Drops">Drops</option>
                            </select>
                        </div>

                        {/* Dosage */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Dosage</label>
                            <input
                                type="text"
                                {...register('dosage')}
                                placeholder="e.g., 500mg, 10ml"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>

                        {/* Manufacturer */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Manufacturer</label>
                            <input
                                type="text"
                                {...register('manufacturer')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price', { min: 0 })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Stock Quantity</label>
                            <input
                                type="number"
                                {...register('stockQuantity', { min: 0 })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Expiry Date</label>
                            <input
                                type="date"
                                {...register('expiryDate')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/medicines')}
                            className="bg-white text-slate-700 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50 mr-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors flex items-center disabled:opacity-50"
                        >
                            <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Medicine'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicineForm;
