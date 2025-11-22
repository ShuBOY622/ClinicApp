import { useTranslation } from 'react-i18next';
import { FaPrint } from 'react-icons/fa';
import './PrintablePrescription.css';

const PrintablePrescription = ({ prescription, patient }) => {
    const { t, i18n } = useTranslation();
    const isMarathi = i18n.language === 'mr';

    const handlePrint = () => {
        window.print();
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
            <div className="no-print mb-4">
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
                        {(prescription.patientAddress || prescription.patientOccupation || prescription.patientMobileNumber ||
                            prescription.bodyType || prescription.favouriteTaste) && (
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
                                        {prescription.bodyType && (
                                            <div className="detail-row">
                                                <span className="label">{isMarathi ? 'प्रकृती' : 'Body Type'}:</span>
                                                <span className="value">{prescription.bodyType}</span>
                                            </div>
                                        )}
                                        {prescription.favouriteTaste && (
                                            <div className="detail-row">
                                                <span className="label">{isMarathi ? 'आवडता रस' : 'Favourite Taste'}:</span>
                                                <span className="value">{prescription.favouriteTaste}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Daily Functions */}
                        {(prescription.urineDetails || prescription.stoolDetails || prescription.sleepDetails ||
                            prescription.sweatDetails || prescription.menstrualDetails) && (
                                <div className="prescription-section">
                                    <h3 className="section-title">{isMarathi ? 'दैनंदिन कार्ये' : 'Daily Functions'}:</h3>
                                    <div className="details-grid">
                                        {prescription.urineDetails && (
                                            <div className="detail-row">
                                                <span className="label">{isMarathi ? 'मूत्र' : 'Urine'}:</span>
                                                <span className="value">{prescription.urineDetails}</span>
                                            </div>
                                        )}
                                        {prescription.stoolDetails && (
                                            <div className="detail-row">
                                                <span className="label">{isMarathi ? 'दिष्ट / शौच' : 'Stool'}:</span>
                                                <span className="value">{prescription.stoolDetails}</span>
                                            </div>
                                        )}
                                        {prescription.sleepDetails && (
                                            <div className="detail-row">
                                                <span className="label">{isMarathi ? 'निद्रा' : 'Sleep'}:</span>
                                                <span className="value">{prescription.sleepDetails}</span>
                                            </div>
                                        )}
                                        {prescription.sweatDetails && (
                                            <div className="detail-row">
                                                <span className="label">{isMarathi ? 'घाम' : 'Sweat'}:</span>
                                                <span className="value">{prescription.sweatDetails}</span>
                                            </div>
                                        )}
                                        {prescription.menstrualDetails && (
                                            <div className="detail-row">
                                                <span className="label">{isMarathi ? 'रज' : 'Menstrual Details'}:</span>
                                                <span className="value">{prescription.menstrualDetails}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Medical History */}
                        {(prescription.pastHistory || prescription.previousTreatment ||
                            prescription.previousMedication || prescription.dailyRoutine) && (
                                <div className="prescription-section page-break-before">
                                    <h3 className="section-title">{isMarathi ? 'वैद्यकीय इतिहास' : 'Medical History'}:</h3>
                                    <div className="details-grid">
                                        {prescription.pastHistory && (
                                            <div className="detail-row full-width">
                                                <span className="label">{isMarathi ? 'पूर्व इतिहास' : 'Past History'}:</span>
                                                <span className="value">{prescription.pastHistory}</span>
                                            </div>
                                        )}
                                        {prescription.previousTreatment && (
                                            <div className="detail-row full-width">
                                                <span className="label">{isMarathi ? 'पूर्व वैद्यकीय उपचार' : 'Previous Treatment'}:</span>
                                                <span className="value">{prescription.previousTreatment}</span>
                                            </div>
                                        )}
                                        {prescription.previousMedication && (
                                            <div className="detail-row full-width">
                                                <span className="label">{isMarathi ? 'पूर्व औषधी उपचार' : 'Previous Medication'}:</span>
                                                <span className="value">{prescription.previousMedication}</span>
                                            </div>
                                        )}
                                        {prescription.dailyRoutine && (
                                            <div className="detail-row full-width">
                                                <span className="label">{isMarathi ? 'दिनचर्या' : 'Daily Routine'}:</span>
                                                <span className="value">{prescription.dailyRoutine}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Current Complaints */}
                        {prescription.currentComplaints && (
                            <div className="prescription-section">
                                <h3 className="section-title">{isMarathi ? 'सध्याच्या तक्रारी / लक्षणे' : 'Current Complaints / Symptoms'}:</h3>
                                <div className="section-content">
                                    {prescription.currentComplaints}
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

                {/* Examination Section */}
                <div className="prescription-section">
                    <h3 className="section-title">{isMarathi ? 'उदर परिक्षण' : 'Abdominal Examination'}:</h3>
                    <div className="examination-grid">
                        <div className="exam-row">
                            <span className="label">{isMarathi ? 'यकृत' : 'Liver'}:</span>
                            <span className="underline">{prescription.liverExam || ''}</span>
                            <span className="label">{isMarathi ? 'दक्षिण वृक्क' : 'Right Kidney'}:</span>
                            <span className="underline">{prescription.rightKidneyExam || ''}</span>
                        </div>
                        <div className="exam-row">
                            <span className="label">{isMarathi ? 'प्लीहा' : 'Spleen'}:</span>
                            <span className="underline">{prescription.spleenExam || ''}</span>
                            <span className="label">{isMarathi ? 'वाम वृक्क' : 'Left Kidney'}:</span>
                            <span className="underline">{prescription.leftKidneyExam || ''}</span>
                        </div>
                        <div className="exam-row">
                            <span className="label">{isMarathi ? 'अपानकक्षा' : 'Lower Abdomen'}:</span>
                            <span className="underline">{prescription.lowerAbdomenExam || ''}</span>
                        </div>
                        <div className="exam-row">
                            <span className="label">{isMarathi ? 'युक्त' : 'Diagnosis/Status'}:</span>
                            <span className="underline">{prescription.diagnosisStatus || ''}</span>
                        </div>
                        <div className="exam-row">
                            <span className="label">{isMarathi ? 'दक्षिण नाभि' : 'Right Navel'}:</span>
                            <span className="underline">{prescription.rightNavelPosition || ''}</span>
                            <span className="label">{isMarathi ? 'वाम नाभि' : 'Left Navel'}:</span>
                            <span className="underline">{prescription.leftNavelPosition || ''}</span>
                        </div>
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
