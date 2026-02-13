import { useState } from 'react';
import { MdAttachMoney, MdTrendingUp, MdRefresh, MdDownload, MdSearch } from 'react-icons/md';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [filterType, setFilterType] = useState('all');

  const revenueStats = [
    { label: 'Today', amount: 45230, color: 'bg-blue-500' },
    { label: 'This Week', amount: 234500, color: 'bg-green-500' },
    { label: 'This Month', amount: 1250000, color: 'bg-purple-500' },
    { label: 'Total', amount: 8750000, color: 'bg-orange-500' },
  ];

  const transactions = [
    { id: 'TXN001', user: 'Rahul Sharma', type: 'Unlock', category: 'Electrician', amount: 15, razorpayId: 'pay_abc123', status: 'Success', date: '2024-02-09 14:30' },
    { id: 'TXN002', user: 'Rajesh Kumar', type: 'Onboarding', category: 'Individual', amount: 99, razorpayId: 'pay_abc124', status: 'Success', date: '2024-02-09 13:15' },
    { id: 'TXN003', user: 'Priya Patel', type: 'Unlock', category: 'Painter', amount: 10, razorpayId: 'pay_abc125', status: 'Failed', date: '2024-02-09 12:45' },
    { id: 'TXN004', user: 'ABC Contractors', type: 'Featured', category: 'Monthly', amount: 699, razorpayId: 'pay_abc126', status: 'Success', date: '2024-02-09 11:20' },
    { id: 'TXN005', user: 'Amit Kumar', type: 'Subscription', category: 'Pro Plan', amount: 799, razorpayId: 'pay_abc127', status: 'Success', date: '2024-02-09 10:00' },
  ];

  const revenueByCategory = [
    { category: 'Electrician', unlocks: 245, revenue: 3675 },
    { category: 'Painter', unlocks: 198, revenue: 1980 },
    { category: 'Plumber', unlocks: 167, revenue: 2004 },
    { category: 'Carpenter', unlocks: 134, revenue: 2010 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payments & Revenue</h1>
          <p className="text-gray-600 text-sm">Track all transactions and revenue</p>
        </div>
        <button type="button" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <MdDownload size={20} />
          Export Report
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{stat.amount.toLocaleString()}</h3>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <MdAttachMoney size={28} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Transactions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('revenue')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'revenue'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Revenue Reports
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('refunds')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'refunds'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Refunds & Credits
          </button>
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="p-4">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by transaction ID, user..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="unlock">Unlock</option>
                <option value="onboarding">Onboarding</option>
                <option value="featured">Featured</option>
                <option value="subscription">Subscription</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razorpay ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{txn.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{txn.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{txn.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{txn.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{txn.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{txn.razorpayId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          txn.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{txn.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Reports Tab */}
        {activeTab === 'revenue' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Category-wise Revenue</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Unlocks</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {revenueByCategory.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.unlocks}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{item.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Refunds Tab */}
        {activeTab === 'refunds' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Issue Refund</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Transaction ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Refund Amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Reason for refund"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2" type="button">
                    <MdRefresh size={20} />
                    Process Refund
                  </button>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Free Credits</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="User Mobile Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Number of Credits"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Reason for credits"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2" type="button">
                    <MdTrendingUp size={20} />
                    Add Credits
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
