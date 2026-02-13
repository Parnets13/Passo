import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MdArrowBack, MdCreditCard, MdAccountBalance, MdQrCode,
  MdCheckCircle, MdLock, MdPayment
} from 'react-icons/md';
import { FaGooglePay, FaAmazon } from 'react-icons/fa';
import { SiPhonepe, SiPaytm } from 'react-icons/si';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, package: selectedPackage, bookingDetails } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  const totalAmount = selectedPackage ? selectedPackage.price + Math.round(selectedPackage.price * 0.18) : 0;

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: <MdQrCode size={32} />, popular: true },
    { id: 'card', name: 'Credit/Debit Card', icon: <MdCreditCard size={32} /> },
    { id: 'netbanking', name: 'Net Banking', icon: <MdAccountBalance size={32} /> },
    { id: 'wallet', name: 'Wallets', icon: <MdPayment size={32} /> }
  ];

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: <FaGooglePay size={32} /> },
    { id: 'phonepe', name: 'PhonePe', icon: <SiPhonepe size={32} /> },
    { id: 'paytm', name: 'Paytm', icon: <SiPaytm size={32} /> }
  ];

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      navigate('/payment-success', {
        state: {
          service,
          package: selectedPackage,
          bookingDetails,
          amount: totalAmount,
          bookingId: 'BK' + Date.now()
        }
      });
    }, 2000);
  };

  if (!service || !selectedPackage || !bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid payment session</h2>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Payment</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Payment Method</h2>

                {/* Payment Method Options */}
                <div className="space-y-4 mb-8">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#2596be] bg-blue-50'
                          : 'border-gray-200 hover:border-[#2596be]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                          paymentMethod === method.id ? 'bg-[#2596be] text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{method.name}</div>
                          {method.popular && (
                            <span className="text-xs text-green-600 font-semibold">Most Popular</span>
                          )}
                        </div>
                        {paymentMethod === method.id && (
                          <MdCheckCircle className="text-[#2596be]" size={24} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* UPI Apps (if UPI selected) */}
                {paymentMethod === 'upi' && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose UPI App</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#2596be] hover:bg-blue-50 transition-all text-center"
                        >
                          <div className="text-[#2596be] mb-2 flex justify-center">{app.icon}</div>
                          <div className="text-sm font-semibold text-gray-900">{app.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card Details (if Card selected) */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#2596be] focus:ring-4 focus:ring-[#2596be]/10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Info */}
                <div className="p-4 bg-green-50 rounded-xl mb-6">
                  <div className="flex items-start gap-3">
                    <MdLock className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
                    <div className="text-sm text-green-800">
                      <div className="font-semibold mb-1">Secure Payment</div>
                      <div>Your payment is encrypted and processed securely. We never store your card details.</div>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className={`w-full py-4 bg-gradient-to-r from-[#1a7a9e] to-[#3ab5e0] text-white font-bold rounded-xl hover:shadow-xl transition-all ${
                    processing ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
                  }`}
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${totalAmount}`
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-600">Service</div>
                    <div className="font-semibold text-gray-900">{service}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Package</div>
                    <div className="font-semibold text-gray-900">{selectedPackage.name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Date & Time</div>
                    <div className="font-semibold text-gray-900">
                      {bookingDetails.date} at {bookingDetails.time}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-semibold text-gray-900">{bookingDetails.city}</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-semibold">₹{Math.round(selectedPackage.price * 0.18)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-[#2596be]">₹{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
