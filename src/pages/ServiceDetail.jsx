import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  MdArrowBack, MdStar, MdVerified, MdCheckCircle,
  MdPhone, MdLock, MdPeople, MdCalendarToday,
  MdWork, MdLanguage, MdRateReview, MdPerson
} from 'react-icons/md';

const ServiceDetail = () => {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const [unlockedContacts, setUnlockedContacts] = useState([]);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewWorker, setReviewWorker] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format service name for display
  const displayName = decodeURIComponent(serviceName || '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Load approved workers for this service category
  useEffect(() => {
    loadWorkers();
  }, [serviceName]);

  const loadWorkers = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading workers for service:', displayName);
      console.log('📍 Query params:', { category: displayName, status: 'Approved' });
      
      const url = `http://localhost:5000/api/workers/public?category=${encodeURIComponent(displayName)}&status=Approved`;
      console.log('🌐 Fetching from:', url);
      
      // Fetch from backend API using PUBLIC endpoint (no auth required)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📥 API Response:', data);
      console.log('📥 Data array:', data.data);
      console.log('📥 Data length:', data.data?.length);
      
      if (data.success && data.data) {
        console.log(`✅ Found ${data.data.length} workers`);
        data.data.forEach(w => {
          console.log(`  - ${w.name} (Category: "${w.category}", Status: ${w.status})`);
        });
        
        if (data.data.length === 0) {
          console.warn('⚠️ API returned empty array!');
          console.warn('   Check if category name matches exactly');
        }
        
        // Transform backend data to match UI format
        const transformedWorkers = data.data.map(worker => {
          console.log('🔄 Transforming worker:', worker.name);
          console.log('   Featured status:', worker.featured);
          return {
            id: worker._id,
            name: worker.name,
            rating: worker.rating || 0, // Use actual rating from backend
            totalReviews: worker.totalReviews || 0,
            jobs: worker.totalUnlocks || 0,
            verified: worker.verified,
            featured: worker.featured, // Include featured status
            badges: worker.badges || [],
            type: worker.workerType,
            teamSize: worker.teamSize,
            phone: worker.mobile,
            email: worker.email,
            experience: calculateExperience(worker.createdAt),
            isAvailable: worker.online || true, // Default to true if not set
            specialization: Array.isArray(worker.category) ? worker.category.join(', ') : worker.category,
            languages: worker.languages || ['English'],
            profilePhoto: worker.profilePhoto
          };
        });
        
        console.log('✅ Transformed workers:', transformedWorkers);
        setWorkers(transformedWorkers);
        setLoading(false);
        console.log('🎉 Workers set successfully! Exiting loadWorkers.');
        return; // Exit here, don't fall through to localStorage
      } else {
        console.error('❌ API response not successful or no data');
        console.error('   Success:', data.success);
        console.error('   Data:', data.data);
      }
    } catch (error) {
      console.error('❌ Failed to load workers from API:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Fallback to localStorage (only if API fails)
    console.log('⚠️ Falling back to localStorage...');
    const registrations = JSON.parse(localStorage.getItem('workerRegistrations') || '[]');
    console.log('📦 localStorage registrations:', registrations);
    
    const approvedWorkers = registrations
      .filter(reg => reg.status === 'Approved' && reg.workerType === displayName)
      .map(reg => ({
        id: reg.id,
        name: reg.name,
        rating: 4.5,
        jobs: 0,
        verified: true,
        type: reg.registrationType || 'Individual',
        teamSize: reg.teamSize,
        phone: reg.mobile,
        email: reg.email,
        experience: 'New',
        isAvailable: true,
        specialization: reg.workerType,
        languages: reg.languages || ['English'],
        profilePhoto: reg.profilePhoto
      }));

    console.log('📦 localStorage workers:', approvedWorkers);
    setWorkers(approvedWorkers);
    setLoading(false);
  };

  const calculateExperience = (createdAt) => {
    if (!createdAt) return 'New';
    const years = Math.floor((new Date() - new Date(createdAt)) / (365 * 24 * 60 * 60 * 1000));
    if (years === 0) return 'New';
    return `${years} year${years > 1 ? 's' : ''}`;
  };

  const handleUnlockContact = (worker) => {
    setSelectedWorker(worker);
    setShowUnlockModal(true);
  };

  const confirmUnlock = () => {
    if (selectedWorker && !unlockedContacts.includes(selectedWorker.id)) {
      setUnlockedContacts([...unlockedContacts, selectedWorker.id]);
    }
    setShowUnlockModal(false);
    setSelectedWorker(null);
  };

  const isContactUnlocked = (workerId) => {
    return unlockedContacts.includes(workerId);
  };

  const handleRateReview = (worker) => {
    setReviewWorker(worker);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      // Submit review to backend
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId: reviewWorker.id,
          rating,
          comment: review,
          userName: 'Anonymous' // You can add user name input if needed
        })
      });

      const data = await response.json();

      if (data.success) {
        // Reset and close modal
        setShowReviewModal(false);
        setReviewWorker(null);
        setRating(0);
        setReview('');
        
        // Show success message
        alert('Thank you for your review! It will be visible after admin approval.');
      } else {
        alert('Failed to submit review: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Service data
  const serviceData = {
    name: displayName,
    description: 'Professional and reliable service with verified workers',
    rating: 4.8,
    reviews: workers.length > 0 ? workers.reduce((sum, w) => sum + (w.jobs || 0), 0) : 0
  };

  // Check if there are any available workers
  const availableWorkers = workers.filter(w => w.isAvailable);
  const hasAvailableWorkers = availableWorkers.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-[#2596be] transition-colors"
          >
            <MdArrowBack size={24} />
            <span className="font-semibold">Back</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Service Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{serviceData.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{serviceData.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MdStar className="text-yellow-500" size={24} />
                    <span className="text-xl font-bold text-gray-900">{serviceData.rating}</span>
                    <span className="text-gray-600">({serviceData.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <MdVerified size={20} />
                    <span className="font-semibold">Verified Service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Workers - 4 Small Cards Per Row */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Service Providers</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2596be]"></div>
              </div>
            ) : !hasAvailableWorkers ? (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
                <div className="text-yellow-600 mb-3">
                  <MdCalendarToday size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Workers Available</h3>
                <p className="text-gray-600">Currently, no workers are available for this service. Please check back later or try another service.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all ${
                      worker.isAvailable 
                        ? 'border-gray-200 hover:border-[#2596be]' 
                        : 'border-gray-300 opacity-75'
                    }`}
                  >
                    {/* Worker Avatar & Basic Info */}
                    <div className="text-center mb-3">
                      <div className="relative inline-block mb-3">
                        {worker.profilePhoto ? (
                          <img 
                            src={worker.profilePhoto} 
                            alt={worker.name}
                            className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a7a9e] to-[#3ab5e0] flex items-center justify-center text-white text-xl font-bold mx-auto">
                            {worker.name.charAt(0)}
                          </div>
                        )}
                        {worker.type === 'Team' || worker.type === 'Crew' || worker.type === 'Crew / Team' ? (
                          <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white rounded-full p-1">
                            <MdPeople size={14} />
                          </div>
                        ) : null}
                      </div>
                      
                      <div className="mb-2">
                        <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-1">{worker.name}</h3>
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {(worker.verified || worker.featured) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-semibold">
                              <MdVerified size={10} /> Verified
                            </span>
                          )}
                          {(worker.featured || (worker.badges && worker.badges.includes('Trusted Pro'))) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-semibold">
                              <MdCheckCircle size={10} /> Trusted
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-2 ${
                        worker.type === 'Team' || worker.type === 'Crew' || worker.type === 'Crew / Team'
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {worker.type}
                      </span>
                      
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-0.5">
                          <MdStar className="text-yellow-500" size={14} />
                          <span className="font-semibold">
                            {worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}
                          </span>
                        </div>
                        {worker.totalReviews > 0 && (
                          <>
                            <span>•</span>
                            <span>{worker.totalReviews} review{worker.totalReviews !== 1 ? 's' : ''}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Compact Details */}
                    <div className="space-y-2 mb-3">
                      {/* Experience */}
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-700">
                        <MdWork size={12} className="text-[#2596be]" />
                        <span className="font-medium">{worker.experience}</span>
                      </div>

                      {/* Specialization */}
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-xs text-gray-900 font-medium line-clamp-1">{worker.specialization}</div>
                      </div>

                      {/* Languages */}
                      <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                        <MdLanguage size={12} className="text-[#2596be]" />
                        <span className="line-clamp-1">{worker.languages.join(', ')}</span>
                      </div>

                      {/* Team Size for Crews */}
                      {(worker.type === 'Team' || worker.type === 'Crew' || worker.type === 'Crew / Team') && worker.teamSize && (
                        <div className="flex items-center justify-center gap-1 text-xs text-purple-700 bg-purple-50 rounded-lg py-1">
                          <MdPeople size={12} />
                          <span className="font-medium">{worker.teamSize} members</span>
                        </div>
                      )}

                      {/* Availability Status */}
                      <div className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold ${
                        worker.isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <MdCalendarToday size={12} />
                        <span>{worker.isAvailable ? 'Available' : 'Busy'}</span>
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="border-t border-gray-200 pt-3">
                      {isContactUnlocked(worker.id) ? (
                        <div className="space-y-2">
                          <a
                            href={`tel:${worker.phone}`}
                            className="flex items-center justify-center gap-1 w-full px-3 py-2 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-all"
                          >
                            <MdPhone size={14} />
                            Call Now
                          </a>
                          <div className="text-center text-xs text-gray-900 font-medium">
                            {worker.phone}
                          </div>
                          <button
                            onClick={() => handleRateReview(worker)}
                            className="flex items-center justify-center gap-1 w-full px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all"
                          >
                            <MdRateReview size={14} />
                            Rate & Review
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleUnlockContact(worker)}
                            disabled={!worker.isAvailable}
                            className={`flex items-center justify-center gap-1 w-full px-3 py-2 text-white text-xs font-semibold rounded-lg transition-all ${
                              worker.isAvailable
                                ? 'bg-gradient-to-r from-[#1a7a9e] to-[#3ab5e0] hover:shadow-lg'
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <MdLock size={14} />
                            {worker.isAvailable ? 'Unlock' : 'Unavailable'}
                          </button>
                          <div className="text-center text-xs text-gray-500">
                            ••• {worker.phone.slice(-4)}
                          </div>
                          {worker.isAvailable && (
                            <div className="text-center px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 font-medium">
                              ₹49
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unlock Contact Modal */}
          {showUnlockModal && selectedWorker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#1a7a9e] to-[#3ab5e0] flex items-center justify-center">
                    <MdLock size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Contact</h2>
                  <p className="text-gray-600">Get direct access to {selectedWorker.name}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700">Unlock Fee</span>
                    <span className="text-2xl font-bold text-[#2596be]">₹49</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <MdCheckCircle className="inline text-green-600 mr-1" size={16} />
                    One-time payment for lifetime access
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={confirmUnlock}
                    className="w-full py-3 bg-gradient-to-r from-[#1a7a9e] to-[#3ab5e0] text-white font-bold rounded-xl hover:shadow-xl transition-all"
                  >
                    Pay ₹49 & Unlock
                  </button>
                  <button
                    onClick={() => {
                      setShowUnlockModal(false);
                      setSelectedWorker(null);
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rate & Review Modal */}
          {showReviewModal && reviewWorker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                    <MdRateReview size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate & Review</h2>
                  <p className="text-gray-600">Share your experience with {reviewWorker.name}</p>
                </div>

                {/* Star Rating */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                    Your Rating
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <MdStar
                          size={40}
                          className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-center mt-2 text-sm font-semibold text-gray-700">
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent'}
                    </p>
                  )}
                </div>

                {/* Review Text */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience with this service provider..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2596be] focus:border-transparent resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={submitReview}
                    disabled={rating === 0}
                    className={`w-full py-3 font-bold rounded-xl transition-all ${
                      rating === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-xl'
                    }`}
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewWorker(null);
                      setRating(0);
                      setReview('');
                    }}
                    className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
