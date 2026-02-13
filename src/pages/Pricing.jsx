import { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const Pricing = () => {
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editValue, setEditValue] = useState('');

  const [onboardingFees, setOnboardingFees] = useState([
    { type: 'Individual', price: 99 },
    { type: 'Crew Leader', price: 299 },
    { type: 'Contractor', price: 499 },
    { type: 'Service Provider', price: 999 },
  ]);

  const [featuredPlans, setFeaturedPlans] = useState([
    { duration: 'Weekly', price: 199, visibility: 'High' },
    { duration: 'Monthly', price: 699, visibility: 'Very High' },
  ]);

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    { name: 'Free', price: 0, validity: 'Forever', benefits: 'Basic listing' },
    { name: 'Starter', price: 299, validity: '1 Month', benefits: 'Priority listing + Badge' },
    { name: 'Pro', price: 799, validity: '3 Months', benefits: 'Featured + Verified Badge' },
    { name: 'Business', price: 1999, validity: '1 Year', benefits: 'Top ranking + All badges' },
  ]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleEdit = (item, category) => {
    setEditingItem({ ...item, category });
    setEditValue(item.price.toString());
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editValue || isNaN(editValue)) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    const newPrice = Number(editValue);

    if (editingItem.category === 'onboarding') {
      setOnboardingFees(onboardingFees.map(fee => 
        fee.type === editingItem.type ? { ...fee, price: newPrice } : fee
      ));
    } else if (editingItem.category === 'featured') {
      setFeaturedPlans(featuredPlans.map(plan => 
        plan.duration === editingItem.duration ? { ...plan, price: newPrice } : plan
      ));
    } else if (editingItem.category === 'subscription') {
      setSubscriptionPlans(subscriptionPlans.map(plan => 
        plan.name === editingItem.name ? { ...plan, price: newPrice } : plan
      ));
    }

    showToast('Price updated successfully', 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pricing & Plans</h1>
        <p className="text-gray-600 text-sm">Manage all pricing and subscription plans</p>
      </div>

      {/* Onboarding Fees */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Worker Onboarding Fees</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {onboardingFees.map((fee, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600">{fee.type}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">₹{fee.price}</p>
              <button 
                type="button"
                onClick={() => handleEdit(fee, 'onboarding')}
                className="mt-3 text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <MdEdit size={16} /> Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured Listing Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredPlans.map((plan, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600">{plan.duration}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">₹{plan.price}</p>
              <p className="text-xs text-gray-500 mt-1">Visibility: {plan.visibility}</p>
              <button 
                type="button"
                onClick={() => handleEdit(plan, 'featured')}
                className="mt-3 text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <MdEdit size={16} /> Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subscription Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subscriptionPlans.map((plan, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <p className="text-lg font-semibold text-gray-800">{plan.name}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">₹{plan.price}</p>
              <p className="text-xs text-gray-500 mt-1">{plan.validity}</p>
              <p className="text-sm text-gray-600 mt-2">{plan.benefits}</p>
              <button 
                type="button"
                onClick={() => handleEdit(plan, 'subscription')}
                className="mt-3 text-blue-600 text-sm flex items-center gap-1 hover:underline"
              >
                <MdEdit size={16} /> Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit ${editingItem?.type || editingItem?.duration || editingItem?.name} Price`}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Price (₹) *
            </label>
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new price"
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Pricing;
