import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients } from '../services/patientService';
import { FaPlus, FaSearch, FaEye, FaCalendarAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const PrescriptionList = () => {
    const { t } = useTranslation();
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
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    {t('prescription.title')}
                </h2>
                <Link
                    to="/prescriptions/new"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:shadow-lg transition-all"
                >
                    <FaPlus className="mr-2" /> {t('prescription.newPrescription')}
                </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 mb-6">
                <h3 className="text-lg font-medium text-slate-700 mb-4">{t('prescription.selectPatient')}</h3>
                {loading ? (
                    <div className="text-center py-4 text-slate-600">{t('common.loading')}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {patients.map((patient) => (
                            <Link
                                key={patient.id}
                                to={`/patients/${patient.id}`}
                                className="block p-4 border border-slate-200 rounded-xl hover:border-sky-500 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-700 font-bold">
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
