import { useNavigate, useLocation } from 'react-router-dom';
import { MdCheckCircle, MdHome, MdDownload, MdCalendarToday, MdLocationOn } from 'react-icons/md';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, package: selectedPackage, bookingDetails, amount, bookingId } = location.state || {};

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No booking found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-[#1a7a9e] to-[#3ab5e0] text-white font-semibold rounded-xl"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-bounce">
            <MdCheckCircle size={64} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600">Your booking has been confirmed</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Booking ID</div>
                <div className="text-2xl font-bold text-gray-900">{bookingId}</div>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Confirmed
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Service Details</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-bold text-lg text-gray-900 mb-1">{service}</div>
                <div className="text-gray-600">{selectedPackage?.name} Package</div>
                <div className="text-sm text-gray-500 mt-2">Duration: {selectedPackage?.duration}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <MdCalendarToday size={16} />
                  Scheduled Date & Time
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold text-gray-900">{bookingDetails?.date}</div>
                  <div className="text-gray-600">{bookingDetails?.time}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <MdLocationOn size={16} />
                  Service Location
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="font-semibold text-gray-900">{bookingDetails?.city}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{bookingDetails?.address}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-2">Contact Information</div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="font-semibold text-gray-900">{bookingDetails?.name}</div>
                <div className="text-gray-600">{bookingDetails?.phone}</div>
                {bookingDetails?.email && (
                  <div className="text-gray-600">{bookingDetails?.email}</div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Amount Paid</span>
                <span className="text-3xl font-bold text-green-600">₹{amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#2596be] hover:text-[#2596be] transition-all"
          >
            <MdHome size={24} />
            Back to Home
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#1a7a9e] to-[#3ab5e0] text-white font-semibold rounded-xl hover:shadow-xl transition-all"
          >
            <MdDownload size={24} />
            Download Receipt
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-2">What's Next?</div>
            <ul className="space-y-1 list-disc list-inside">
              <li>You will receive a confirmation SMS and email shortly</li>
              <li>Our service provider will contact you before the scheduled time</li>
              <li>For any queries, contact our support team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
