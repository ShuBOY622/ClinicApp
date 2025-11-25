import { useTranslation } from 'react-i18next';
import { FaPrint, FaFilePdf } from 'react-icons/fa';
import { downloadPrescriptionPdf } from '../services/prescriptionService';
import './PrintablePrescription.css';

const PrintablePrescription = ({ prescription, patient }) => {
    const { t, i18n } = useTranslation();
    const isMarathi = i18n.language === 'mr';

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = async () => {
        try {
            const pdfBlob = await downloadPrescriptionPdf(prescription.id);
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription_${prescription.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF. Please try again.');
        }
    };

    // Format date in Marathi or English
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isMarathi) {
            return date.toLocaleDateString('mr-IN');
        }
        return date.toLocaleDateString('en-IN');
    };

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="printable-prescription-container">
            <div className="no-print mb-4 flex gap-3">
                <button
                    onClick={handleDownloadPdf}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <FaFilePdf />
                    <span>Download PDF</span>
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                    <FaPrint />
                    <span>{t('prescription.printPrescription')}</span>
                </button>
            </div>

            <div className="prescription-print-content">
                {/* Header */}
                <div className="prescription-header">
                    <h1 className="clinic-name">डॉ. रमेश तारख क्लिनिक</h1>
                    <h2 className="clinic-name-en">Dr. Ramesh Tarakh Clinic</h2>
                    <p className="clinic-contact">संपर्क: +91 XXXXXXXXXX | पत्ता: [Clinic Address]</p>
                </div>

                <div className="prescription-divider"></div>

                {/* Date */}
                <div className="prescription-date">
                    <span className="label">{isMarathi ? 'दिनांक' : 'Date'}:</span>
                    <span className="value">{formatDate(prescription.prescriptionDate || new Date())}</span>
                </div>

                {/* Patient Info - Only show if needed */}
                {patient && (
                    <div className="patient-info">
                        <div className="info-row">
                            <span className="label">{isMarathi ? 'रुग्णाचे नाव' : 'Patient Name'}:</span>
                            <span className="value">{patient.firstName} {patient.lastName}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">{isMarathi ? 'वय' : 'Age'}:</span>
                            <span className="value">{calculateAge(patient.dateOfBirth)} {isMarathi ? 'वर्षे' : 'years'}</span>
                            <span className="label ml-4">{isMarathi ? 'लिंग' : 'Gender'}:</span>
                            <span className="value">{patient.gender}</span>
                        </div>
                    </div>
                )}

                {/* Patient Details Sections */}
                {prescription && (
                    <>
                        {/* Basic Information */}
                        {(prescription.patientAddress || prescription.patientOccupation || prescription.patientMobileNumber) && (
                            <div className="prescription-section">
                                <h3 className="section-title">{isMarathi ? 'मूलभूत माहिती' : 'Basic Information'}:</h3>
                                <div className="details-grid">
                                    {prescription.patientAddress && (
                                        <div className="detail-row">
                                            <span className="label">{isMarathi ? 'पत्ता' : 'Address'}:</span>
                                            <span className="value">{prescription.patientAddress}</span>
                                        </div>
                                    )}
                                    {prescription.patientOccupation && (
                                        <div className="detail-row">
                                            <span className="label">{isMarathi ? 'व्यवसाय' : 'Occupation'}:</span>
                                            <span className="value">{prescription.patientOccupation}</span>
                                        </div>
                                    )}
                                    {prescription.patientMobileNumber && (
                                        <div className="detail-row">
                                            <span className="label">{isMarathi ? 'मोबाइल नंबर' : 'Mobile Number'}:</span>
                                            <span className="value">{prescription.patientMobileNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                    </>
                )}

                {/* Symptoms Section */}
                <div className="prescription-section">
                    <h3 className="section-title">{isMarathi ? 'सदयोव्याधी लक्षणे' : 'Current Symptoms'}:</h3>
                    <div className="section-content">
                        {prescription.diagnosis || '_'.repeat(60)}
                    </div>
                    <div className="blank-lines">
                        <div className="blank-line"></div>
                        <div className="blank-line"></div>
                    </div>
                </div>



                {/* Medicine Plan Section */}
                <div className="prescription-section">
                    <h3 className="section-title">{isMarathi ? 'औषधी योजना' : 'Medicine Plan'}:</h3>
                    <div className="medicine-list">
                        {prescription.medicines && prescription.medicines.length > 0 ? (
                            prescription.medicines.map((med, index) => (
                                <div key={index} className="medicine-item">
                                    {index + 1}. {med.medicineName} - {med.dosage} - {med.frequency} - {med.duration}
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="blank-line"></div>
                                <div className="blank-line"></div>
                                <div className="blank-line"></div>
                                <div className="blank-line"></div>
                            </>
                        )}
                    </div>
                </div>

                {/* Notes Section */}
                {prescription.notes && (
                    <div className="prescription-section">
                        <h3 className="section-title">{isMarathi ? 'टिपा' : 'Notes'}:</h3>
                        <div className="section-content">
                            {prescription.notes}
                        </div>
                    </div>
                )}

                {/* Signature */}
                <div className="prescription-signature">
                    <div className="signature-line">
                        <span>{isMarathi ? 'डॉक्टरांची सही' : "Doctor's Signature"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintablePrescription;
