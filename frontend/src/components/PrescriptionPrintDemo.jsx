import { useState } from 'react';
import PrintablePrescription from '../components/PrintablePrescription';
import { useTranslation } from 'react-i18next';

/**
 * Demo component showing how to integrate PrintablePrescription
 * This can be added to PatientDetails or PrescriptionForm pages
 */
const PrescriptionPrintDemo = ({ patientId }) => {
    const { t } = useTranslation();
    const [showPrint, setShowPrint] = useState(false);

    // Sample prescription data - replace with actual data from API
    const samplePrescription = {
        id: 1,
        prescriptionDate: new Date().toISOString(),
        diagnosis: "सामान्य सर्दी आणि ताप",
        notes: "भरपूर पाणी प्या आणि विश्रांती घ्या",
        medicines: [
            {
                medicineName: "Paracetamol 500mg",
                dosage: "1 गोळी",
                frequency: "दिवसातून 3 वेळा",
                duration: "5 दिवस"
            },
            {
                medicineName: "Cetirizine 10mg",
                dosage: "1 गोळी",
                frequency: "रात्री 1 वेळा",
                duration: "3 दिवस"
            }
        ]
    };

    const samplePatient = {
        name: "रमेश पाटील",
        age: 45,
        gender: "पुरुष"
    };

    return (
        <div className="mt-6">
            <button
                onClick={() => setShowPrint(!showPrint)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            >
                {showPrint ? t('common.hide') : t('prescription.printPrescription')}
            </button>

            {showPrint && (
                <div className="mt-4">
                    <PrintablePrescription
                        prescription={samplePrescription}
                        patient={samplePatient}
                    />
                </div>
            )}
        </div>
    );
};

export default PrescriptionPrintDemo;
