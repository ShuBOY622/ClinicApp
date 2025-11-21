import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedicines, searchMedicines, deleteMedicine } from '../services/medicineService';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaPills, FaBoxes, FaDollarSign, FaTag } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const MedicineList = () => {
    const { t } = useTranslation();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    useEffect(() => {
        fetchMedicines();
    }, [page]);

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const response = keyword
                ? await searchMedicines(keyword, page)
                : await getMedicines(page);
            setMedicines(response.data.content);
        } catch (error) {
            console.error('Error fetching medicines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchMedicines();
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('medicine.confirmDelete') || 'Are you sure you want to delete this medicine?')) {
            try {
                await deleteMedicine(id);
                fetchMedicines();
            } catch (error) {
                console.error('Error deleting medicine:', error);
            }
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Antibiotic': 'from-blue-500 to-cyan-500',
            'Painkiller': 'from-red-500 to-pink-500',
            'Vitamin': 'from-yellow-500 to-orange-500',
            'Antacid': 'from-green-500 to-emerald-500',
            'Antihistamine': 'from-purple-500 to-indigo-500',
        };
        return colors[category] || 'from-slate-500 to-gray-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                        {t('medicine.title')}
                    </h2>
                    <p className="text-slate-600 mt-1">Manage your medicine inventory</p>
                </div>
                <Link
                    to="/medicines/new"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
                >
                    <FaPlus /> {t('medicine.addMedicine')}
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border border-sky-200">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder={t('medicine.searchMedicines')}
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 bg-white/80 backdrop-blur-sm"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-slate-700 to-slate-900 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium"
                    >
                        {t('common.search')}
                    </button>
                    <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Grid
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'table'
                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            Table
                        </button>
                    </div>
                </form>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-20 text-slate-600">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-500 border-t-transparent"></div>
                    <p className="mt-4">{t('common.loading')}</p>
                </div>
            ) : medicines.length === 0 ? (
                <div className="text-center py-20">
                    <FaPills className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <p className="text-slate-500">No medicines found</p>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medicines.map((medicine) => (
                        <div
                            key={medicine.id}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all group"
                        >
                            {/* Card Header */}
                            <div className={`bg-gradient-to-r ${getCategoryColor(medicine.category)} p-4`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-white font-bold text-lg mb-1">{medicine.name}</h3>
                                        <p className="text-white/90 text-sm">{medicine.genericName}</p>
                                    </div>
                                    <FaPills className="text-white/80 text-2xl" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                                        <FaTag className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Category</p>
                                        <p className="font-semibold text-slate-900">{medicine.category}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                                            <FaBoxes className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Stock</p>
                                            <p className={`font-bold ${medicine.stockQuantity > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                                {medicine.stockQuantity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                                            <FaDollarSign className="text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Price</p>
                                            <p className="font-bold text-slate-900">₹{medicine.price}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-200">
                                    <p className="text-xs text-slate-500">
                                        {medicine.dosage} • {medicine.formType}
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-4 pb-4 flex gap-2">
                                <Link
                                    to={`/medicines/edit/${medicine.id}`}
                                    className="flex-1 bg-gradient-to-r from-sky-50 to-blue-50 text-sky-600 px-4 py-2 rounded-lg hover:from-sky-100 hover:to-blue-100 transition-all text-center font-medium flex items-center justify-center gap-2"
                                >
                                    <FaEdit /> Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(medicine.id)}
                                    className="flex-1 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 px-4 py-2 rounded-lg hover:from-red-100 hover:to-pink-100 transition-all font-medium flex items-center justify-center gap-2"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Table View */
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-gradient-to-r from-slate-50 to-sky-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    {t('common.name')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    {t('medicine.genericName')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    {t('medicine.category')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    {t('medicine.stock')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    {t('medicine.price')}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    {t('common.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {medicines.map((medicine) => (
                                <tr key={medicine.id} className="hover:bg-sky-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-slate-900">{medicine.name}</div>
                                        <div className="text-xs text-slate-500">{medicine.dosage} • {medicine.formType}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {medicine.genericName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(medicine.category)} text-white`}>
                                            {medicine.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${medicine.stockQuantity > 10
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {medicine.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                        ₹{medicine.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/medicines/edit/${medicine.id}`}
                                            className="text-sky-600 hover:text-sky-800 mr-4 inline-flex items-center gap-1"
                                            title={t('common.edit')}
                                        >
                                            <FaEdit className="inline" /> Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(medicine.id)}
                                            className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                                            title={t('common.delete')}
                                        >
                                            <FaTrash className="inline" /> Delete
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

export default MedicineList;
