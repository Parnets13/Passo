import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdWork, MdLocationOn, MdSearch, MdStar, MdClose,
  MdEmail, MdPhone, MdArrowForward, MdCheckCircle,
  MdPlumbing, MdElectricalServices, MdCarpenter, MdPestControl, 
  MdLocalShipping, MdPets, MdTwoWheeler, MdPeople, MdPhoneAndroid, MdQrCode2
} from 'react-icons/md';
import { FaApple, FaGooglePlay } from 'react-icons/fa';
import { 
  FaWrench, FaPlug, FaPaintRoller, FaHammer, FaTools, FaBroom, 
  FaTshirt, FaCar, FaLeaf, FaSnowflake, FaFire, FaWater, 
  FaLaptop, FaMobileAlt, FaTv, FaCamera, FaPrint, FaWifi,
  FaCouch, FaBed, FaChair, FaDoorOpen, FaWindowMaximize, FaLightbulb,
  FaShower, FaToilet, FaSink, FaBath, FaSprayCan,
  FaCut, FaSpa, FaUserMd, FaStethoscope, FaHeartbeat,
  FaDumbbell, FaRunning, FaSwimmer, FaBicycle, FaFootballBall, FaBasketballBall,
  FaPizzaSlice, FaUtensils, FaCoffee, FaBirthdayCake, FaIceCream, FaHamburger,
  FaTruck, FaShippingFast, FaBox, FaWarehouse, FaPallet, FaDolly,
  FaTree, FaSeedling, FaBug, FaRecycle, FaTrash, FaIndustry,
  FaGuitar, FaMusic, FaDrum, FaMicrophone, FaHeadphones, FaCompactDisc,
  FaBook, FaGraduationCap, FaPencilAlt, FaChalkboardTeacher, FaUserGraduate, FaCalculator,
  FaDog, FaCat, FaPaw, FaHorse, FaFish, FaKiwiBird,
  FaHome, FaBuilding, FaCity, FaStore, FaHospital,
  FaLock, FaKey, FaShieldAlt, FaVideo, FaBell, FaExclamationTriangle,
  FaWind
} from 'react-icons/fa';
import { GiCookingPot, GiWaterDrop, GiGasStove, GiMilkCarton } from 'react-icons/gi';
import WorkerLogin from './WorkerLogin';
import { getTranslation } from '../utils/translations';
import { categoryAPI } from '../services/api';
import SEO from '../components/SEO';

