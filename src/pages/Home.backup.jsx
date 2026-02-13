import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdWork, MdLocationOn, MdSearch, MdClose, MdStar, MdTrendingUp, 
  MdVerified, MdEmail, MdPhone, MdDownload, MdCheckCircle,
  MdCleaningServices, MdPlumbing, MdElectricalServices,
  MdCarpenter, MdPestControl, MdLocalShipping, MdPets,
  MdWater, MdTwoWheeler, MdKitchen, MdTv, MdSpeed, MdSupport,
  MdAttachMoney, MdGroups, MdRocketLaunch, MdArrowForward, MdLocalFireDepartment,
  MdSecurity, MdThumbUp
} from 'react-icons/md';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp,
  FaWind, FaBroom, FaTools, FaTshirt
} from 'react-icons/fa';
import { 
  GiCookingPot, GiWaterDrop, GiGasStove, GiMilkCarton
} from 'react-icons/gi';

const Home = () => {
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const quotes = [
    "Your skills deserve recognition. Join us today!",
    "Connecting talent with opportunity, one job at a time.",
    "Build your future. Showcase your expertise.",
    "Where skilled workers meet endless possibilities.",
    "Empowering workers, enabling success."
  ];

  // Top hitting categories with React Icons only
  const categories = [
    { id: 1, name: 'Laundry Service', icon: <FaTshirt />, color: 'from-blue-500 via-blue-600 to-indigo-600', desc: 'Wash & Fold, Dry Clean' },
    { id: 2, name: 'Milk Delivery', icon: <GiMilkCarton />, color: 'from-slate-100 via-gray-200 to-slate-300', desc: 'Daily Fresh Milk', isDark: true },
    { id: 3, name: 'House Cleaning', icon: <FaBroom />, color: 'from-green-500 via-emerald-600 to-teal-600', desc: 'Deep & Regular Cleaning' },
    { id: 4, name: 'AC Repair', icon: <FaWind />, color: 'from-cyan-400 via-blue-500 to-blue-600', desc: 'Service & Installation' },
    { id: 5, name: 'Plumber', icon: <MdPlumbing />, color: 'from-blue-600 via-indigo-600 to-purple-600', desc: 'Pipe & Leak Fixing' },
    { id: 6, name: 'Electrician', icon: <MdElectricalServices />, color: 'from-yellow-400 via-orange-500 to-red-500', desc: 'Wiring & Repairs' },
    { id: 7, name: 'RO / Water Purifier', icon: <GiWaterDrop />, color: 'from-blue-400 via-cyan-500 to-teal-500', desc: 'Service & Installation' },
    { id: 8, name: 'Gas Stove Repair', icon: <GiGasStove />, color: 'from-red-500 via-orange-600 to-amber-600', desc: 'All Brands' },
    { id: 9, name: 'Bike Repair', icon: <MdTwoWheeler />, color: 'from-gray-600 via-gray-700 to-slate-800', desc: 'Service & Maintenance' },
    { id: 10, name: 'Packers & Movers', icon: <MdLocalShipping />, color: 'from-purple-500 via-pink-500 to-rose-500', desc: 'Local & Intercity' },
    { id: 11, name: 'Cook / Maid', icon: <GiCookingPot />, color: 'from-orange-500 via-red-500 to-pink-500', desc: 'Full-time & Part-time' },
    { id: 12, name: 'Pet Care', icon: <MdPets />, color: 'from-pink-500 via-rose-500 to-red-500', desc: 'Grooming & Training' },
    { id: 13, name: 'Carpenter', icon: <MdCarpenter />, color: 'from-amber-600 via-orange-700 to-red-700', desc: 'Furniture & Repairs' },
    { id: 14, name: 'Pest Control', icon: <MdPestControl />, color: 'from-lime-500 via-green-600 to-emerald-600', desc: 'Termite & Cockroach' },
    { id: 15, name: 'Appliance Repair', icon: <FaTools />, color: 'from-indigo-500 via-purple-600 to-violet-600', desc: 'WM, Fridge, TV' }
  ];

  // Mock worker data
  const mockWorkers = [
    { id: 1, name: 'John Doe', category: 'Plumber', rating: 4.8, jobs: 150, location: 'Downtown', verified: true },
    { id: 2, name: 'Jane Smith', category: 'Electrician', rating: 4.9, jobs: 200, location: 'Uptown', verified: true },
    { id: 3, name: 'Mike Johnson', category: 'Carpenter', rating: 4.7, jobs: 120, location: 'Downtown', verified: false }
  ];

  useEffect(() => {
    // Always show location modal on page load/refresh
    setShowLocationModal(true);

    // Rotate quotes every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('userLocation', location);
    setShowLocationModal(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = mockWorkers.filter(worker => 
        worker.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Location Modal with Backdrop Blur */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 transform transition-all">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg" style={{
                background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)'
              }}>
                <MdLocationOn size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select Your Location
              </h2>
              <p className="text-gray-600">
                Choose your area to find nearby workers
              </p>
            </div>
            <div className="space-y-3">
              {['Bengaluru', 'Mysuru',].map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-left font-medium text-gray-700 transition-all border border-gray-200 flex items-center gap-3"
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #e0f2f7 0%, #b3e5f0 100%)';
                    e.target.style.borderColor = '#2596be';
                    e.target.style.color = '#1a7a9e';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #f9fafb, #f3f4f6)';
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.color = '#374151';
                  }}
                >
                  <MdLocationOn size={18} className="text-[#2596be]" />
                  <span>{location}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Professional Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="/src/assets/logo.jpeg" 
                alt="Passo" 
                className="w-14 h-14 object-contain rounded-xl shadow-lg"
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold" style={{ color: '#2596be' }}>
                  Passo
                </span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* City Selector */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-sm font-medium"
              >
                <MdLocationOn style={{ color: '#2596be' }} />
                <span className="hidden sm:inline">{selectedLocation || 'Bangalore'}</span>
              </button>

              {/* Find Services Button */}
              <button
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-sm font-medium"
              >
                <MdSearch style={{ color: '#2596be' }} />
                <span>Find Services</span>
              </button>

              {/* Register as Worker Button */}
              <button
                onClick={() => navigate('/worker-registration')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all text-sm font-medium"
              >
                <MdWork style={{ color: '#2596be' }} />
                <span>Register as Worker</span>
              </button>

              {/* Login Button */}
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)',
                  color: 'white'
                }}
              >
                <MdSecurity size={20} /> Login / Signup
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Hero Section - Logo Colors & Better Text Visibility */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #2596be 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Customer Flow */}
            <div className="space-y-8 animate-fade-in">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <MdRocketLaunch size={20} />
                  <span>Trusted by 10,000+ Customers</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                  <MdArrowForward className="inline text-blue-600" size={48} /> Find Trusted Local Services{' '}
                  <span className="bg-gradient-to-r from-[#1a7a9e] via-[#2596be] to-[#3ab5e0] bg-clip-text text-transparent">
                    Near You
                  </span>
                </h1>
                <p className="text-xl text-gray-700 flex items-center gap-2">
                  <MdLocationOn className="text-[#2596be]" size={28} />
                  Connect with verified professionals in <span className="font-bold text-[#2596be]">{selectedLocation || 'Bangalore'}</span>
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-5 border-2 border-gray-200 hover:border-[#2596be] transition-all">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <MdSearch className="text-gray-400 group-focus-within:text-[#2596be] transition-colors" size={24} />
                  </div>
                  <input
                    type="text"
                    placeholder="Type Service (AC repair, Laundry, Milk Delivery, Electrician...)"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg text-gray-900 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-[#2596be] focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-500"
                  />
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <MdLocationOn className="text-gray-400 group-focus-within:text-[#2596be] transition-colors" size={24} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search Category / Area"
                    className="w-full pl-14 pr-4 py-4 text-lg text-gray-900 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-[#2596be] focus:ring-4 focus:ring-blue-100 transition-all placeholder-gray-500"
                  />
                </div>

                <button
                  onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-5 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 group"
                  style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}
                >
                  <MdSearch size={24} className="group-hover:rotate-12 transition-transform" />
                  <MdSearch className="inline" size={20} /> Find Now
                </button>

                {/* Quick Stats */}
                <div className="flex items-center justify-around pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2596be]">10K+</div>
                    <div className="text-xs text-gray-600">Workers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#1a7a9e]">50K+</div>
                    <div className="text-xs text-gray-600">Jobs Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 flex items-center gap-1 justify-center">
                      4.8 <MdStar size={20} />
                    </div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Worker Flow with Logo Colors */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: '#3ab5e0' }}></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: '#1a7a9e' }}></div>
              
              <div className="relative rounded-3xl shadow-2xl p-10 text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    <MdWork size={18} />
                    <span>For Service Professionals</span>
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      Are you a service professional?
                    </h2>
                    <p className="text-xl text-blue-50 flex items-center gap-2">
                      <MdWork size={24} /> Get daily leads in your area
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 hover:bg-opacity-20 transition-all">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MdVerified size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Verified Leads</h3>
                        <p className="text-blue-100 text-sm">Get genuine customer requests daily</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 hover:bg-opacity-20 transition-all">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MdTrendingUp size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Grow Your Business</h3>
                        <p className="text-blue-100 text-sm">Reach more customers and increase income</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-4 hover:bg-opacity-20 transition-all">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MdSpeed size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Easy Management</h3>
                        <p className="text-blue-100 text-sm">Track leads via mobile app effortlessly</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => navigate('/worker-registration')}
                      className="w-full py-4 bg-white text-[#2596be] text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 group transform hover:scale-105"
                    >
                      <MdWork size={24} className="group-hover:rotate-12 transition-transform" />
                      <MdArrowForward className="inline" size={20} /> Register as Worker
                    </button>
                    <button
                      className="w-full py-4 text-white text-lg font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 group"
                      style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                    >
                      <MdDownload size={24} className="group-hover:translate-y-1 transition-transform" />
                      <MdArrowForward className="inline" size={20} /> Download Worker App
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 bg-gray-50">
        {/* Categories Section - Clean Design with Logo Colors */}
        <section id="categories-section" className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white shadow-md border-2 border-[#2596be] px-6 py-3 rounded-full text-sm font-semibold mb-4">
              <MdGroups size={20} className="text-[#2596be]" />
              <span className="text-gray-800">Most Popular Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <MdLocalFireDepartment className="inline text-orange-500" size={48} /> Top Hitting Categories
            </h2>
            <p className="text-xl text-gray-700">
              Day-to-Day Needs for Cities
            </p>
          </div>

          {/* Enhanced Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => {
                  navigate(`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`);
                }}
                className="relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-[#2596be] text-center group transform hover:-translate-y-3"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Icon Container */}
                <div className="relative">
                  <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center ${category.isDark ? 'text-gray-800' : 'text-white'} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl`}>
                    {/* Icon */}
                    <div className="text-4xl">
                      {category.icon}
                    </div>
                  </div>
                  
                  {/* Hot Badge */}
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <MdLocalFireDepartment size={14} /> Hot
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 mb-2 text-sm group-hover:text-[#2596be] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                  {category.desc}
                </p>

                {/* Hover Arrow */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[#2596be] text-sm font-semibold flex items-center justify-center gap-1">
                    View Details
                    <MdArrowForward className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-700 mb-4 flex items-center justify-center gap-2 text-lg">
              <MdSearch size={24} className="text-[#2596be]" />
              <MdArrowForward className="inline text-[#2596be]" size={20} /> Click any category to see detailed info and book services
            </p>
          </div>
        </section>

        {/* Why Passo Section - Logo Colors */}
        <section className="mb-20 relative bg-white">
          <div className="relative p-12">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white shadow-md border-2 border-[#2596be] px-6 py-3 rounded-full text-sm font-semibold mb-4">
                <MdVerified size={20} className="text-[#2596be]" />
                <span className="text-gray-800">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose Passo?
              </h2>
              <p className="text-xl text-gray-700">
                Your trusted platform for local services
              </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all text-center group border-2 border-gray-200 hover:border-[#2596be] transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}>
                  <MdVerified size={36} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center justify-center gap-2">
                  <MdCheckCircle size={20} className="text-green-600" /> Verified Workers
                </h3>
                <p className="text-sm text-gray-700">All professionals are background checked and verified</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all text-center group border-2 border-gray-200 hover:border-[#2596be] transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}>
                  <MdAttachMoney size={36} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center justify-center gap-2">
                  <MdCheckCircle size={20} className="text-green-600" /> Transparent Pricing
                </h3>
                <p className="text-sm text-gray-700">No hidden charges, clear quotes upfront</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all text-center group border-2 border-gray-200 hover:border-[#2596be] transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}>
                  <MdSpeed size={36} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center justify-center gap-2">
                  <MdCheckCircle size={20} className="text-green-600" /> Quick Matching
                </h3>
                <p className="text-sm text-gray-700">Get connected with professionals instantly</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all text-center group border-2 border-gray-200 hover:border-[#2596be] transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}>
                  <MdLocationOn size={36} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center justify-center gap-2">
                  <MdCheckCircle size={20} className="text-green-600" /> Local Professionals
                </h3>
                <p className="text-sm text-gray-700">Workers available near your area</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all text-center group border-2 border-gray-200 hover:border-[#2596be] transform hover:-translate-y-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}>
                  <MdSupport size={36} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center justify-center gap-2">
                  <MdCheckCircle size={20} className="text-green-600" /> Customer Support
                </h3>
                <p className="text-sm text-gray-700">24/7 assistance available for you</p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Pricing / Business Model Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-full text-sm font-semibold mb-4">
              <MdAttachMoney size={20} />
              <span>Transparent Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple & Clear Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Transparent plans for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* For Workers - Enhanced */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-10 text-white shadow-2xl overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                  }} className="w-full h-full"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold">For Workers</h3>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                      Popular
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-5 hover:bg-opacity-25 transition-all border border-white border-opacity-20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold flex items-center gap-2">
                          <MdSecurity size={20} />
                          Unlock Leads
                        </span>
                        <span className="text-2xl font-bold">₹99 - ₹499</span>
                      </div>
                      <p className="text-sm text-blue-100">Per lead (based on category)</p>
                    </div>

                    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-5 hover:bg-opacity-25 transition-all border border-white border-opacity-20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold flex items-center gap-2">
                          <MdStar size={20} />
                          Featured Listing
                        </span>
                        <span className="text-2xl font-bold">₹999/mo</span>
                      </div>
                      <p className="text-sm text-blue-100">Get top visibility in search</p>
                    </div>

                    <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl p-5 hover:bg-opacity-25 transition-all border border-white border-opacity-20">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold flex items-center gap-2">
                          <MdVerified size={20} />
                          Trust Badge
                        </span>
                        <span className="text-2xl font-bold">₹499</span>
                      </div>
                      <p className="text-sm text-blue-100">One-time verification fee</p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-5 border-2 border-yellow-300 shadow-xl transform hover:scale-105 transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold flex items-center gap-2 text-gray-900">
                          <MdRocketLaunch size={20} />
                          Subscription Plan
                        </span>
                        <span className="text-2xl font-bold text-gray-900">₹1999/mo</span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium">Unlimited leads for specific categories</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/worker-registration')}
                    className="w-full py-4 bg-white text-blue-600 font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group transform hover:scale-105"
                  >
                    <MdWork size={24} className="group-hover:rotate-12 transition-transform" />
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>

            {/* For Customers - Enhanced */}
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              
              <div className="relative bg-white rounded-3xl p-10 shadow-2xl border-2 border-gray-100 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #2596be 1px, transparent 0)',
                    backgroundSize: '30px 30px'
                  }} className="w-full h-full"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-gray-900">For Customers</h3>
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Free
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MdCheckCircle size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Free Browsing</h4>
                        <p className="text-gray-600">Search and explore all services at no cost. Browse unlimited profiles.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:shadow-md transition-all">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MdAttachMoney size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Pay Only When Booking</h4>
                        <p className="text-gray-600">No charges until you hire a service. Complete transparency.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-all">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MdVerified size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Transparent Pricing</h4>
                        <p className="text-gray-600">See clear quotes before you decide. No hidden fees ever.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl hover:shadow-md transition-all">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MdThumbUp size={28} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Quality Guarantee</h4>
                        <p className="text-gray-600">Satisfaction guaranteed or money back. Your trust matters.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-4 text-white font-bold rounded-2xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #1a7a9e 0%, #2596be 50%, #3ab5e0 100%)' }}
                  >
                    <MdSearch size={24} className="group-hover:rotate-12 transition-transform" />
                    Browse Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Professional Footer - Complete Info */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            
            {/* Company Section */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#3ab5e0' }}>Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Passo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
              </ul>
            </div>

            {/* Services Section */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#3ab5e0' }}>Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">AC Repair</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Laundry</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Milk Delivery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">House Cleaning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Appliance Repair</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">All Categories</a></li>
              </ul>
            </div>

            {/* For Workers Section */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#3ab5e0' }}>For Workers</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); navigate('/worker-registration'); }}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Register as Partner
                  </a>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Partner FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Partner Support</a></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#3ab5e0' }}>Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Refund Policy</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: '#3ab5e0' }}>Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MdPhone className="mt-1 flex-shrink-0" style={{ color: '#3ab5e0' }} size={18} />
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Phone</div>
                    <a href="tel:+919876543210" className="text-sm text-white hover:text-blue-400 transition-colors">
                      +91 98765 43210
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MdEmail className="mt-1 flex-shrink-0" style={{ color: '#3ab5e0' }} size={18} />
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Email</div>
                    <a href="mailto:support@passo.com" className="text-sm text-white hover:text-blue-400 transition-colors">
                      support@passo.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FaWhatsapp className="mt-1 flex-shrink-0" style={{ color: '#3ab5e0' }} size={18} />
                  <div>
                    <div className="text-xs text-gray-400 mb-1">WhatsApp Support</div>
                    <a href="https://wa.me/919876543210" className="text-sm text-white hover:text-blue-400 transition-colors">
                      Chat with us
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Cities Covered Section */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <h3 className="text-lg font-bold mb-4 text-center flex items-center justify-center gap-2" style={{ color: '#3ab5e0' }}>
              <MdLocationOn size={24} /> Cities Covered
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Bangalore', 'Mysuru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'].map((city) => (
                <span key={city} className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer">
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Company Info & Social */}
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Logo & Description */}
              <div className="text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                  <img 
                    src="/src/assets/logo.jpeg" 
                    alt="Passo" 
                    className="w-12 h-12 object-contain rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  <div>
                    <div className="text-xl font-bold" style={{ color: '#3ab5e0' }}>Passo</div>
                    <div className="text-xs font-semibold text-gray-400">WORKS NEAR ME</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm max-w-md">
                  Connecting skilled workers with customers, building trust and opportunities in your community.
                </p>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-sm text-gray-400 mb-3 text-center">Follow Us</p>
                <div className="flex gap-3 justify-center">
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all">
                    <FaFacebook size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-all">
                    <FaTwitter size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all">
                    <FaInstagram size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all">
                    <FaLinkedin size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © 2024 Passo. All rights reserved.
              </p>
              <div className="flex gap-6 flex-wrap justify-center">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

