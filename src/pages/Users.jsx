import { useState } from 'react';
import { MdSearch, MdBlock, MdCheckCircle, MdHistory, MdPayment, MdCardGiftcard } from 'react-icons/md';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [creditsAmount, setCreditsAmount] = useState('');
  const [creditsReason, setCreditsReason] = useState('');

  const [users, setUsers] = useState([
    { id: 1, name: 'Rahul Sharma', mobile: '9876543210', unlocks: 45, spent: 2250, status: 'Active' },
    { id: 2, name: 'Priya Patel', mobile: '9876543211', unlocks: 32, spent: 1600, status: 'Active' },
    { id: 3, name: 'Amit Kumar', mobile: '9876543212', unlocks: 18, spent: 900, status: 'Blocked' },
    { id: 4, name: 'Sneha Reddy', mobile: '9876543213', unlocks: 67, spent: 3350, status: 'Active' },
  ]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'Active' ? 'Blocked' : 'Active';
        showToast(`User ${newStatus === 'Blocked' ? 'blocked' : 'unblocked'} successfully`, 'success');
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleViewHistory = (user) => {
    setSelectedUser(user);
    setIsHistoryModalOpen(true);
  };

  const handleIssueCredits = (user) => {
    setSelectedUser(user);
    setCreditsAmount('');
    setCreditsReason('');
    setIsCreditsModalOpen(true);
  };

  const submitCredits = (e) => {
    e.preventDefault();
    if (!creditsAmount || !creditsReason) {
      showToast('Please fill all fields', 'error');
      return;
    }

    // Update user unlocks
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, unlocks: user.unlocks + Number(creditsAmount) }
        : user
    ));

    showToast(`${creditsAmount} free credits issued to ${selectedUser.name}`, 'success');
    setIsCreditsModalOpen(false);
  };

  const filteredUsers = users.filter(user => 
    user.mobile.includes(searchTerm) || 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-600 text-sm">Manage Hire App users</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by mobile number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Unlocks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.mobile}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.unlocks}</td>
                <td className="px-6 py-4 text-sm text-gray-600">₹{user.spent}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => handleViewHistory(user)}
                      className="p-2 hover:bg-gray-100 rounded" 
                      title="View History"
                    >
                      <MdHistory size={18} className="text-blue-600" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleViewHistory(user)}
                      className="p-2 hover:bg-gray-100 rounded" 
                      title="Payment History"
                    >
                      <MdPayment size={18} className="text-green-600" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleIssueCredits(user)}
                      className="p-2 hover:bg-gray-100 rounded" 
                      title="Issue Credits"
                    >
                      <MdCardGiftcard size={18} className="text-purple-600" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => toggleUserStatus(user.id)}
                      className="p-2 hover:bg-gray-100 rounded" 
                      title={user.status === 'Active' ? 'Block' : 'Unblock'}
                    >
                      {user.status === 'Active' ? (
                        <MdBlock size={18} className="text-red-600" />
                      ) : (
                        <MdCheckCircle size={18} className="text-green-600" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={`${selectedUser?.name} - History`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Total Unlocks</p>
              <p className="text-xl font-bold text-gray-900">{selectedUser?.unlocks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">₹{selectedUser?.spent}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Recent Unlocks</h4>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">Electrician - Rajesh Kumar</p>
                    <p className="text-sm text-gray-600">2024-02-0{10-i} 14:30</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹15</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Issue Credits Modal */}
      <Modal
        isOpen={isCreditsModalOpen}
        onClose={() => setIsCreditsModalOpen(false)}
        title={`Issue Free Credits - ${selectedUser?.name}`}
        size="md"
      >
        <form onSubmit={submitCredits} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Credits *
            </label>
            <input
              type="number"
              value={creditsAmount}
              onChange={(e) => setCreditsAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 5"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <textarea
              value={creditsReason}
              onChange={(e) => setCreditsReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Reason for issuing credits..."
              rows="3"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Issue Credits
            </button>
            <button
              type="button"
              onClick={() => setIsCreditsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
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

export default Users;
