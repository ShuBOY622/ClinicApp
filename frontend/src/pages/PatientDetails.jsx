import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getPatientById, deletePatient, updatePatient, downloadConsentForm } from '../services/patientService';
import { getPrescriptionsByPatient } from '../services/prescriptionService';
import { getDietPlansByPatient, downloadDietPlan } from '../services/dietPlanService';
import { getFollowUpsByPatient } from '../services/followUpService';
import { getDocumentsByPatient, uploadDocument, deleteDocument, renameDocument } from '../services/patientDocumentService';
import { FaUser, FaHistory, FaFileAlt, FaPills, FaUtensils, FaEdit, FaTrash, FaArrowLeft, FaPlus, FaDownload, FaUpload, FaCalendarCheck, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTint, FaBirthdayCake, FaSave } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import PrintablePrescription from '../components/PrintablePrescription';

const PatientDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [dietPlans, setDietPlans] = useState([]);
    const [followUps, setFollowUps] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPrintPreview, setShowPrintPreview] = useState(null);

    const tabParam = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabParam || 'personal');
    const [uploading, setUploading] = useState(false);
    const [editingHistory, setEditingHistory] = useState(false);
    const [medicalHistoryText, setMedicalHistoryText] = useState('');
    const [savingHistory, setSavingHistory] = useState(false);
    const [renamingDocId, setRenamingDocId] = useState(null);
    const [newDocName, setNewDocName] = useState('');

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
        if (window.confirm(t('patient.confirmDelete') || 'Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(id);
                navigate('/patients');
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSaveMedicalHistory = async () => {
        setSavingHistory(true);
        try {
            await updatePatient(id, {
                ...patient,
                medicalHistory: medicalHistoryText
            });

            // Update local state
            setPatient({
                ...patient,
                medicalHistory: medicalHistoryText
            });

            setEditingHistory(false);
            setMedicalHistoryText('');
        } catch (error) {
            console.error('Error updating medical history:', error);
            alert('Failed to update medical history. Please try again.');
        } finally {
            setSavingHistory(false);
        }
    };

    if (loading) return <div className="text-center py-10 text-slate-600">{t('common.loading')}</div>;
    if (!patient) return <div className="text-center py-10 text-slate-600">Patient not found</div>;

    const tabs = [
        { id: 'personal', label: t('patient.personalInfo'), icon: FaUser, color: 'from-blue-500 to-cyan-500' },
        { id: 'history', label: t('patient.medicalHistory'), icon: FaHistory, color: 'from-purple-500 to-pink-500' },
        { id: 'documents', label: 'Documents', icon: FaFileAlt, color: 'from-orange-500 to-red-500' },
        { id: 'prescriptions', label: t('patient.prescriptions'), icon: FaPills, color: 'from-green-500 to-emerald-500' },
        { id: 'diet', label: t('patient.dietPlans'), icon: FaUtensils, color: 'from-yellow-500 to-orange-500' },
        { id: 'followups', label: t('patient.followUps'), icon: FaCalendarCheck, color: 'from-indigo-500 to-purple-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to="/patients"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="h-5 w-5 text-slate-600" />
                    </Link>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                        Patient Details
                    </h2>
                </div>
                <div className="flex gap-2">
                    <Link
                        to={`/patients/edit/${id}`}
                        className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
                    >
                        <FaEdit /> {t('common.edit')}
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-4 py-2 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
                    >
                        <FaTrash /> {t('common.delete')}
                    </button>
                </div>
            </div>

            {/* Patient Header Card */}
            <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-sky-200 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
                                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-green-500 rounded-full border-4 border-white"></div>
                        </div>

                        {/* Patient Info */}
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                {patient.firstName} {patient.lastName}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <FaBirthdayCake className="text-sky-500" />
                                    <span>{calculateAge(patient.dateOfBirth)} years • {patient.gender}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <FaPhone className="text-sky-500" />
                                    <span>{patient.phone}</span>
                                </div>
                                {patient.bloodGroup && (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <FaTint className="text-red-500" />
                                        <span className="font-semibold">{patient.bloodGroup}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="hidden lg:flex gap-4">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px] shadow-md">
                                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {prescriptions.length}
                                </div>
                                <div className="text-xs text-slate-600 mt-1">Prescriptions</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center min-w-[100px] shadow-md">
                                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {followUps.length}
                                </div>
                                <div className="text-xs text-slate-600 mt-1">Follow-ups</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Tab Navigation */}
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50">
                    <nav className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`group relative flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'text-sky-600'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                                    }`} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color} rounded-t-full`}></div>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* Personal Info Tab */}
                    {activeTab === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard icon={FaEnvelope} label="Email" value={patient.email || 'N/A'} />
                            <InfoCard icon={FaTint} label={t('patient.bloodGroup')} value={patient.bloodGroup || 'N/A'} />
                            <InfoCard icon={FaBirthdayCake} label="Date of Birth" value={new Date(patient.dateOfBirth).toLocaleDateString()} />
                            <InfoCard icon={FaPhone} label={t('common.phone')} value={patient.phone} />
                            <div className="md:col-span-2">
                                <InfoCard icon={FaMapMarkerAlt} label={t('common.address')} value={patient.address || 'N/A'} />
                            </div>
                            {patient.allergies && (
                                <div className="md:col-span-2">
                                    <InfoCard icon={FaHistory} label={t('patient.allergies')} value={patient.allergies} />
                                </div>
                            )}
                            {patient.chronicDiseases && (
                                <div className="md:col-span-2">
                                    <InfoCard icon={FaHistory} label={t('patient.chronicDiseases')} value={patient.chronicDiseases} />
                                </div>
                            )}
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button
                                    onClick={async () => {
                                        try {
                                            const response = await downloadConsentForm(id);
                                            const url = window.URL.createObjectURL(new Blob([response.data]));
                                            const link = document.createElement('a');
                                            link.href = url;
                                            link.setAttribute('download', `consent_form_${id}.pdf`);
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                        } catch (error) {
                                            console.error('Error downloading consent form:', error);
                                            alert('Failed to download consent form');
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                                >
                                    <FaFileAlt /> Download Consent Form (Marathi)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Medical History Tab */}
                    {activeTab === 'history' && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
                                    <FaHistory />
                                    {t('patient.medicalHistory')}
                                </h4>
                                {!editingHistory && (
                                    <button
                                        onClick={() => {
                                            setEditingHistory(true);
                                            setMedicalHistoryText(patient.medicalHistory || '');
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                                    >
                                        <FaEdit /> Edit History
                                    </button>
                                )}
                            </div>

                            {editingHistory ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={medicalHistoryText}
                                        onChange={(e) => setMedicalHistoryText(e.target.value)}
                                        rows="10"
                                        className="w-full p-4 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none resize-none"
                                        placeholder="Enter medical history, chronic diseases, allergies, past surgeries, etc."
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => {
                                                setEditingHistory(false);
                                                setMedicalHistoryText('');
                                            }}
                                            className="px-4 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveMedicalHistory}
                                            disabled={savingHistory}
                                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <FaSave />
                                            {savingHistory ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                                    {patient.medicalHistory ? (
                                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {patient.medicalHistory}
                                        </p>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FaHistory className="mx-auto h-12 w-12 text-purple-300 mb-3" />
                                            <p className="text-slate-500 mb-4">No medical history recorded.</p>
                                            <button
                                                onClick={() => {
                                                    setEditingHistory(true);
                                                    setMedicalHistoryText('');
                                                }}
                                                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                                            >
                                                Add Medical History
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div className="space-y-6">
                            {/* Upload Section */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                                <h4 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                                    <FaUpload /> Upload Document
                                </h4>
                                <div className="flex gap-3">
                                    <input
                                        type="file"
                                        id="fileInput"
                                        className="flex-1 text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-orange-500 file:to-red-600 file:text-white hover:file:shadow-lg file:transition-all"
                                    />
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
                                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
                                    >
                                        {uploading ? 'Uploading...' : 'Upload'}
                                    </button>
                                </div>
                            </div>

                            {/* Documents Grid */}
                            {documents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {documents.map((doc) => (
                                        <div key={doc.id} className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-all group">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1 overflow-hidden">
                                                    {renamingDocId === doc.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={newDocName}
                                                                onChange={(e) => setNewDocName(e.target.value)}
                                                                className="w-full p-1 border border-slate-300 rounded text-sm"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className="font-medium text-slate-900 truncate" title={doc.fileName}>
                                                            {doc.fileName}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-slate-500 mt-1">{doc.fileType}</p>
                                                </div>
                                                <FaFileAlt className="text-orange-400 text-2xl flex-shrink-0 ml-2" />
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                {renamingDocId === doc.id ? (
                                                    <>
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await renameDocument(doc.id, newDocName);
                                                                    const docResponse = await getDocumentsByPatient(id);
                                                                    setDocuments(docResponse.data);
                                                                    setRenamingDocId(null);
                                                                    setNewDocName('');
                                                                } catch (error) {
                                                                    console.error('Error renaming document:', error);
                                                                    alert('Failed to rename document');
                                                                }
                                                            }}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Save"
                                                        >
                                                            <FaSave />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setRenamingDocId(null);
                                                                setNewDocName('');
                                                            }}
                                                            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <FaTrash className="transform rotate-45" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <a
                                                            href={doc.fileDownloadUri}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                            title="Download"
                                                        >
                                                            <FaDownload />
                                                        </a>
                                                        <button
                                                            onClick={() => {
                                                                setRenamingDocId(doc.id);
                                                                setNewDocName(doc.fileName);
                                                            }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Rename"
                                                        >
                                                            <FaEdit />
                                                        </button>
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
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <FaFileAlt className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                    <p>No documents uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Prescriptions Tab */}
                    {activeTab === 'prescriptions' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {t('patient.prescriptions')}
                                </h4>
                                <Link
                                    to={`/prescriptions/new?patientId=${id}`}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
                                >
                                    <FaPlus /> Add Prescription
                                </Link>
                            </div>
                            {prescriptions.length > 0 ? (
                                <div className="space-y-4">
                                    {prescriptions.map((prescription) => (
                                        <div key={prescription.id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h5 className="font-bold text-slate-900 text-lg">{prescription.diagnosis}</h5>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {new Date(prescription.prescriptionDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setShowPrintPreview(showPrintPreview === prescription.id ? null : prescription.id)}
                                                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm"
                                                >
                                                    {showPrintPreview === prescription.id ? 'Hide Print' : t('prescription.printPrescription')}
                                                </button>
                                            </div>
                                            {prescription.notes && (
                                                <p className="text-slate-700 mb-4 bg-white/50 p-3 rounded-lg">{prescription.notes}</p>
                                            )}
                                            <div className="space-y-2">
                                                <h6 className="font-semibold text-slate-700 text-sm">Medicines:</h6>
                                                {prescription.medicines.map((med, idx) => (
                                                    <div key={idx} className="bg-white/80 backdrop-blur-sm p-3 rounded-lg flex justify-between items-center">
                                                        <div>
                                                            <span className="font-semibold text-slate-900">{med.medicineName}</span>
                                                            <p className="text-sm text-slate-600 mt-1">
                                                                {med.dosage} • {med.frequency} • {med.duration}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {showPrintPreview === prescription.id && (
                                                <div className="mt-4 border-t border-green-300 pt-4">
                                                    <PrintablePrescription
                                                        prescription={prescription}
                                                        patient={patient}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <FaPills className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                    <p>No prescriptions found.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Diet Plans Tab */}
                    {activeTab === 'diet' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                    {t('patient.dietPlans')}
                                </h4>
                                <Link
                                    to={`/diet-plans/new?patientId=${id}`}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
                                >
                                    <FaPlus /> Add Diet Plan
                                </Link>
                            </div>
                            {dietPlans.length > 0 ? (
                                <div className="space-y-4">
                                    {dietPlans.map((plan) => (
                                        <div key={plan.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 hover:shadow-lg transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h5 className="font-bold text-slate-900">
                                                        {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                                                    </h5>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => downloadDietPlan(plan.id)}
                                                        className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                                                    >
                                                        <FaDownload /> PDF
                                                    </button>
                                                    <Link
                                                        to={`/diet-plans/edit/${plan.id}`}
                                                        className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <MealCard icon={FaUtensils} label="Breakfast" value={plan.breakfast} color="from-yellow-400 to-orange-400" />
                                                <MealCard icon={FaUtensils} label="Lunch" value={plan.lunch} color="from-orange-400 to-red-400" />
                                                <MealCard icon={FaUtensils} label="Dinner" value={plan.dinner} color="from-red-400 to-pink-400" />
                                            </div>
                                            {plan.instructions && (
                                                <div className="mt-4 bg-white/50 p-3 rounded-lg">
                                                    <span className="font-semibold text-slate-700">Instructions:</span>
                                                    <p className="text-slate-600 mt-1">{plan.instructions}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <FaUtensils className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                    <p>No diet plans found.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Follow-ups Tab */}
                    {activeTab === 'followups' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    {t('patient.followUps')}
                                </h4>
                                <Link
                                    to={`/follow-ups/new?patientId=${id}`}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all inline-flex items-center gap-2"
                                >
                                    <FaPlus /> Add Follow Up
                                </Link>
                            </div>
                            {followUps.length > 0 ? (
                                <div className="space-y-4">
                                    {followUps.map((followUp) => (
                                        <div key={followUp.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 hover:shadow-lg transition-all">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <FaCalendarCheck className="text-indigo-500 text-xl" />
                                                        <span className="font-bold text-slate-900">
                                                            {new Date(followUp.followUpDate).toLocaleString()}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${followUp.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                            followUp.status === 'Missed' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {followUp.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-700 ml-9">{followUp.reason}</p>
                                                </div>
                                                <Link
                                                    to={`/follow-ups/edit/${followUp.id}`}
                                                    className="text-sm text-sky-600 hover:text-sky-800 font-medium ml-4"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <FaCalendarCheck className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                                    <p>No follow-ups recorded.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper Components
const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg text-white">
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-sm text-slate-900 font-semibold mt-0.5">{value}</p>
            </div>
        </div>
    </div>
);

const MealCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
            <div className={`p-2 bg-gradient-to-r ${color} rounded-lg text-white`}>
                <Icon className="h-4 w-4" />
            </div>
            <span className="font-semibold text-slate-700 text-sm">{label}</span>
        </div>
        <p className="text-slate-600 text-sm">{value}</p>
    </div>
);

export default PatientDetails;
