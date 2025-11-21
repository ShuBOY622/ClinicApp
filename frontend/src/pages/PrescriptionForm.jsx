import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { createPrescription } from '../services/prescriptionService';
import { searchPatients, getPatientById } from '../services/patientService';
import { searchMedicines } from '../services/medicineService';
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaSearch } from 'react-icons/fa';

const PrescriptionForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientIdParam = searchParams.get('patientId');

    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            medicines: [{ medicineId: '', medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "medicines"
    });

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [patientResults, setPatientResults] = useState([]);
    const [selectedPatientIndex, setSelectedPatientIndex] = useState(-1);

    const [medicineSearch, setMedicineSearch] = useState('');
    const [medicineResults, setMedicineResults] = useState([]);
    const [activeMedicineIndex, setActiveMedicineIndex] = useState(null);
    const [selectedMedicineIndex, setSelectedMedicineIndex] = useState(-1);

    const [loading, setLoading] = useState(false);

    // Search Patients
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (patientSearch.length > 2) {
                try {
                    const response = await searchPatients(patientSearch);
                    setPatientResults(response.data.content);
                    setSelectedPatientIndex(-1);
                } catch (error) {
                    console.error('Error searching patients:', error);
                }
            } else {
                setPatientResults([]);
                setSelectedPatientIndex(-1);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [patientSearch]);

    // Search Medicines
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (medicineSearch.length > 2) {
                try {
                    const response = await searchMedicines(medicineSearch);
                    setMedicineResults(response.data.content);
                    setSelectedMedicineIndex(-1);
                } catch (error) {
                    console.error('Error searching medicines:', error);
                }
            } else {
                setMedicineResults([]);
                setSelectedMedicineIndex(-1);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [medicineSearch]);

    const selectPatient = (patient) => {
        console.log('Selecting patient:', patient);
        setSelectedPatient(patient);
        setValue('patientId', patient.id);
        setPatientSearch('');
        setPatientResults([]);
        setSelectedPatientIndex(-1);
    };

    // Fetch patient if patientId param exists
    useEffect(() => {
        if (patientIdParam) {
            console.log('Found patientId param:', patientIdParam);
            const fetchPatient = async () => {
                try {
                    const response = await getPatientById(patientIdParam);
                    console.log('Fetched patient:', response.data);
                    selectPatient(response.data);
                } catch (error) {
                    console.error('Error fetching patient:', error);
                }
            };
            fetchPatient();
        }
    }, [patientIdParam]);

    const selectMedicine = (medicine, index) => {
        setValue(`medicines.${index}.medicineId`, medicine.id);
        setValue(`medicines.${index}.medicineName`, medicine.name);
        setMedicineSearch('');
        setMedicineResults([]);
        setActiveMedicineIndex(null);
        setSelectedMedicineIndex(-1);
    };

    // Keyboard navigation for patient search
    const handlePatientKeyDown = (e) => {
        if (patientResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedPatientIndex(prev =>
                prev < patientResults.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedPatientIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedPatientIndex >= 0) {
            e.preventDefault();
            selectPatient(patientResults[selectedPatientIndex]);
        } else if (e.key === 'Escape') {
            setPatientResults([]);
            setSelectedPatientIndex(-1);
        }
    };

    // Keyboard navigation for medicine search
    const handleMedicineKeyDown = (e, fieldIndex) => {
        if (activeMedicineIndex !== fieldIndex || medicineResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedMedicineIndex(prev =>
                prev < medicineResults.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedMedicineIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter' && selectedMedicineIndex >= 0) {
            e.preventDefault();
            selectMedicine(medicineResults[selectedMedicineIndex], fieldIndex);
        } else if (e.key === 'Escape') {
            setMedicineResults([]);
            setSelectedMedicineIndex(-1);
            setActiveMedicineIndex(null);
        }
    };

    const onSubmit = async (data) => {
        if (!selectedPatient) {
            alert('Please select a patient');
            return;
        }
        setLoading(true);
        try {
            await createPrescription({ ...data, patientId: selectedPatient.id });
            navigate(`/patients/${selectedPatient.id}`);
        } catch (error) {
            console.error('Error creating prescription:', error);
            alert('Failed to create prescription.');
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
                    <h2 className="text-2xl font-bold text-slate-800">New Prescription</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Patient Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-medium text-slate-800 mb-4">Patient Details</h3>
                    {selectedPatient ? (
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-md border border-slate-200">
                            <div>
                                <p className="font-bold text-slate-900">{selectedPatient.firstName} {selectedPatient.lastName}</p>
                                <p className="text-sm text-slate-500">{selectedPatient.phone} • {selectedPatient.gender}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedPatient(null)}
                                className="text-sm text-primary hover:underline"
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patient by name or phone... (Use ↑↓ arrows and Enter)"
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={patientSearch}
                                onChange={(e) => setPatientSearch(e.target.value)}
                                onKeyDown={handlePatientKeyDown}
                            />
                            {patientResults.length > 0 && (
                                <div className="absolute z-10 w-full bg-white mt-1 border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {patientResults.map((patient, idx) => (
                                        <div
                                            key={patient.id}
                                            onClick={() => selectPatient(patient)}
                                            className={`p-3 cursor-pointer border-b border-slate-100 last:border-0 ${idx === selectedPatientIndex
                                                    ? 'bg-sky-100'
                                                    : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <p className="font-medium text-slate-900">{patient.firstName} {patient.lastName}</p>
                                            <p className="text-xs text-slate-500">{patient.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Diagnosis & Notes */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Diagnosis</label>
                            <input
                                type="text"
                                {...register('diagnosis')}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Notes</label>
                            <textarea
                                {...register('notes')}
                                rows="1"
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Medicines */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-slate-800">Medicines</h3>
                        <button
                            type="button"
                            onClick={() => append({ medicineId: '', medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' })}
                            className="text-sm text-primary hover:text-sky-700 flex items-center"
                        >
                            <FaPlus className="mr-1" /> Add Medicine
                        </button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-12 gap-4 items-start border-b border-slate-100 pb-4 last:border-0">
                                <div className="col-span-4 relative">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Medicine</label>
                                    <input
                                        type="text"
                                        {...register(`medicines.${index}.medicineName`)}
                                        placeholder="Search medicine... (Use ↑↓ and Enter)"
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border text-sm"
                                        autoComplete="off"
                                        onFocus={() => setActiveMedicineIndex(index)}
                                        onChange={(e) => {
                                            register(`medicines.${index}.medicineName`).onChange(e);
                                            setMedicineSearch(e.target.value);
                                            setActiveMedicineIndex(index);
                                        }}
                                        onKeyDown={(e) => handleMedicineKeyDown(e, index)}
                                    />
                                    <input type="hidden" {...register(`medicines.${index}.medicineId`, { required: true })} />

                                    {activeMedicineIndex === index && medicineResults.length > 0 && (
                                        <div className="absolute z-10 w-full bg-white mt-1 border border-slate-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                            {medicineResults.map((medicine, idx) => (
                                                <div
                                                    key={medicine.id}
                                                    onClick={() => selectMedicine(medicine, index)}
                                                    className={`p-2 cursor-pointer border-b border-slate-100 last:border-0 ${idx === selectedMedicineIndex
                                                            ? 'bg-sky-100'
                                                            : 'hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <p className="text-sm font-medium text-slate-900">{medicine.name}</p>
                                                    <p className="text-xs text-slate-500">{medicine.genericName} • {medicine.stockQuantity} in stock</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {errors.medicines?.[index]?.medicineId && <p className="text-red-500 text-xs mt-1">Required</p>}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Dosage</label>
                                    <input
                                        type="text"
                                        {...register(`medicines.${index}.dosage`, { required: true })}
                                        placeholder="e.g. 500mg"
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border text-sm"
                                    />
                                    {errors.medicines?.[index]?.dosage && <p className="text-red-500 text-xs mt-1">Required</p>}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Frequency</label>
                                    <input
                                        type="text"
                                        {...register(`medicines.${index}.frequency`, { required: true })}
                                        placeholder="e.g. 2x daily"
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border text-sm"
                                    />
                                    {errors.medicines?.[index]?.frequency && <p className="text-red-500 text-xs mt-1">Required</p>}
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        {...register(`medicines.${index}.duration`, { required: true })}
                                        placeholder="e.g. 7 days"
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border text-sm"
                                    />
                                    {errors.medicines?.[index]?.duration && <p className="text-red-500 text-xs mt-1">Required</p>}
                                </div>

                                <div className="col-span-1 flex items-end">
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                            title="Remove"
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>

                                <div className="col-span-12">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Instructions (Optional)</label>
                                    <input
                                        type="text"
                                        {...register(`medicines.${index}.instructions`)}
                                        placeholder="e.g. Take after meals"
                                        className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2 border text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors flex items-center disabled:opacity-50"
                    >
                        <FaSave className="mr-2" />
                        {loading ? 'Saving...' : 'Save Prescription'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrescriptionForm;
