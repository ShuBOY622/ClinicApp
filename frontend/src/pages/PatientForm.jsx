import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createPatient, updatePatient, getPatientById } from '../services/patientService';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const PatientForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchPatient = async () => {
                try {
                    const response = await getPatientById(id);
                    const patient = response.data;
                    Object.keys(patient).forEach(key => {
                        setValue(key, patient[key]);
                    });
                } catch (error) {
                    console.error('Error fetching patient:', error);
                }
            };
            fetchPatient();
        }
    }, [id, isEditMode, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isEditMode) {
                await updatePatient(id, data);
            } else {
                await createPatient(data);
            }
            navigate('/patients');
        } catch (error) {
            console.error('Error saving patient:', error);
            alert('Failed to save patient. Please check the inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link to="/patients" className="text-slate-500 hover:text-slate-700 mr-4">
                        <FaArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h2>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">First Name *</label>
                            <input
                                type="text"
                                {...register('firstName', { required: 'First name is required' })}
                                className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Last Name *</label>
                            <input
                                type="text"
                                {...register('lastName', { required: 'Last name is required' })}
                                className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border ${errors.lastName ? 'border-red-500' : ''}`}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Date of Birth *</label>
                            <input
                                type="date"
                                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                                className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                            />
                            {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Gender *</label>
                            <select
                                {...register('gender', { required: 'Gender is required' })}
                                className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border ${errors.gender ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Phone Number *</label>
                            <input
                                type="tel"
                                {...register('phone', { required: 'Phone number is required' })}
                                className={`mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                {...register('email')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Blood Group</label>
                            <select
                                {...register('bloodGroup')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Address</label>
                        <textarea
                            {...register('address')}
                            rows="3"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                        ></textarea>
                    </div>

                    {/* Medical History */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Medical History</label>
                        <textarea
                            {...register('medicalHistory')}
                            rows="4"
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            placeholder="Any existing conditions, allergies, or past surgeries..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/patients')}
                            className="bg-white text-slate-700 px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50 mr-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors flex items-center disabled:opacity-50"
                        >
                            <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientForm;
