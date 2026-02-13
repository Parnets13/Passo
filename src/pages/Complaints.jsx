import { useState } from 'react';
import { MdWarning, MdCheckCircle, MdBlock, MdRefresh, MdVisibility } from 'react-icons/md';

const Complaints = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const complaints = [
    { id: 'CMP001', user: 'Rahul Sharma', worker: 'Rajesh Kumar', type: 'Wrong Number', category: 'Electrician', date: '2024-02-09 14:30', status: 'Pending', description: 'Number not reachable' },
    { id: 'CMP002', user: 'Priya Patel', worker: 'Suresh Painting', type: 'Not Reachable', category: 'Painter', date: '2024-02-09 13:15', status: 'Pending', description: 'Worker not responding to calls' },
    { id: 'CMP003', user: 'Amit Kumar', worker: 'ABC Contractors', type: 'Fraud', category: 'Construction', date: '2024-02-09 12:00', status: 'Under Review', description: 'Fake profile with wrong credentials' },
    { id: 'CMP004', user: 'Sneha Reddy', worker: 'Quick Fix Services', type: 'Misleading Profile', category: 'Plumber', date: '2024-02-09 10:45', status: 'Resolved', description: 'Profile information does not match' },
  ];

  const complaintTypes = [
    { type: 'Wrong Number', count: 12, color: 'bg-yellow-100 text-yellow-800' },
    { type: 'Not Reachable', count: 8, color: 'bg-orange-100 text-orange-800' },
    { type: 'Fraud', count: 3, color: 'bg-red-100 text-red-800' },
    { type: 'Misleading Profile', count: 5, color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Complaints & Reports</h1>
        <p className="text-gray-600 text-sm">Manage user complaints and reports</p>
      </div>

      {/* Complaint Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complaintTypes.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{item.type}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{item.count}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.color}`}>
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="review">Under Review</option>
            <option value="resolved">Resolved</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Types</option>
            <option value="wrong">Wrong Number</option>
            <option value="notreach">Not Reachable</option>
            <option value="fraud">Fraud</option>
            <option value="misleading">Misleading Profile</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{complaint.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{complaint.user}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{complaint.worker}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    complaint.type === 'Fraud' ? 'bg-red-100 text-red-800' :
                    complaint.type === 'Wrong Number' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {complaint.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{complaint.category}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{complaint.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button type="button" className="p-2 hover:bg-blue-50 rounded" title="View Details">
                      <MdVisibility size={18} className="text-blue-600" />
                    </button>
                    <button type="button" className="p-2 hover:bg-yellow-50 rounded" title="Warn Worker">
                      <MdWarning size={18} className="text-yellow-600" />
                    </button>
                    <button type="button" className="p-2 hover:bg-green-50 rounded" title="Refund Unlock">
                      <MdRefresh size={18} className="text-green-600" />
                    </button>
                    <button type="button" className="p-2 hover:bg-red-50 rounded" title="Block Worker">
                      <MdBlock size={18} className="text-red-600" />
                    </button>
                    <button type="button" className="p-2 hover:bg-green-50 rounded" title="Mark Resolved">
                      <MdCheckCircle size={18} className="text-green-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaints;
