import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdWork, MdLocationOn, MdSearch, MdStar, MdVerified, 
  MdEmail, MdPhone, MdCheckCircle, MdArrowForward,
  MdPlumbing, MdElectricalServices, MdCarpenter, MdPestControl, 
  MdLocalShipping, MdPets, MdTwoWheeler, MdSpeed, MdSupport,
  MdAttachMoney, MdSecurity, MdTrendingUp
} from 'react-icons/md';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp,
  FaWind, FaBroom, FaTools, FaTshirt
} from 'react-icons/fa';
import { GiCookingPot, GiWaterDrop, GiGasStove, GiMilkCarton } from 'react-icons/gi';

const Home = () => {
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Bangalore');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Laundry', icon: <FaTshirt />, color: '#2596be' },
    { id: 2, name: 'Milk Delivery', icon: <GiMilkCarton />, color: '#10b981' },
    { id: 3, name: 'Cleaning', icon: <FaBroom />, color: '#06b6d4' },
    { id: 4, name: 'AC Repair', icon: <FaWind />, color: '#3b82f6' },
    { id: 5, name: 'Plumber', icon: <MdPlumbing />, color: '#6366f1' },
    { id: 6, name: 'Electrician', icon: <MdElectricalServices />, color: '#f59e0b' },
    { id: 7, name: 'Water Purifier', icon: <GiWaterDrop />, color: '#14b8a6' },
    { id: 8, name: 'Gas Stove', icon: <GiGasStove />, color: '#ef4444' },
    { id: 9, name: 'Bike Repair', icon: <MdTwoWheeler />, color: '#64748b' },
    { id: 10, name: 'Packers', icon: <MdLocalShipping />, color: '#a855f7' },
    { id: 11, name: 'Cook', icon: <GiCookingPot />, color: '#f97316' },
    { id: 12, name: 'Pet Care', icon: <MdPets />, color: '#ec4899' },
    { id: 13, name: 'Carpenter', icon: <MdCarpenter />, color: '#d97706' },
    { id: 14, name: 'Pest Control', icon: <MdPestControl />, color: '#84cc16' },
    { id: 15, name: 'Appliances', icon: <FaTools />, color: '#8b5cf6' }
  ];

  useEffect(() => {
    setShowLocationModal(true);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('userLocation', location);
    setShowLocationModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a7a9e, #3ab5e0)' }}>
                <MdLocationOn size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your City</h2>
              <p className="text-gray-600">Choose your location to find nearby services</p>
            </div>
            <div className="space-y-3">
              {['Bangalore', 'Mysuru'].map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full py-3 px-4 bg-gray-50 hover:bg-gradient-to-r hover:from-[#1a7a9e] hover:to-[#3ab5e0] hover:text-white rounded-xl text-left font-medium text-gray-700 transition-all border border-gray-200 hover:border-transparent flex items-center gap-3"
                >
                  <MdLocationOn size={20} />
                  <span>{location}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Premium Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <img 
                src="/src/assets/logo.jpeg" 
                alt="Passo" 
                className="w-12 h-12 object-contain rounded-xl"
                onError={(e) => e.target.style.display = 'none'}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#1a7a9e] to-[#3ab5e0] bg-clip-text text-transparent">
                Passo
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#2596be] transition-all text-sm font-medium rounded-xl hover:bg-gray-50"
              >
                <MdLocationOn size={20} className="text-[#2596be]" />
                <span className="hidden sm:inline">{selectedLocation}</span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 rounded-xl font-semibold transition-all text-white shadow-lg shadow-[#2596be]/30 hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #1a7a9e, #2596be, #3ab5e0)' }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium & Clean */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Trusted Local
              <span className="block bg-gradient-to-r from-[#1a7a9e] via-[#2596be] to-[#3ab5e0] bg-clip-text text-transparent">
                Services Near You
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with verified professionals in {selectedLocation}
            </p>

            {/* Premium Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MdSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10 transition-all shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2596be] mb-2">10K+</div>
              <div className="text-sm text-gray-600">Verified Workers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2596be] mb-2">50K+</div>
              <div className="text-sm text-gray-600">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2596be] mb-2 flex items-center justify-center gap-1">
                4.8 <MdStar size={32} className="text-yellow-500" />
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Premium Grid */}
      <section className="container mx-auto px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Services</h2>
            <p className="text-lg text-gray-600">Choose from our wide range of services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
                className="group p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#2596be] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-[#2596be] transition-colors">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Worker CTA - Premium */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 text-white text-center shadow-2xl" style={{ background: 'linear-gradient(135deg, #1a7a9e, #2596be, #3ab5e0)' }}>
          <MdWork size={48} className="mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Are you a service professional?</h2>
          <p className="text-xl mb-8 text-blue-50">Join thousands of professionals and grow your business</p>
          <button
            onClick={() => navigate('/worker-registration')}
            className="px-8 py-4 bg-white text-[#2596be] font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Register as Worker
          </button>
        </div>
      </section>

      {/* Footer - Clean */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#3ab5e0]">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#3ab5e0]">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">All Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Popular Services</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#3ab5e0]">For Workers</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" onClick={() => navigate('/worker-registration')} className="hover:text-white transition-colors">Register</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-[#3ab5e0]">Contact</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2"><MdPhone size={16} /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><MdEmail size={16} /> support@passo.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Passo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
