import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getPatientById, deletePatient } from '../services/patientService';
import { getPrescriptionsByPatient } from '../services/prescriptionService';
import { getDietPlansByPatient } from '../services/dietPlanService';
import { getFollowUpsByPatient } from '../services/followUpService';
import { getDocumentsByPatient, uploadDocument, deleteDocument } from '../services/patientDocumentService';
import { FaUser, FaHistory, FaFileAlt, FaPills, FaUtensils, FaEdit, FaTrash, FaArrowLeft, FaPlus, FaDownload, FaUpload, FaCalendarCheck } from 'react-icons/fa';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [dietPlans, setDietPlans] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || 'personal');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await getPatientById(id);
                setPatient(response.data);

                // Fetch related data
                const presResponse = await getPrescriptionsByPatient(id);
                setPrescriptions(presResponse.data.content);

                const dietResponse = await getDietPlansByPatient(id);
                setDietPlans(dietResponse.data.content);

                const followUpResponse = await getFollowUpsByPatient(id);
                setFollowUps(followUpResponse.data.content);

                const docResponse = await getDocumentsByPatient(id);
                setDocuments(docResponse.data);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(id);
                navigate('/patients');
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!patient) return <div className="text-center py-10">Patient not found</div>;

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FaUser },
        { id: 'history', label: 'Medical History', icon: FaHistory },
        { id: 'documents', label: 'Documents', icon: FaFileAlt },
        { id: 'prescriptions', label: 'Prescriptions', icon: FaPills },
        { id: 'diet', label: 'Diet Plans', icon: FaUtensils },
        { id: 'followups', label: 'Follow Ups', icon: FaCalendarCheck },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Link to="/patients" className="text-slate-500 hover:text-slate-700 mr-4">
                        <FaArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="text-2xl font-bold text-slate-800">Patient Details</h2>
                </div>
                <div className="space-x-2">
                    <Link
                        to={`/patients/edit/${id}`}
                        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200 transition-colors inline-flex items-center"
                    >
                        <FaEdit className="mr-2" /> Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors inline-flex items-center"
                    >
                        <FaTrash className="mr-2" /> Delete
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                        {patient.firstName.charAt(0)}
                    </div>
                    <div className="ml-6">
                        <h3 className="text-xl font-bold text-slate-900">{patient.firstName} {patient.lastName}</h3>
                        <p className="text-slate-500">{patient.gender} • {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years old</p>
                        <p className="text-slate-500">{patient.phone}</p>
                    </div>
                </div>

                <div className="border-b border-slate-200">
                    <nav className="flex -mb-px">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <tab.icon className={`-ml-0.5 mr-2 h-5 w-5 ${activeTab === tab.id ? 'text-primary' : 'text-slate-400 group-hover:text-slate-500'
                                    }`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-slate-500">Email</h4>
                                <p className="mt-1 text-sm text-slate-900">{patient.email || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-500">Blood Group</h4>
                                <p className="mt-1 text-sm text-slate-900">{patient.bloodGroup || 'N/A'}</p>
                            </div>
                            <div className="col-span-2">
                                <h4 className="text-sm font-medium text-slate-500">Address</h4>
                                <p className="mt-1 text-sm text-slate-900">{patient.address || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'history' && (
                        <div>
                            <h4 className="text-sm font-medium text-slate-500 mb-2">Medical History</h4>
                            <p className="text-sm text-slate-900 whitespace-pre-wrap">{patient.medicalHistory || 'No medical history recorded.'}</p>
                        </div>
                    )}
                    {/* Placeholders for other tabs */}
                    {activeTab === 'documents' && (
                        <div>
                            <div className="mb-6 p-4 bg-slate-50 rounded-md border border-slate-200">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Upload Document</h4>
                                <div className="flex gap-2">
                                    <input type="file" id="fileInput" className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20
                  "/>
                                    <button
                                        onClick={async () => {
                                            const fileInput = document.getElementById('fileInput');
                                            if (fileInput.files.length > 0) {
                                                setUploading(true);
                                                try {
                                                    await uploadDocument(id, fileInput.files[0], 'Uploaded via Portal');
                                                    const docResponse = await getDocumentsByPatient(id);
                                                    setDocuments(docResponse.data);
                                                    fileInput.value = '';
                                                } catch (error) {
                                                    console.error('Upload failed', error);
                                                    alert('Upload failed');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }
                                        }}
                                        disabled={uploading}
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                            </div>

                            {documents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {documents.map((doc) => (
                                        <div key={doc.id} className="border border-slate-200 rounded-md p-4 flex flex-col justify-between">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-slate-900 truncate" title={doc.fileName}>{doc.fileName}</p>
                                                    <p className="text-xs text-slate-500">{doc.fileType}</p>
                                                </div>
                                                <FaFileAlt className="text-slate-400 flex-shrink-0 ml-2" />
                                            </div>
                                            <div className="flex justify-end space-x-2 mt-2">
                                                <a
                                                    href={doc.fileDownloadUri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:text-sky-700 p-1"
                                                    title="Download"
                                                >
                                                    <FaDownload />
                                                </a>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Delete this document?')) {
                                                            try {
                                                                await deleteDocument(doc.id);
                                                                const docResponse = await getDocumentsByPatient(id);
                                                                setDocuments(docResponse.data);
                                                            } catch (e) { console.error(e); }
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No documents uploaded.</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'prescriptions' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-medium text-slate-500">Prescriptions</h4>
                                <Link to={`/prescriptions/new?patientId=${id}`} className="text-sm text-primary hover:underline flex items-center">
                                    <FaPlus className="mr-1" /> Add Prescription
                                </Link>
                            </div>
                            {prescriptions.length > 0 ? (
                                <div className="space-y-4">
                                    {prescriptions.map((prescription) => (
                                        <div key={prescription.id} className="border border-slate-200 rounded-md p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-slate-900">{prescription.diagnosis}</span>
                                                <span className="text-sm text-slate-500">{new Date(prescription.prescriptionDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-sm text-slate-600 mb-2">{prescription.notes}</div>
                                            <div className="space-y-1">
                                                {prescription.medicines.map((med, idx) => (
                                                    <div key={idx} className="text-sm bg-slate-50 p-2 rounded">
                                                        <span className="font-medium">{med.medicineName}</span> - {med.dosage} ({med.frequency}) for {med.duration}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No prescriptions found.</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'diet' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-medium text-slate-500">Diet Plans</h4>
                                <Link to={`/diet-plans/new?patientId=${id}`} className="text-sm text-primary hover:underline flex items-center">
                                    <FaPlus className="mr-1" /> Add Diet Plan
                                </Link>
                            </div>
                            {dietPlans.length > 0 ? (
                                <div className="space-y-4">
                                    {dietPlans.map((plan) => (
                                        <div key={plan.id} className="border border-slate-200 rounded-md p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-slate-900">
                                                    {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                                                </span>
                                                <Link to={`/diet-plans/edit/${plan.id}`} className="text-sm text-primary hover:underline">Edit</Link>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div><span className="font-medium">Breakfast:</span> {plan.breakfast}</div>
                                                <div><span className="font-medium">Lunch:</span> {plan.lunch}</div>
                                                <div><span className="font-medium">Dinner:</span> {plan.dinner}</div>
                                            </div>
                                            {plan.instructions && (
                                                <div className="mt-2 text-sm text-slate-600">
                                                    <span className="font-medium">Instructions:</span> {plan.instructions}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No diet plans found.</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'followups' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-medium text-slate-500">Follow Ups</h4>
                                <Link to={`/follow-ups/new?patientId=${id}`} className="text-sm text-primary hover:underline flex items-center">
                                    <FaPlus className="mr-1" /> Add Follow Up
                                </Link>
                            </div>
                            {followUps.length > 0 ? (
                                <div className="space-y-4">
                                    {followUps.map((followUp) => (
                                        <div key={followUp.id} className="border border-slate-200 rounded-md p-4 flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center mb-1">
                                                    <FaCalendarCheck className="text-slate-400 mr-2" />
                                                    <span className="font-medium text-slate-900">
                                                        {new Date(followUp.followUpDate).toLocaleString()}
                                                    </span>
                                                    <span className={`ml-3 px-2 py-0.5 rounded-full text-xs ${followUp.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        followUp.status === 'MISSED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {followUp.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600">{followUp.reason}</p>
                                            </div>
                                            <Link to={`/follow-ups/edit/${followUp.id}`} className="text-sm text-primary hover:underline">Edit</Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No follow-ups recorded.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