const Home = () => {
  const navigate = useNavigate();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Bangalore');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showWorkerLogin, setShowWorkerLogin] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const isLoadingRef = useRef(false); // Prevent duplicate API calls

  const allLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' }
  ];

  // Translations object
  const translations = {
    en: {
      selectLanguage: 'Select Your Language',
      chooseLanguage: 'Choose your preferred language to continue',
      selectCity: 'Select Your City',
      chooseLocation: 'Choose your location to find nearby services',
      searchCity: 'Search city...',
      noCitiesFound: 'No cities found',
      login: 'Login',
      register: 'Register',
      heroTitle: 'Connecting you To',
      heroSubtitle: 'local Service Expert',
      heroDescription: 'Connect with verified professionals in',
      searchPlaceholder: 'Search for services...',
      trustedBy: 'Trusted by 50,000+ Customers',
      verifiedWorkers: 'Verified Workers',
      jobsCompleted: 'Jobs Completed',
      avgRating: 'Average Rating',
      popularServices: 'Popular Services',
      allServices: 'All Services',
      crewTeam: 'Crew / Team',
      individual: 'Individual',
      areYouProfessional: 'Are you a service professional?',
      joinProfessionals: 'Join thousands of professionals and grow your business',
      registerAsWorker: 'Register as Worker',
      whatCustomersSay: 'What Our Customers Say',
      trustedByCustomers: 'Trusted by thousands of happy customers',
      getPassoApp: 'Get the Passo App',
      bookServices: 'Book services or grow your business - Available on Android & iOS',
      customerApp: 'Customer App',
      partnerApp: 'Partner App',
      scanToDownload: 'Scan to Download',
      connectDirectly: 'Connect Directly with Local Experts',
      noBookingFees: 'No Booking Fees. No Hidden Charges',
      nearbyServices: 'Nearby Services in Seconds',
      quickHelp: 'Quick Help, Just One Call Away'
    },
    hi: {
      selectLanguage: 'अपनी भाषा चुनें',
      chooseLanguage: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
      selectCity: 'अपना शहर चुनें',
      chooseLocation: 'आस-पास की सेवाएं खोजने के लिए अपना स्थान चुनें',
      searchCity: 'शहर खोजें...',
      noCitiesFound: 'कोई शहर नहीं मिला',
      login: 'लॉगिन',
      register: 'रजिस्टर',
      heroTitle: 'आपको जोड़ते हैं',
      heroSubtitle: 'स्थानीय सेवा विशेषज्ञ से',
      heroDescription: 'सत्यापित पेशेवरों से जुड़ें',
      searchPlaceholder: 'सेवाएं खोजें...',
      trustedBy: '50,000+ ग्राहकों द्वारा विश्वसनीय',
      verifiedWorkers: 'सत्यापित कर्मचारी',
      jobsCompleted: 'पूर्ण कार्य',
      avgRating: 'औसत रेटिंग',
      popularServices: 'लोकप्रिय सेवाएं',
      allServices: 'सभी सेवाएं',
      crewTeam: 'टीम',
      individual: 'व्यक्तिगत',
      areYouProfessional: 'क्या आप सेवा पेशेवर हैं?',
      joinProfessionals: 'हजारों पेशेवरों के साथ जुड़ें और अपना व्यवसाय बढ़ाएं',
      registerAsWorker: 'कर्मचारी के रूप में रजिस्टर करें',
      whatCustomersSay: 'हमारे ग्राहक क्या कहते हैं',
      trustedByCustomers: 'हजारों खुश ग्राहकों द्वारा विश्वसनीय',
      getPassoApp: 'Passo ऐप प्राप्त करें',
      bookServices: 'सेवाएं बुक करें या अपना व्यवसाय बढ़ाएं - Android और iOS पर उपलब्ध',
      customerApp: 'ग्राहक ऐप',
      partnerApp: 'पार्टनर ऐप',
      scanToDownload: 'डाउनलोड करने के लिए स्कैन करें',
      connectDirectly: 'स्थानीय विशेषज्ञों से सीधे जुड़ें',
      noBookingFees: 'कोई बुकिंग शुल्क नहीं। कोई छिपा शुल्क नहीं',
      nearbyServices: 'सेकंड में आस-पास की सेवाएं',
      quickHelp: 'त्वरित सहायता, बस एक कॉल दूर'
    },
    kn: {
      selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      chooseLanguage: 'ಮುಂದುವರಿಸಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ',
      selectCity: 'ನಿಮ್ಮ ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      chooseLocation: 'ಹತ್ತಿರದ ಸೇವೆಗಳನ್ನು ಹುಡುಕಲು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆರಿಸಿ',
      searchCity: 'ನಗರವನ್ನು ಹುಡುಕಿ...',
      noCitiesFound: 'ಯಾವುದೇ ನಗರಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      login: 'ಲಾಗಿನ್',
      register: 'ನೋಂದಣಿ',
      heroTitle: 'ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಿದೆ',
      heroSubtitle: 'ಸ್ಥಳೀಯ ಸೇವಾ ತಜ್ಞರಿಗೆ',
      heroDescription: 'ಪರಿಶೀಲಿತ ವೃತ್ತಿಪರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
      searchPlaceholder: 'ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ...',
      trustedBy: '50,000+ ಗ್ರಾಹಕರಿಂದ ವಿಶ್ವಾಸಾರ್ಹ',
      verifiedWorkers: 'ಪರಿಶೀಲಿತ ಕಾರ್ಯಕರ್ತರು',
      jobsCompleted: 'ಪೂರ್ಣಗೊಂಡ ಕೆಲಸಗಳು',
      avgRating: 'ಸರಾಸರಿ ರೇಟಿಂಗ್',
      popularServices: 'ಜನಪ್ರಿಯ ಸೇವೆಗಳು',
      allServices: 'ಎಲ್ಲಾ ಸೇವೆಗಳು',
      crewTeam: 'ತಂಡ',
      individual: 'ವೈಯಕ್ತಿಕ',
      areYouProfessional: 'ನೀವು ಸೇವಾ ವೃತ್ತಿಪರರೇ?',
      joinProfessionals: 'ಸಾವಿರಾರು ವೃತ್ತಿಪರರೊಂದಿಗೆ ಸೇರಿ ಮತ್ತು ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಬೆಳೆಸಿ',
      registerAsWorker: 'ಕಾರ್ಯಕರ್ತರಾಗಿ ನೋಂದಣಿ ಮಾಡಿ',
      whatCustomersSay: 'ನಮ್ಮ ಗ್ರಾಹಕರು ಏನು ಹೇಳುತ್ತಾರೆ',
      trustedByCustomers: 'ಸಾವಿರಾರು ಸಂತೋಷದ ಗ್ರಾಹಕರಿಂದ ವಿಶ್ವಾಸಾರ್ಹ',
      getPassoApp: 'Passo ಅಪ್ಲಿಕೇಶನ್ ಪಡೆಯಿರಿ',
      bookServices: 'ಸೇವೆಗಳನ್ನು ಬುಕ್ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಬೆಳೆಸಿ - Android ಮತ್ತು iOS ನಲ್ಲಿ ಲಭ್ಯವಿದೆ',
      customerApp: 'ಗ್ರಾಹಕ ಅಪ್ಲಿಕೇಶನ್',
      partnerApp: 'ಪಾಲುದಾರ ಅಪ್ಲಿಕೇಶನ್',
      scanToDownload: 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ',
      connectDirectly: 'ಸ್ಥಳೀಯ ತಜ್ಞರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ',
      noBookingFees: 'ಯಾವುದೇ ಬುಕಿಂಗ್ ಶುಲ್ಕವಿಲ್ಲ. ಯಾವುದೇ ಗುಪ್ತ ಶುಲ್ಕಗಳಿಲ್ಲ',
      nearbyServices: 'ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಹತ್ತಿರದ ಸೇವೆಗಳು',
      quickHelp: 'ತ್ವರಿತ ಸಹಾಯ, ಕೇವಲ ಒಂದು ಕರೆ ದೂರದಲ್ಲಿ'
    }
  };

  // Get current translation
  const t = getTranslation(selectedLanguage);

  const allCities = [
    'Bangalore', 'Mysuru', 'Mumbai', 'Delhi', 'Hyderabad', 
    'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
  ];

  const filteredCities = allCities.filter(city =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const allServices = categories.map(cat => cat.name);

  const filteredServices = allServices.filter(service =>
    service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Map icon names from database to React components
  const getIconComponent = (iconName) => {
    const iconMap = {
      // General Services
      FaWrench, FaTools, FaHammer, FaBroom, FaSprayCan,
      // Electrical & Electronics
      FaPlug, FaLightbulb, FaLaptop, FaMobileAlt, FaTv, FaCamera, FaPrint, FaWifi,
      // Home & Interior
      FaPaintRoller, FaCouch, FaBed, FaChair, FaDoorOpen, FaWindowMaximize, FaHome,
      // Plumbing & Bathroom
      FaWater, FaShower, FaToilet, FaSink, FaBath,
      // HVAC & Climate
      FaSnowflake, FaFire, FaWind,
      // Automotive
      FaCar, FaTruck, FaBicycle,
      // Beauty & Wellness
      FaCut, FaSpa, FaUserMd, FaStethoscope, FaHeartbeat,
      // Fitness & Sports
      FaDumbbell, FaRunning, FaSwimmer, FaFootballBall, FaBasketballBall,
      // Food & Catering
      FaPizzaSlice, FaUtensils, FaCoffee, FaBirthdayCake, FaIceCream, FaHamburger,
      // Logistics & Moving
      FaShippingFast, FaBox, FaWarehouse, FaPallet, FaDolly,
      // Gardening & Outdoor
      FaLeaf, FaTree, FaSeedling, FaBug, FaRecycle, FaTrash,
      // Music & Entertainment
      FaGuitar, FaMusic, FaDrum, FaMicrophone, FaHeadphones, FaCompactDisc,
      // Education & Training
      FaBook, FaGraduationCap, FaPencilAlt, FaChalkboardTeacher, FaUserGraduate, FaCalculator,
      // Pet Services
      FaDog, FaCat, FaPaw, FaHorse, FaFish, FaKiwiBird,
      // Buildings & Property
      FaBuilding, FaCity, FaStore, FaHospital, FaIndustry,
      // Security & Safety
      FaLock, FaKey, FaShieldAlt, FaVideo, FaBell, FaExclamationTriangle,
      // Laundry & Clothing
      FaTshirt,
      // Material Design Icons (fallback for old categories)
      MdPlumbing, MdElectricalServices, MdCarpenter, MdPestControl, 
      MdLocalShipping, MdPets, MdTwoWheeler,
      // Game Icons (fallback for old categories)
      GiCookingPot, GiWaterDrop, GiGasStove, GiMilkCarton
    };
    
    return iconMap[iconName] || FaWrench; // Default to wrench if icon not found
  };

  // Color palette for categories
  const categoryColors = [
    '#06b6d4', '#a855f7', '#84cc16', '#ec4899', '#6366f1', 
    '#f59e0b', '#d97706', '#3b82f6', '#64748b', '#f97316',
    '#10b981', '#14b8a6', '#ef4444', '#8b5cf6', '#2596be',
    '#f43f5e', '#0ea5e9', '#22c55e', '#eab308', '#6366f1'
  ];

  // Convert backend categories to display format with icons from database
  const displayCategories = categories.map((cat, index) => {
    const IconComponent = getIconComponent(cat.icon);
    return {
      id: cat._id,
      name: cat.name,
      icon: <IconComponent />,
      color: categoryColors[index % categoryColors.length],
      workerTypes: cat.workerTypes
    };
  });

  useEffect(() => {
    // Load categories from backend only once
    loadCategories();

    // Check if language is already saved in localStorage
    const savedLanguage = localStorage.getItem('userLanguage');
    const savedLocation = localStorage.getItem('userLocation');
    
    if (!savedLanguage) {
      // Show language modal first if not selected
      setShowLanguageModal(true);
      setShowLocationModal(false);
    } else {
      setSelectedLanguage(savedLanguage);
      
      // Then check location
      if (!savedLocation) {
        setShowLocationModal(true);
      } else {
        setSelectedLocation(savedLocation);
        setShowLocationModal(false);
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Empty dependency array - run only once on mount

  const loadCategories = async (retryCount = 0) => {
    // Prevent duplicate calls
    if (isLoadingRef.current) {
      console.log('⏭️ Skipping duplicate API call');
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoadingCategories(true);
      const response = await categoryAPI.getAll();
      console.log('📦 Raw API response:', response);
      
      if (response && response.success && Array.isArray(response.data)) {
        // Only show active categories
        const activeCategories = response.data.filter(cat => cat.active);
        setCategories(activeCategories);
        setLoadingCategories(false);
        isLoadingRef.current = false;
        console.log('✅ Loaded categories:', activeCategories.length, 'active categories');
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        setCategories([]);
        setLoadingCategories(false);
        isLoadingRef.current = false;
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
      
      // Retry logic - try up to 2 times with 2 second delay
      if (retryCount < 2) {
        console.log(`🔄 Retrying... (attempt ${retryCount + 1}/2)`);
        isLoadingRef.current = false; // Allow retry
        setTimeout(() => {
          loadCategories(retryCount + 1);
        }, 2000);
      } else {
        // After all retries failed, set empty array and stop loading
        console.error('❌ All retry attempts failed');
        setCategories([]);
        setLoadingCategories(false);
        isLoadingRef.current = false;
      }
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.name);
    localStorage.setItem('userLanguage', language.name);
    
    // Smooth fade out animation before closing
    const modalElement = document.querySelector('.language-modal');
    if (modalElement) {
      modalElement.style.opacity = '0';
      modalElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        setShowLanguageModal(false);
        
        // After language selection, check if location is selected
        const savedLocation = localStorage.getItem('userLocation');
        if (!savedLocation) {
          setShowLocationModal(true);
        }
      }, 300);
    } else {
      setShowLanguageModal(false);
      const savedLocation = localStorage.getItem('userLocation');
      if (!savedLocation) {
        setShowLocationModal(true);
      }
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('userLocation', location);
    setShowLocationModal(false);
    setLocationSearch('');
  };

  const handleServiceSelect = (service) => {
    setSearchQuery(service);
    setShowServiceDropdown(false);
    // Navigate to category page
    navigate(`/category/${service.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowServiceDropdown(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* SEO Component */}
      <SEO 
        title={`Passo - Find Local Service Experts in ${selectedLocation} | Home Services Platform`}
        description={`Connect with verified professionals for plumbing, electrical, cleaning, AC repair, carpentry, and more in ${selectedLocation}. Book trusted local workers with 4.8★ rating. 50,000+ jobs completed.`}
        keywords={`local services ${selectedLocation}, home services ${selectedLocation}, plumber ${selectedLocation}, electrician ${selectedLocation}, carpenter ${selectedLocation}, cleaning services ${selectedLocation}, AC repair ${selectedLocation}, pest control ${selectedLocation}, verified workers, service booking, home maintenance`}
        canonical="https://passo.com/"
      />
      
      {/* Worker Login Modal */}
      {showWorkerLogin && (
        <WorkerLogin onClose={() => setShowWorkerLogin(false)} />
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="language-modal bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out" style={{ opacity: 1, transform: 'scale(1)' }}>
            {/* Close Button */}
            <button
              onClick={() => {
                const modalElement = document.querySelector('.language-modal');
                if (modalElement) {
                  modalElement.style.opacity = '0';
                  modalElement.style.transform = 'scale(0.95)';
                }
                setTimeout(() => setShowLanguageModal(false), 300);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Close"
            >
              <MdClose size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#26296c]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.selectLanguage}</h2>
              <p className="text-gray-600">{t.chooseLanguage}</p>
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className="group p-4 bg-gray-50 hover:bg-[#26296c] rounded-xl text-center font-medium text-gray-700 hover:text-white transition-all duration-200 border-2 border-gray-200 hover:border-[#26296c] flex flex-col items-center gap-2 transform hover:scale-105"
                >
                  <span className="text-2xl">{language.nativeName}</span>
                  <span className="text-sm">{language.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal with Search */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              aria-label="Close"
            >
              <MdClose size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#26296c]">
                <MdLocationOn size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.selectCity}</h2>
              <p className="text-gray-600">{t.chooseLocation}</p>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.searchCity}
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#26296c] focus:ring-4 focus:ring-[#26296c]/10 transition-all"
                />
              </div>
            </div>

            {/* Cities List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredCities.length > 0 ? (
                filteredCities.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full py-3 px-4 bg-gray-50 hover:bg-[#26296c] hover:text-white rounded-xl text-left font-medium text-gray-700 transition-all border border-gray-200 hover:border-transparent flex items-center gap-3"
                  >
                    <MdLocationOn size={20} />
                    <span>{location}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MdLocationOn size={48} className="mx-auto mb-2 opacity-30" />
                  <p>{t.noCitiesFound}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Premium Header - Mobile Responsive */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between py-2 sm:py-3 gap-1 sm:gap-2">
            {/* Logo Section */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <img 
                src="/logo.jpeg" 
                alt="Passo" 
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%2326296c" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle"%3EP%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-[#26296c]">
                  Passo
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-medium -mt-0.5 sm:-mt-1 hidden xs:block">
                  Your Service Partner
                </span>
              </div>
            </div>

            {/* Right Section - Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Language Selector */}
              <button
                onClick={() => setShowLanguageModal(true)}
                className="flex items-center justify-center gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 text-gray-700 hover:text-[#26296c] transition-all text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 border border-gray-200 min-w-[32px] sm:min-w-[40px]"
                title="Select Language"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden md:inline truncate max-w-[60px] lg:max-w-[80px]">
                  {allLanguages.find(lang => lang.name === selectedLanguage)?.nativeName || 'English'}
                </span>
              </button>

              {/* Location Button */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center justify-center gap-1 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 text-gray-700 hover:text-[#26296c] transition-all text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-50 min-w-[32px] sm:min-w-[40px]"
                title={selectedLocation}
              >
                <MdLocationOn size={16} className="text-[#26296c] flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                <span className="hidden md:inline truncate max-w-[60px] lg:max-w-[100px]">{selectedLocation}</span>
              </button>

              {/* Login Button */}
              <button
                onClick={() => setShowWorkerLogin(true)}
                className="px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-semibold transition-all text-[#26296c] border-2 border-[#26296c] hover:bg-[#26296c] hover:text-white text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
              >
                {t.login}
              </button>

              {/* Register Button */}
              <button
                onClick={() => navigate('/worker-registration')}
                className="px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-semibold transition-all text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-[#26296c] hover:bg-[#1e2154] text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
              >
                {t.register}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium & Clean with Animations */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#26296c]/10 to-blue-400/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/5 to-[#26296c]/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          
          {/* Floating Geometric Shapes */}
          <div className="absolute top-1/4 left-1/4 w-20 h-20 border-2 border-[#26296c]/20 rounded-lg rotate-45 animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-16 h-16 border-2 border-blue-400/20 rounded-full animate-float-slow"></div>
          <div className="absolute top-1/2 right-1/3 w-12 h-12 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-lg animate-float animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-24 h-24 border-2 border-purple-400/20 rounded-full animate-float-slow animation-delay-4000"></div>
          
          {/* Small Floating Dots */}
          <div className="absolute top-20 right-20 w-3 h-3 bg-[#26296c]/30 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-40 left-40 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce-slow animation-delay-2000"></div>
          <div className="absolute bottom-40 right-40 w-4 h-4 bg-purple-400/30 rounded-full animate-bounce-slow animation-delay-4000"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-pink-400/40 rounded-full animate-bounce-slow"></div>
          
          {/* Animated Lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#26296c]/20 to-transparent animate-slide-right"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-slide-left"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(38,41,108,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(38,41,108,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-white/80"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#26296c]/20 rounded-full mb-6 shadow-lg opacity-0 animate-fade-in-down" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-1">
                <MdStar className="text-yellow-500" size={16} />
                <MdStar className="text-yellow-500" size={16} />
                <MdStar className="text-yellow-500" size={16} />
              </div>
              <span className="text-sm font-semibold text-gray-700">{t.trustedBy}</span>
            </div>

            {/* Main Heading with Gradient Animation */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              {t.heroTitle}
              <span className="block bg-gradient-to-r from-[#26296c] via-blue-600 to-[#26296c] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                 {t.heroSubtitle}
              </span>
            </h1>

            {/* Subtitle with Animation */}
            <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 px-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              {t.heroDescription} <span className="font-semibold text-[#26296c]">{selectedLocation}</span>
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <MdCheckCircle className="text-green-600" size={18} />
                </div>
                <span className="font-medium">{t.connectDirectly}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MdCheckCircle className="text-blue-600" size={18} />
                </div>
                <span className="font-medium">{t.noBookingFees}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <MdCheckCircle className="text-purple-600" size={18} />
                </div>
                <span className="font-medium">{t.nearbyServices}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:scale-105 transition-transform">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <MdCheckCircle className="text-orange-600" size={18} />
                </div>
                <span className="font-medium">{t.quickHelp}</span>
              </div>
            </div>

            {/* Premium Search Bar with Dropdown */}
            <div className="max-w-3xl mx-auto px-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
              <div className="relative search-container group">
                <MdSearch className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-500 z-10 group-focus-within:text-[#26296c] transition-colors pointer-events-none" size={24} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowServiceDropdown(true)}
                  className="w-full pl-14 sm:pl-20 pr-20 sm:pr-24 py-4 sm:py-5 text-base sm:text-lg font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#26296c] focus:ring-4 focus:ring-[#26296c]/10 transition-all shadow-lg hover:shadow-xl placeholder:text-gray-400 placeholder:font-normal"
                  style={{ backgroundColor: '#ffffff' }}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-2 text-xs text-gray-400 pointer-events-none z-10">
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">⌘</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">K</kbd>
                </div>

                {/* Services Dropdown */}
                {showServiceDropdown && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-[100]" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
                    {filteredServices.length > 0 ? (
                      <div className="p-3" style={{ backgroundColor: '#ffffff' }}>
                        {filteredServices.map((service, index) => {
                          const category = displayCategories.find(c => c.name === service);
                          return (
                            <button
                              key={index}
                              onClick={() => handleServiceSelect(service)}
                              className="w-full text-left px-4 py-4 rounded-xl transition-all flex items-center gap-4 group mb-1"
                              style={{ backgroundColor: '#ffffff' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                            >
                              <div 
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: category?.color || '#26296c' }}
                              >
                                {category?.icon || <MdSearch size={20} />}
                              </div>
                              <div className="flex-1 min-w-0 pr-4">
                                <div className="font-bold text-base text-gray-900 group-hover:text-[#26296c] mb-1">
                                  {service}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                  Available in {selectedLocation}
                                </div>
                              </div>
                              <MdArrowForward className="text-gray-400 group-hover:text-[#26296c] group-hover:translate-x-1 transition-all flex-shrink-0" size={20} />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500" style={{ backgroundColor: '#ffffff' }}>
                        <MdSearch size={48} className="mx-auto mb-3 opacity-30" />
                        <p className="text-base font-semibold">No services found</p>
                        <p className="text-sm mt-2">Try searching for &quot;Plumber&quot;, &quot;Electrician&quot;, etc.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Animated Stats with Premium Design */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12 px-4">
            <div className="text-center group hover:scale-105 transition-transform opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 bg-[#26296c]/10 rounded-2xl blur-xl group-hover:bg-[#26296c]/20 transition-all"></div>
                <div className="relative text-2xl sm:text-4xl font-bold text-[#26296c] mb-1 sm:mb-2">10K+</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">{t.verifiedWorkers}</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform opacity-0 animate-fade-in-up" style={{ animationDelay: '1.4s', animationFillMode: 'forwards' }}>
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 bg-[#26296c]/10 rounded-2xl blur-xl group-hover:bg-[#26296c]/20 transition-all"></div>
                <div className="relative text-2xl sm:text-4xl font-bold text-[#26296c] mb-1 sm:mb-2">50K+</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">{t.jobsCompleted}</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform opacity-0 animate-fade-in-up" style={{ animationDelay: '1.6s', animationFillMode: 'forwards' }}>
              <div className="relative inline-block mb-2">
                <div className="absolute inset-0 bg-yellow-500/10 rounded-2xl blur-xl group-hover:bg-yellow-500/20 transition-all"></div>
                <div className="relative text-2xl sm:text-4xl font-bold text-[#26296c] mb-1 sm:mb-2 flex items-center justify-center gap-1">
                  4.8 <MdStar size={20} className="text-yellow-500 sm:w-8 sm:h-8 animate-pulse" />
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">{t.avgRating}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Premium Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{t.popularServices}</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Choose from our wide range of services</p>
          </div>

          {/* All Active Services */}
          {loadingCategories ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#26296c] mx-auto mb-4"></div>
              <p className="text-gray-500">Loading services...</p>
            </div>
          ) : displayCategories.length === 0 ? (
            <div className="text-center py-12">
              <MdWork size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-4">No services available at the moment</p>
              <button
                onClick={() => loadCategories(0)}
                className="px-6 py-2 bg-[#26296c] text-white rounded-lg hover:bg-[#1e2154] transition-all"
              >
                Retry Loading Services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
              {displayCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  className="group p-4 sm:p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#26296c] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div 
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 rounded-xl flex items-center justify-center text-white text-xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-[#26296c] transition-colors text-center">
                    {category.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 text-center">{category.workerTypes.join(', ')}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Worker CTA - Premium */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 text-white text-center shadow-2xl bg-[#26296c]">
          <MdWork size={40} className="mx-auto mb-4 sm:mb-6 sm:w-12 sm:h-12" />
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{t.areYouProfessional}</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 text-blue-50">{t.joinProfessionals}</p>
          <button
            onClick={() => navigate('/worker-registration')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#26296c] font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 text-sm sm:text-base"
          >
            {t.registerAsWorker}
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-4">
              <MdStar className="text-yellow-500" size={20} />
              <span className="text-sm font-semibold text-gray-700">4.8/5 {t.avgRating}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">{t.whatCustomersSay}</h2>
            <p className="text-sm sm:text-base text-gray-600">{t.trustedByCustomers}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow line-clamp-4">
                "Excellent service! Found a reliable plumber within minutes. The booking process was smooth and the professional arrived on time."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26296c] to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  R
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Rajesh Kumar</h4>
                  <p className="text-xs text-gray-500">Bangalore</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow line-clamp-4">
                "Amazing platform! I've used it for cleaning and AC repair services. All workers are verified and professional. Great experience every time."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26296c] to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Priya Sharma</h4>
                  <p className="text-xs text-gray-500">Mumbai</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow line-clamp-4">
                "Best service marketplace I've used! Quick response, transparent pricing, and quality work. The electrician fixed my issue perfectly."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26296c] to-green-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Amit Patel</h4>
                  <p className="text-xs text-gray-500">Pune</p>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow line-clamp-4">
                "As a working professional, Passo has been a lifesaver! From laundry to home cleaning, everything is just a click away. Truly convenient!"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26296c] to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  S
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Sneha Reddy</h4>
                  <p className="text-xs text-gray-500">Hyderabad</p>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow line-clamp-4">
                "Impressed with the quality of service providers. Used it for carpenter work and the result exceeded my expectations. Will definitely use again!"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26296c] to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  V
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Vikram Singh</h4>
                  <p className="text-xs text-gray-500">Delhi</p>
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <MdStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed flex-grow line-clamp-4">
                "Fast, reliable, and affordable! Got my AC serviced within hours of booking. The technician was professional and explained everything clearly."
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#26296c] to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  M
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Meera Iyer</h4>
                  <p className="text-xs text-gray-500">Chennai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Download Section */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 bg-gradient-to-br from-[#26296c] via-[#1e2154] to-[#2d3a8c]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3">
              <MdPhoneAndroid className="text-white" size={18} />
              <span className="text-xs font-semibold text-white">Download Our Apps</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {t.getPassoApp}
            </h2>
            
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
              {t.bookServices}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Customer App */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all hover:border-blue-300/40 flex flex-col">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-3">
                  <MdPhoneAndroid className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t.customerApp}</h3>
                <p className="text-blue-200 text-sm">{t.bookServicesInstantly}</p>
              </div>

              <div className="space-y-2 mb-auto flex flex-col items-center">
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <MdCheckCircle className="text-blue-300 flex-shrink-0" size={16} />
                  <span>Connect with Local Experts</span>
                </div>
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <MdCheckCircle className="text-blue-300 flex-shrink-0" size={16} />
                  <span>No Hidden Charges</span>
                </div>
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <MdCheckCircle className="text-blue-300 flex-shrink-0" size={16} />
                  <span>Nearby Services Fast</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => setShowComingSoonModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all shadow-md hover:shadow-lg text-sm group border border-white/30"
                >
                  <FaGooglePlay className="text-white" size={18} />
                  <div className="text-left">
                    <div className="text-[10px] text-blue-200 leading-none">GET IT ON</div>
                    <div className="text-white font-semibold text-sm">Google Play</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowComingSoonModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all shadow-md hover:shadow-lg text-sm group border border-white/30"
                >
                  <FaApple className="text-white" size={22} />
                  <div className="text-left">
                    <div className="text-[10px] text-blue-200 leading-none">Download on</div>
                    <div className="text-white font-semibold text-sm">App Store</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Partner App */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all hover:border-orange-300/40 flex flex-col">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mb-3">
                  <MdWork className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{t.partnerApp}</h3>
                <p className="text-blue-200 text-sm">{t.growYourBusiness}</p>
              </div>

              <div className="space-y-2 mb-auto flex flex-col items-center">
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <MdCheckCircle className="text-orange-300 flex-shrink-0" size={16} />
                  <span>No Booking Fees</span>
                </div>
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <MdCheckCircle className="text-orange-300 flex-shrink-0" size={16} />
                  <span>Track Earnings Easily</span>
                </div>
                <div className="flex items-center gap-2 text-blue-50 text-sm">
                  <MdCheckCircle className="text-orange-300 flex-shrink-0" size={16} />
                  <span>Get More Customers</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => setShowComingSoonModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all shadow-md hover:shadow-lg text-sm group border border-white/30"
                >
                  <FaGooglePlay className="text-white" size={18} />
                  <div className="text-left">
                    <div className="text-[10px] text-blue-200 leading-none">GET IT ON</div>
                    <div className="text-white font-semibold text-sm">Google Play</div>
                  </div>
                </button>

                <button
                  onClick={() => setShowComingSoonModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all shadow-md hover:shadow-lg text-sm group border border-white/30"
                >
                  <FaApple className="text-white" size={22} />
                  <div className="text-left">
                    <div className="text-[10px] text-blue-200 leading-none">Download on</div>
                    <div className="text-white font-semibold text-sm">App Store</div>
                  </div>
                </button>
              </div>
            </div>

            {/* QR Codes Section - Right Side */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-white mb-4 text-center">{t.scanToDownload}</h3>
              
              {/* Customer App QR Codes */}
              <div className="mb-4">
                <p className="text-sm text-blue-200 mb-3 text-center font-semibold">Customer App</p>
                <div className="flex gap-3 justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-lg p-1 mb-1.5 flex items-center justify-center shadow-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/coming-soon?app=customer&platform=android')}`}
                        alt="Customer Android QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-blue-200">
                      <FaGooglePlay size={10} />
                      <span>Android</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-lg p-1 mb-1.5 flex items-center justify-center shadow-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/coming-soon?app=customer&platform=ios')}`}
                        alt="Customer iOS QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-blue-200">
                      <FaApple size={10} />
                      <span>iOS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/20 my-3"></div>

              {/* Partner App QR Codes */}
              <div>
                <p className="text-sm text-blue-200 mb-3 text-center font-semibold">Partner App</p>
                <div className="flex gap-3 justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-lg p-1 mb-1.5 flex items-center justify-center shadow-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/coming-soon?app=partner&platform=android')}`}
                        alt="Partner Android QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-blue-200">
                      <FaGooglePlay size={10} />
                      <span>Android</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-lg p-1 mb-1.5 flex items-center justify-center shadow-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/coming-soon?app=partner&platform=ios')}`}
                        alt="Partner iOS QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-blue-200">
                      <FaApple size={10} />
                      <span>iOS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">100K+</div>
              <div className="text-xs text-blue-200">{t.downloads}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center justify-center gap-1">
                4.5 <MdStar className="text-yellow-300" size={20} />
              </div>
              <div className="text-xs text-blue-200">{t.appRating}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-xs text-blue-200">{t.reviews}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer before footer */}
      <div className="h-8 sm:h-12 bg-gradient-to-b from-[#2d3a8c]/30 to-transparent"></div>

      {/* Footer - Compact & Modern */}
      <footer className="bg-[#26296c] text-white">
        <div className="container mx-auto px-6 py-12">
          {/* Top Section - Brand & Links */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/src/assets/logo.jpeg" 
                  alt="Passo" 
                  className="w-10 h-10 object-contain rounded-lg"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="text-2xl font-bold text-white">Passo</span>
              </div>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Connect with verified professionals for all your service needs.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Services Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">All Categories</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Popular Services</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" onClick={() => navigate('/worker-registration')} className="text-blue-100 hover:text-white transition-colors">Become a Worker</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-blue-100">
                  <MdPhone size={16} className="mt-0.5 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-start gap-2 text-blue-100">
                  <MdEmail size={16} className="mt-0.5 flex-shrink-0" />
                  <span>support@passo.com</span>
                </li>
                <li className="flex items-start gap-2 text-blue-100">
                  <MdLocationOn size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Available in 20+ Cities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
              <p className="text-blue-100">© 2026 Passo. All rights reserved.</p>
              <div className="flex gap-5 text-blue-100">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-visible animate-slideUp">
            {/* Close Button */}
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="absolute -top-2 -right-2 z-20 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center transition-all hover:rotate-90 duration-300 shadow-lg border-2 border-gray-100"
            >
              <MdClose size={20} className="text-gray-700" />
            </button>

            {/* Coming Soon Badge - Overlapping at Top */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-6 py-2 rounded-full shadow-xl border-4 border-white">
                <h2 className="text-lg font-bold text-white tracking-wide">Coming Soon!</h2>
              </div>
            </div>

            {/* Content */}
            <div className="pt-10 pb-6 px-6">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg flex items-center justify-center p-2 border-2 border-blue-200">
                  <img 
                    src="/src/assets/logo.jpeg" 
                    alt="Passo Logo" 
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">P</div>';
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="text-center mb-5">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our mobile apps will be available soon on Android & iOS
                </p>
              </div>

              {/* Quote */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-5 border border-blue-100">
                <p className="text-gray-700 text-sm text-center leading-relaxed italic">
                  "Your trusted partner for all home services"
                </p>
                <p className="text-blue-600 font-semibold text-xs text-center mt-2">- Team Passo</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Got it!
              </button>

              {/* Footer Note */}
              <p className="text-center text-gray-400 text-xs mt-3">
                Use our web platform meanwhile
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
