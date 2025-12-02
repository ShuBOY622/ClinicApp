import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaHeart, FaUserMd, FaCalendarAlt, FaPrescriptionBottleAlt, FaClipboardList } from 'react-icons/fa';

const LandingPage = () => {
    const navigate = useNavigate();

    const services = [
        {
            icon: FaStethoscope,
            title: 'General Consultation',
            description: 'Comprehensive health checkups and medical consultations'
        },
        {
            icon: FaHeart,
            title: 'Preventive Care',
            description: 'Regular health monitoring and disease prevention programs'
        },
        {
            icon: FaPrescriptionBottleAlt,
            title: 'Prescription Management',
            description: 'Digital prescription tracking and medicine management'
        },
        {
            icon: FaCalendarAlt,
            title: 'Follow-up Care',
            description: 'Scheduled follow-ups and continuous patient monitoring'
        },
        {
            icon: FaClipboardList,
            title: 'Diet Planning',
            description: 'Personalized nutrition plans and dietary guidance'
        },
        {
            icon: FaUserMd,
            title: 'Expert Care',
            description: 'Experienced medical professionals dedicated to your health'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Clinic Logo" className="h-12 w-12 object-contain" />
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                                    साई मुलव्याध फिमोसिस कॉस्मेटिक पंचकर्म सेंटर
                                </h1>
                                <p className="text-sm text-slate-600">Your Health, Our Priority</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Doctor Login
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Welcome to
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                                Dr. Ramesh Tarakh Clinic
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                            Providing compassionate, comprehensive healthcare with modern technology
                            and personalized patient care
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Access Portal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                            Our Services
                        </h3>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Comprehensive healthcare services tailored to meet your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
                            >
                                <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <service.icon className="h-7 w-7 text-sky-600" />
                                </div>
                                <h4 className="text-xl font-semibold text-slate-800 mb-2">
                                    {service.title}
                                </h4>
                                <p className="text-slate-600">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <img src="/logo.png" alt="Clinic Logo" className="h-10 w-10 object-contain bg-white rounded-full p-1" />
                            <h4 className="text-2xl font-bold">साई मुलव्याध फिमोसिस कॉस्मेटिक पंचकर्म सेंटर</h4>
                        </div>
                        <p className="text-slate-400 mb-6">
                            Committed to providing exceptional healthcare services
                        </p>
                        <div className="border-t border-slate-700 pt-6">
                            <p className="text-slate-500 text-sm">
                                © 2024 साई मुळव्याध फिमोसिस कॉस्मेटिक पंचकर्म सेंटर All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
