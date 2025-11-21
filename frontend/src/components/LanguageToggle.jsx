import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';

const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'mr' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-sky-700 transition-all duration-200"
            title="Toggle Language / भाषा बदला"
        >
            <FaGlobe className="h-4 w-4" />
            <span className="text-sm font-medium">
                {i18n.language === 'en' ? 'मराठी' : 'English'}
            </span>
        </button>
    );
};

export default LanguageToggle;
