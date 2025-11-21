import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPatients, searchPatients, deletePatient } from '../services/patientService';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const PatientList = () => {
    const { t } = useTranslation();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchPatients();
    }, [page]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = keyword
                ? await searchPatients(keyword, page)
                : await getPatients(page);
            setPatients(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchPatients();
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('patient.confirmDelete') || 'Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(id);
                fetchPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    {t('patient.title')}
                </h2>
                <Link
                    to="/patients/new"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:shadow-lg transition-all"
                >
                    <FaPlus className="mr-2" /> {t('patient.addPatient')}
                </Link>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-slate-200 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('patient.searchPatients')}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                    >
                        {t('common.search')}
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-600">{t('common.loading')}</div>
            ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-gradient-to-r from-slate-50 to-sky-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{t('common.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{t('common.phone')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{t('common.gender')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{t('common.age')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-sky-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center text-sky-700 font-bold">
                                                {patient.firstName.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-slate-900">{patient.firstName} {patient.lastName}</div>
                                                <div className="text-sm text-slate-500">{patient.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{patient.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{patient.gender}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/patients/${patient.id}`} className="text-sky-600 hover:text-sky-800 mr-4" title={t('common.view')}>
                                            <FaEye className="inline" />
                                        </Link>
                                        <button onClick={() => handleDelete(patient.id)} className="text-red-500 hover:text-red-700" title={t('common.delete')}>
                                            <FaTrash className="inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PatientList;
