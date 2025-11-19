import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../services/patientService';
import { FaPlus, FaSearch, FaEye, FaCalendarAlt } from 'react-icons/fa';

const PrescriptionList = () => {
    // Ideally, this would list all prescriptions or allow searching by patient
    // For now, let's list patients to select one to view their prescriptions
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchPatients();
    }, [page]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await getPatients(page);
            setPatients(response.data.content);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Prescriptions</h2>
                <Link
                    to="/prescriptions/new"
                    className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-sky-600 transition-colors"
                >
                    <FaPlus className="mr-2" /> New Prescription
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-6">
                <h3 className="text-lg font-medium text-slate-700 mb-4">Select a Patient to View History</h3>
                {loading ? (
                    <div className="text-center py-4">Loading patients...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {patients.map((patient) => (
                            <Link
                                key={patient.id}
                                to={`/patients/${patient.id}`}
                                className="block p-4 border border-slate-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {patient.firstName.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900">{patient.firstName} {patient.lastName}</div>
                                        <div className="text-xs text-slate-500">{patient.phone}</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionList;
