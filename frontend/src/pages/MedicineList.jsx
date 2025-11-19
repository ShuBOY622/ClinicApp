import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedicines, searchMedicines, deleteMedicine } from '../services/medicineService';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const MedicineList = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);

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
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                await deleteMedicine(id);
                fetchMedicines();
            } catch (error) {
                console.error('Error deleting medicine:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Medicines</h2>
                <Link
                    to="/medicines/new"
                    className="bg-primary text-white px-4 py-2 rounded-md flex items-center hover:bg-sky-600 transition-colors"
                >
                    <FaPlus className="mr-2" /> Add Medicine
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or generic name..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Generic Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {medicines.map((medicine) => (
                                <tr key={medicine.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{medicine.name}</div>
                                        <div className="text-xs text-slate-500">{medicine.dosage} • {medicine.formType}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{medicine.genericName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{medicine.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${medicine.stockQuantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {medicine.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${medicine.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/medicines/edit/${medicine.id}`} className="text-primary hover:text-sky-700 mr-4">
                                            <FaEdit className="inline" />
                                        </Link>
                                        <button onClick={() => handleDelete(medicine.id)} className="text-red-500 hover:text-red-700">
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

export default MedicineList;
