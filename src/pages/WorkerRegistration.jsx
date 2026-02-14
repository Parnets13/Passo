import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCloudUpload, MdCheckCircle, MdPerson, MdEmail, MdPhone, MdWork, MdAccountBalance, MdPayment, MdQrCode2, MdArrowBack } from 'react-icons/md';
import Toast from '../components/Toast';
import { categoryAPI } from '../services/api';

const WorkerRegistration = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [registrationTypeSelected, setRegistrationTypeSelected] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formData, setFormData] = useState({
    registrationType: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    languages: [],
    workerType: [], // Changed to array for multiple selections
    serviceArea: '',
    teamSize: '',
    aadhaarDoc: null,
    panCard: null,
    gstDoc: null,
    msmeDoc: null,
    gstNumber: '',
    msmeNumber: '',
    profilePhoto: null,
    transactionNumber: '',
    paymentScreenshot: null,
    paymentCompleted: false
  });
  const [fetchingLocation, setFetchingLocation] = useState(false);

  // Fetch categories when registration type is selected
  useEffect(() => {
    if (formData.registrationType) {
      loadCategories();
    }
  }, [formData.registrationType]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryAPI.getAll();
      if (response && response.success) {
        // Filter categories based on selected registration type
        const filteredCategories = response.data.filter(cat => 
          cat.active && cat.workerTypes && cat.workerTypes.includes(formData.registrationType)
        );
        setCategories(filteredCategories);
        console.log('✅ Loaded categories for', formData.registrationType, ':', filteredCategories);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      showToast('Failed to load service categories', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  const availableLanguages = [
    'Hindi',
    'English',
    'Marathi',
    'Bengali',
    'Tamil',
    'Telugu',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi',
    'Urdu',
    'Odia'
  ];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageToggle = (language) => {
    setFormData(prev => {
      const languages = prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language];
      return { ...prev, languages };
    });
  };

  const handleServiceToggle = (serviceName) => {
    setFormData(prev => {
      const workerType = prev.workerType.includes(serviceName)
        ? prev.workerType.filter(service => service !== serviceName)
        : [...prev.workerType, serviceName];
      return { ...prev, workerType };
    });
  };

  const handleRegistrationTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, registrationType: type }));
    setRegistrationTypeSelected(true);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setFetchingLocation(true);
    showToast('Fetching your location...', 'info');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }

          const data = await response.json();
          const address = data.address;
          
          // Build comprehensive address string
          const addressParts = [];
          
          if (address.road || address.street) {
            addressParts.push(address.road || address.street);
          }
          if (address.suburb || address.neighbourhood) {
            addressParts.push(address.suburb || address.neighbourhood);
          }
          if (address.city || address.town || address.village) {
            addressParts.push(address.city || address.town || address.village);
          }
          if (address.state_district) {
            addressParts.push(address.state_district);
          }
          if (address.state) {
            addressParts.push(address.state);
          }
          if (address.postcode) {
            addressParts.push(`PIN: ${address.postcode}`);
          }
          
          const fullAddress = addressParts.join(', ');
          
          setFormData(prev => ({ 
            ...prev, 
            serviceArea: fullAddress || data.display_name 
          }));
          
          showToast('Location fetched successfully!', 'success');
        } catch (error) {
          console.error('Error fetching address:', error);
          showToast('Failed to fetch address details. Please enter manually.', 'error');
        } finally {
          setFetchingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = 'Failed to get location. ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'Please enter location manually.';
        }
        
        showToast(errorMessage, 'error');
        setFetchingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
          showToast('Please fill all basic details', 'error');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          showToast('Please enter a valid email', 'error');
          return false;
        }
        if (!/^[0-9]{10}$/.test(formData.mobile)) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          return false;
        }
        if (formData.password.length < 6) {
          showToast('Password must be at least 6 characters', 'error');
          return false;
        }
        if (formData.languages.length === 0) {
          showToast('Please select at least one language', 'error');
          return false;
        }
        return true;
      case 2:
        if (formData.workerType.length === 0 || !formData.serviceArea) {
          showToast('Please select at least one service and enter service area', 'error');
          return false;
        }
        // Validate team size for Crew/Team
        if (formData.registrationType === 'Crew / Team') {
          if (!formData.teamSize || formData.teamSize < 2) {
            showToast('Please enter number of team members (minimum 2)', 'error');
            return false;
          }
        }
        return true;
      case 3:
        if (!formData.aadhaarDoc || !formData.panCard || !formData.profilePhoto) {
          showToast('Please upload all required documents', 'error');
          return false;
        }
        // GST and MSME are optional for Contractor, Crew/Team, and Service Provider
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePaymentVerification = async () => {
    if (!formData.paymentScreenshot) {
      showToast('Please upload payment screenshot', 'error');
      return;
    }

    const txnNumber = formData.transactionNumber.trim().toUpperCase();

    // If transaction number is provided, validate it
    if (txnNumber) {
      if (txnNumber.length < 12) {
        showToast('Transaction number must be at least 12 characters', 'error');
        return;
      }

      // Validate transaction number format (alphanumeric only)
      const txnRegex = /^[A-Z0-9]{12,}$/;
      if (!txnRegex.test(txnNumber)) {
        showToast('Invalid format. Transaction number should contain only letters and numbers', 'error');
        return;
      }
    }

    // Show submitting message
    showToast('Payment verification ready...', 'info');
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mark payment as completed (will be verified when worker is registered)
    setFormData(prev => ({ 
      ...prev, 
      paymentCompleted: true,
      transactionNumber: txnNumber || 'Not Provided'
    }));
    
    showToast('Payment verified! You can now submit registration.', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 FORM SUBMIT STARTED');
    console.log('📋 Current formData:', formData);

    // Only check if payment screenshot is uploaded
    if (!formData.paymentScreenshot) {
      console.log('❌ Payment screenshot missing');
      alert('Please upload payment screenshot');
      showToast('Please upload payment screenshot', 'error');
      return;
    }

    console.log('✅ Payment screenshot uploaded, proceeding with registration...');

    try {
      console.log('🔄 Saving worker to MongoDB...');
      console.log('📍 Backend URL: https://passo-backend.onrender.com/api/auth/worker/register');
      showToast('Submitting registration to database...', 'info');

      // Prepare worker data for backend
      const workerData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        languages: formData.languages,
        workerType: formData.registrationType,
        category: formData.workerType, // Now an array of selected services
        serviceArea: formData.serviceArea,
        city: formData.serviceArea,
        teamSize: formData.teamSize ? parseInt(formData.teamSize) : undefined,
        profilePhoto: formData.profilePhoto?.name || null,
        aadhaarDoc: formData.aadhaarDoc?.name,
        panCard: formData.panCard?.name,
        gstCertificate: formData.gstDoc?.name,
        gstNumber: formData.gstNumber || '',
        msmeCertificate: formData.msmeDoc?.name,
        msmeNumber: formData.msmeNumber || '',
        onboardingFee: {
          paid: true,
          amount: 1,
          transactionId: formData.transactionNumber || 'Not Provided',
          paidAt: new Date()
        },
        status: 'Pending'
      };

      console.log('📤 FULL WORKER DATA BEING SENT:');
      console.log(JSON.stringify(workerData, null, 2));

      // Send to backend API - ONLY MongoDB, no localStorage
      console.log('🌐 Making fetch request...');
      const response = await fetch('https://passo-backend.onrender.com/api/auth/worker/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerData)
      });

      console.log('📥 Response received!');
      console.log('📥 Response status:', response.status);
      console.log('📥 Response ok:', response.ok);
      
      const data = await response.json();
      console.log('📥 Response data:', JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        console.log('✅ SUCCESS! Worker saved to MongoDB');
        console.log('   MongoDB ID:', data.data?._id);
        console.log('   Name:', data.data?.name);
        console.log('   Status:', data.data?.status);

        showToast('Registration submitted successfully! Pending admin approval.', 'success');
        
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        console.error('❌ Backend returned error:', data.message);
        showToast(data.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('❌ FAILED to save to MongoDB:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      showToast('Unable to connect to server. Please ensure backend is running and try again.', 'error');
      console.log('⚠️  Make sure backend server is running: cd backend && npm start');
    }
  };

  const FileUploadField = ({ label, name, accept, icon }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={name}
        />
        <label
          htmlFor={name}
          className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
        >
          {formData[name] ? (
            <>
              <MdCheckCircle className="text-green-600" size={20} />
              <span className="text-sm text-gray-700">{formData[name].name}</span>
            </>
          ) : (
            <>
              <MdCloudUpload className="text-gray-400" size={24} />
              <span className="text-sm text-gray-500">Click to upload</span>
            </>
          )}
        </label>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Basic Details' },
    { number: 2, title: 'Service Info' },
    { number: 3, title: 'Documents' },
    { number: 4, title: 'Payment' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-12 px-4">
      {/* Back Button - Top Left */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors group"
        >
          <MdArrowBack size={24} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Home</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/src/assets/logo.jpeg" 
              alt="Company Logo" 
              className="w-32 h-32 object-contain rounded-xl shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Registration</h1>
          <p className="text-gray-600">Complete your profile to start receiving work opportunities</p>
        </div>

        {/* Registration Type Selection - Shows First */}
        {!registrationTypeSelected ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Select Registration Type
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Choose the option that best describes you
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Worker Option */}
              <div
                onClick={() => handleRegistrationTypeSelect('Worker')}
                className="group cursor-pointer"
              >
                <div className="border-3 border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                    <MdPerson className="text-orange-600 group-hover:text-white transition-colors" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Worker</h3>
                  <p className="text-sm text-gray-600">Individual service provider</p>
                </div>
              </div>

              {/* Crew / Team Option */}
              <div
                onClick={() => handleRegistrationTypeSelect('Crew / Team')}
                className="group cursor-pointer"
              >
                <div className="border-3 border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors">
                    <MdWork className="text-yellow-600 group-hover:text-white transition-colors" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Crew / Team</h3>
                  <p className="text-sm text-gray-600">Group of workers</p>
                </div>
              </div>

              {/* Contractor Option */}
              <div
                onClick={() => handleRegistrationTypeSelect('Contractor')}
                className="group cursor-pointer"
              >
                <div className="border-3 border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                    <MdAccountBalance className="text-blue-600 group-hover:text-white transition-colors" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Contractor</h3>
                  <p className="text-sm text-gray-600">Construction contractor</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-6 mt-6">
              {/* Service Provider Option */}
              <div
                onClick={() => handleRegistrationTypeSelect('Service Provider')}
                className="group cursor-pointer"
              >
                <div className="border-3 border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                    <MdAccountBalance className="text-amber-600 group-hover:text-white transition-colors" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Service Provider</h3>
                  <p className="text-sm text-gray-600">Business or company</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Registration Type:</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                    {formData.registrationType}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setRegistrationTypeSelected(false);
                    setFormData(prev => ({ ...prev, registrationType: '' }));
                  }}
                  className="text-sm text-orange-600 hover:text-orange-800 underline"
                >
                  Change Type
                </button>
              </div>
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step.number
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {currentStep > step.number ? <MdCheckCircle size={24} /> : step.number}
                      </div>
                      <span className="text-xs mt-2 text-gray-600 hidden md:block">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 ${
                        currentStep > step.number ? 'bg-orange-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MdPerson className="text-orange-600" size={28} />
                Basic Details
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Create Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Create a password (min 6 characters)"
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You'll use this password to login later
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Known <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select all languages you can speak (at least one required)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableLanguages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageToggle(language)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.languages.includes(language)
                          ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {formData.languages.includes(language) && '✓ '}
                      {language}
                    </button>
                  ))}
                </div>
                {formData.languages.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Selected:</strong> {formData.languages.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Service Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MdWork className="text-orange-600" size={28} />
                Service Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Categories <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select all services you can provide (at least one required)
                </p>
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Loading services...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-yellow-50 text-yellow-800">
                    No services available for {formData.registrationType}. Please contact admin.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {categories.map(category => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() => handleServiceToggle(category.name)}
                        className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${
                          formData.workerType.includes(category.name)
                            ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            formData.workerType.includes(category.name)
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-400 bg-white'
                          }`}>
                            {formData.workerType.includes(category.name) && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {categories.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {categories.length} service(s) available for {formData.registrationType}
                  </p>
                )}
                {formData.workerType.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Selected ({formData.workerType.length}):</strong> {formData.workerType.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Service Area / City <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={fetchingLocation}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      fetchingLocation
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                    }`}
                  >
                    {fetchingLocation ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Fetching...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Use Current Location</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your service area or city"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Click "Use Current Location" to auto-fill with your current address including pincode
                </p>
              </div>

              {/* Team Size for Crew/Team */}
              {formData.registrationType === 'Crew / Team' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Team Members <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter number of people in your team"
                    min="2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 2 members required for team registration
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Document Upload</h2>
              
              {/* Profile Photo Section */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-300 overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                    {formData.profilePhoto ? (
                      <img
                        src={URL.createObjectURL(formData.profilePhoto)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MdPerson size={64} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profilePhoto"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition-colors"
                    >
                      <MdCloudUpload size={20} />
                      {formData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      Upload a clear photo of yourself. This will be visible to customers. <span className="text-red-500">*</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadField
                  label="Aadhaar Card"
                  name="aadhaarDoc"
                  accept="image/*,.pdf"
                />
                <FileUploadField
                  label="PAN Card"
                  name="panCard"
                  accept="image/*,.pdf"
                />
                
                {/* Conditional GST and MSME for Contractor, Crew/Team, and Service Provider */}
                {(formData.registrationType === 'Contractor' || 
                  formData.registrationType === 'Crew / Team' || 
                  formData.registrationType === 'Service Provider') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Certificate (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="gstDoc"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="gstDoc"
                        />
                        <label
                          htmlFor="gstDoc"
                          className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                        >
                          {formData.gstDoc ? (
                            <>
                              <MdCheckCircle className="text-green-600" size={20} />
                              <span className="text-sm text-gray-700">{formData.gstDoc.name}</span>
                            </>
                          ) : (
                            <>
                              <MdCloudUpload className="text-gray-400" size={24} />
                              <span className="text-sm text-gray-500">Click to upload</span>
                            </>
                          )}
                        </label>
                      </div>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="GST Number (Optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MSME Certificate (Optional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name="msmeDoc"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="msmeDoc"
                        />
                        <label
                          htmlFor="msmeDoc"
                          className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                        >
                          {formData.msmeDoc ? (
                            <>
                              <MdCheckCircle className="text-green-600" size={20} />
                              <span className="text-sm text-gray-700">{formData.msmeDoc.name}</span>
                            </>
                          ) : (
                            <>
                              <MdCloudUpload className="text-gray-400" size={24} />
                              <span className="text-sm text-gray-500">Click to upload</span>
                            </>
                          )}
                        </label>
                      </div>
                      <input
                        type="text"
                        name="msmeNumber"
                        value={formData.msmeNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="MSME Number (Optional)"
                      />
                    </div>
                  </>
                )}
              </div>

              {(formData.registrationType === 'Contractor' || 
                formData.registrationType === 'Crew / Team' || 
                formData.registrationType === 'Service Provider') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note for {formData.registrationType}:</strong> GST and MSME certificates are optional but recommended for better credibility.
                  </p>
                </div>
              )}

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> Please ensure all documents are clear and readable. Accepted formats: JPG, PNG, PDF (Max 5MB each)
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MdPayment className="text-orange-600" size={28} />
                Registration Payment
              </h2>

              {!formData.paymentCompleted ? (
                <div className="space-y-6">
                  {/* Payment Amount */}
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700 text-lg mb-2">Registration Fee</p>
                    <p className="text-4xl font-bold text-orange-600">₹1</p>
                    <p className="text-sm text-gray-600 mt-2">One-time registration fee</p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
                    <div className="flex flex-col items-center">
                      <MdQrCode2 size={48} className="text-orange-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code to Pay</h3>
                      
                      {/* Real UPI QR Code */}
                      <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4 p-4">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=upi://pay?pa=psipl1@kbl%26pn=Parnets%20Software%20India%20Pvt%20Ltd%26am=1%26cu=INR`}
                          alt="UPI Payment QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 w-full mb-4">
                        <p className="text-base text-gray-900 text-center font-bold mb-3">
                          Parnets Software India Pvt Ltd
                        </p>
                        <p className="text-sm text-gray-700 text-center">
                          <strong>UPI ID:</strong> psipl1@kbl
                        </p>
                        <p className="text-sm text-gray-700 text-center mt-1">
                          <strong>Amount:</strong> ₹1
                        </p>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 w-full">
                        <p className="text-sm text-yellow-800 text-center">
                          <strong>Note:</strong> After payment, enter your transaction number below
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Number Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Number / UTR <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="transactionNumber"
                      value={formData.transactionNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                      placeholder="Enter transaction ID if available (e.g., 123456789012)"
                      maxLength="20"
                    />
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        • Find this in your UPI payment app after completing the transaction
                      </p>
                      <p className="text-xs text-gray-500">
                        • If provided, must be at least 12 characters (letters and numbers only)
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        • You can submit without transaction number - admin will verify from screenshot
                      </p>
                    </div>
                  </div>

                  {/* Payment Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Screenshot <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="paymentScreenshot"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="paymentScreenshot"
                      />
                      <label
                        htmlFor="paymentScreenshot"
                        className="flex flex-col items-center justify-center gap-3 px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                      >
                        {formData.paymentScreenshot ? (
                          <>
                            <div className="w-full max-w-md">
                              <img
                                src={URL.createObjectURL(formData.paymentScreenshot)}
                                alt="Payment Screenshot"
                                className="w-full h-auto rounded-lg border-2 border-green-500"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <MdCheckCircle className="text-green-600" size={20} />
                              <span className="text-sm text-gray-700 font-medium">{formData.paymentScreenshot.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">Click to change screenshot</span>
                          </>
                        ) : (
                          <>
                            <MdCloudUpload className="text-gray-400" size={48} />
                            <div className="text-center">
                              <span className="text-sm text-gray-700 font-medium block">Upload Payment Screenshot</span>
                              <span className="text-xs text-gray-500">Click to select image from your device</span>
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        • Take a clear screenshot of your payment confirmation
                      </p>
                      <p className="text-xs text-gray-500">
                        • Screenshot should show transaction number, amount (₹1), and date
                      </p>
                      <p className="text-xs text-gray-500">
                        • Accepted formats: JPG, PNG (Max 5MB)
                      </p>
                    </div>
                    
                    {/* Debug Info - Remove in production */}
                    {formData.paymentScreenshot && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                        ✓ Screenshot uploaded: {formData.paymentScreenshot.name}
                      </div>
                    )}
                  </div>

                  {/* Verify Payment Button */}
                  <button
                    type="button"
                    onClick={handlePaymentVerification}
                    disabled={!formData.paymentScreenshot}
                    className={`w-full px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                      !formData.paymentScreenshot
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <MdCheckCircle size={20} />
                    {!formData.paymentScreenshot 
                      ? 'Upload Screenshot First' 
                      : 'Submit for Verification'
                    }
                  </button>
                  
                  {/* Helper Text */}
                  <div className="text-center text-sm text-gray-600">
                    {!formData.paymentScreenshot && (
                      <p className="text-orange-600 font-medium">⚠️ Please upload payment screenshot above</p>
                    )}
                    {formData.paymentScreenshot && (
                      <p className="text-green-600 font-medium">✓ Ready to submit! Transaction number is optional.</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>How it works:</strong> Upload your payment screenshot. Transaction number is optional but recommended for faster verification. 
                      Admin will verify your payment and approve your registration within 24 hours.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> Make sure your screenshot clearly shows the payment details. Admin will verify the payment from the screenshot.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Payment Success */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
                    <MdCheckCircle size={64} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Payment Submitted!</h3>
                    <p className="text-gray-700 mb-4">Your payment has been submitted for verification</p>
                    
                    <div className="bg-white rounded-lg p-4 mt-4">
                      <p className="text-sm text-gray-600 mb-1">Transaction Number</p>
                      <p className="text-xl font-bold text-gray-900">{formData.transactionNumber}</p>
                    </div>

                    {/* Payment Screenshot Preview */}
                    {formData.paymentScreenshot && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Payment Screenshot</p>
                        <div className="max-w-sm mx-auto">
                          <img
                            src={URL.createObjectURL(formData.paymentScreenshot)}
                            alt="Payment Screenshot"
                            className="w-full h-auto rounded-lg border-2 border-gray-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 text-center">
                      <strong>Pending Admin Verification:</strong> Your payment screenshot will be verified by admin. You'll receive confirmation once approved.
                    </p>
                  </div>

                  {/* Registration Summary */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Registration Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration Type:</span>
                        <span className="font-medium text-gray-900">{formData.registrationType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-900">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mobile:</span>
                        <span className="font-medium text-gray-900">{formData.mobile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Services:</span>
                        <span className="font-medium text-gray-900">{formData.workerType.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Area:</span>
                        <span className="font-medium text-gray-900">{formData.serviceArea}</span>
                      </div>
                      {formData.registrationType === 'Crew / Team' && formData.teamSize && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team Members:</span>
                          <span className="font-medium text-gray-900">{formData.teamSize} people</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className="font-medium text-green-600">✓ Completed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Number:</span>
                        <span className="font-medium text-gray-900">{formData.transactionNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800 text-center">
                      Click "Submit Registration" below to complete your registration
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!formData.paymentCompleted}
                className={`ml-auto px-8 py-3 rounded-lg transition-colors font-semibold flex items-center gap-2 ${
                  formData.paymentCompleted
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <MdCheckCircle size={20} />
                Submit Registration
              </button>
            )}
          </div>
        </form>
          </>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Professional Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Blurred Background Overlay */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={() => {
              setShowReviewModal(false);
              setTimeout(() => navigate('/home'), 500);
            }}
          ></div>
          
          {/* Modal Content - Smaller Size */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-fadeIn border border-white/20">
            {/* Compact Header with Logo */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-center relative">
              {/* Logo */}
              <div className="flex justify-center mb-3">
                <img 
                  src="/src/assets/logo.jpeg" 
                  alt="Company Logo" 
                  className="w-16 h-16 rounded-full shadow-lg object-cover border-3 border-white"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              {/* Success Icon */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <MdCheckCircle className="text-green-500" size={28} />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">Application Submitted!</h2>
              <p className="text-green-50 text-xs">Under Review</p>
            </div>

            {/* Compact Content */}
            <div className="px-6 py-4 space-y-3">
              {/* Timeline */}
              <div className="text-center">
                <p className="text-sm text-gray-700">Review within</p>
                <p className="text-2xl font-bold text-orange-600 my-1">24-48 hours</p>
              </div>

              {/* What's Next - Compact */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  What's Next?
                </h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Payment verification</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Document review</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Email notification</span>
                  </li>
                </ul>
              </div>

              {/* Compact Details */}
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium text-gray-900">{formData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900">{formData.registrationType}</span>
                </div>
              </div>

             

              {/* Compact Action Button */}
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setTimeout(() => navigate('/home'), 500);
                }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg hover:shadow-xl text-sm"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerRegistration;
