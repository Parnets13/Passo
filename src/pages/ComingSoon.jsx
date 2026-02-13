import { MdClose, MdCheckCircle } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appType = searchParams.get('app') || 'customer'; // customer or partner
  const platform = searchParams.get('platform') || 'android'; // android or ios

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-visible animate-slideUp">
        {/* Close Button */}
        <button
          onClick={() => navigate('/home')}
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

          {/* App Type Badge */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {appType === 'partner' ? 'Partner App' : 'Customer App'} - {platform === 'ios' ? 'iOS' : 'Android'}
            </span>
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

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Visit Website
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
            >
              Go Back
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-400 text-xs mt-3">
            Use our web platform meanwhile
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
