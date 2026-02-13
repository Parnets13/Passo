import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPhone, MdLock, MdVisibility, MdVisibilityOff, MdClose } from 'react-icons/md';

const WorkerLogin = ({ onClose }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!mobile || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate mobile number (10 digits)
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    // Check if user exists in localStorage (from worker registration)
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.mobile === mobile && u.password === password);
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');
        setIsLoading(false);
        onClose();
        // You can navigate to worker dashboard here
        // navigate('/worker-dashboard');
      } else {
        setError('Invalid mobile number or password. Please register first.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Close"
        >
          <MdClose size={24} />
        </button>

        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#26296c] via-[#1e2154] to-[#26296c] px-8 py-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-2xl blur-md opacity-50"></div>
              <img 
                src="/src/assets/logo.jpeg" 
                alt="Passo Logo" 
                className="relative w-24 h-24 rounded-2xl shadow-2xl object-cover border-4 border-white"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Worker Login</h1>
          <p className="text-blue-100">Sign in to access your account</p>
        </div>

        {/* Form Section */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Mobile Number Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPhone className="text-gray-400 group-focus-within:text-[#26296c] transition-colors" size={20} />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#26296c] focus:border-[#26296c] focus:bg-white transition-all outline-none"
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="text-gray-400 group-focus-within:text-[#26296c] transition-colors" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#26296c] focus:border-[#26296c] focus:bg-white transition-all outline-none"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all transform ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#26296c] hover:bg-[#1e2154] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  onClose();
                  navigate('/worker-registration');
                }}
                className="text-[#26296c] hover:text-[#1e2154] font-semibold transition-colors"
              >
                Register as Service Provider
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;
