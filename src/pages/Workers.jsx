import { useState, useEffect } from 'react';
import { MdFilterList, MdVerified, MdStar, MdBlock, MdCheckCircle, MdPerson, MdCancel, MdDescription, MdDelete } from 'react-icons/md';
import Toast from '../components/Toast';

const Workers = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    console.log('🔄 Loading workers from MongoDB...');
    console.log('📍 API URL: https://passo-backend.onrender.com/api/workers');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        console.error('❌ No admin token found. Please login first.');
        showToast('Please login to view workers', 'error');
        setWorkers([]); // Set empty array
        return;
      }

      console.log('📡 Fetching from MongoDB backend API...');
      console.log('🔑 Token:', token.substring(0, 20) + '...');
      
      // Add cache busting and force fresh data
      const cacheBuster = `?_t=${Date.now()}`;
      const response = await fetch(`https://passo-backend.onrender.com/api/workers${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', {
        'content-type': response.headers.get('content-type'),
        'cache-control': response.headers.get('cache-control')
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 RAW Response data:', JSON.stringify(data, null, 2));
        
        if (data.success && data.data) {
          console.log('✅ MongoDB returned', data.data.length, 'workers');
          
          if (data.data.length === 0) {
            console.log('⚠️  No workers found in MongoDB');
            console.log('💡 Register workers at: http://localhost:5173/worker-registration');
            setWorkers([]);
            showToast('No workers found. Register workers to see them here.', 'info');
            return;
          }
          
          // Transform backend data to match UI format
          const backendWorkers = data.data.map(worker => ({
            id: worker._id,
            name: worker.name,
            type: worker.workerType,
            category: worker.category,
            city: worker.city || worker.serviceArea,
            verified: worker.verified,
            featured: worker.featured,
            online: worker.online,
            status: worker.status,
            email: worker.email,
            mobile: worker.mobile,
            languages: worker.languages || [],
            profilePhoto: worker.profilePhoto,
            teamSize: worker.teamSize,
            badges: worker.badges || [],
            aadhaarDoc: worker.aadhaarDoc,
            panCard: worker.panCard,
            gstCertificate: worker.gstCertificate,
            gstNumber: worker.gstNumber,
            msmeCertificate: worker.msmeCertificate,
            msmeNumber: worker.msmeNumber,
            submittedAt: worker.submittedAt || worker.createdAt,
            transactionNumber: worker.onboardingFee?.transactionId
          }));
          
          console.log('✅ Setting', backendWorkers.length, 'workers to state');
          setWorkers(backendWorkers);
          
          // Log statistics
          const pending = backendWorkers.filter(w => w.status === 'Pending');
          const approved = backendWorkers.filter(w => w.status === 'Approved');
          const rejected = backendWorkers.filter(w => w.status === 'Rejected');
          
          console.log('📊 Workers Summary:');
          console.log('   Total:', backendWorkers.length);
          console.log('   Pending:', pending.length);
          console.log('   Approved:', approved.length);
          console.log('   Rejected:', rejected.length);
          
          if (pending.length > 0) {
            console.log('📋 Pending Workers:');
            pending.forEach(w => console.log(`   - ${w.name} (${w.category}) - ${w.mobile}`));
          }
          
          showToast(`Loaded ${backendWorkers.length} workers from database`, 'success');
          return;
        } else {
          console.error('❌ Invalid response format:', data);
          setWorkers([]);
          showToast('Invalid response from server', 'error');
        }
      } else if (response.status === 401) {
        console.error('❌ Unauthorized. Please login again.');
        setWorkers([]);
        showToast('Session expired. Please login again.', 'error');
        return;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Backend API returned error:', response.status, errorData);
        setWorkers([]);
        showToast('Failed to load workers from database', 'error');
      }
    } catch (error) {
      console.error('❌ Failed to load workers from MongoDB:', error);
      console.error('   Error details:', error.message);
      console.error('   Stack:', error.stack);
      setWorkers([]);
      showToast('Unable to connect to database. Please ensure backend is running.', 'error');
      console.log('⚠️  Make sure:');
      console.log('   1. Backend is running: cd backend && npm start');
      console.log('   2. MongoDB is connected');
      console.log('   3. You are logged in as admin');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleApprove = async (workerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('🔄 Approving worker:', workerId);
      
      const response = await fetch(`https://passo-backend.onrender.com/api/workers/${workerId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Worker approved in MongoDB');
          
          // Update local state with badges
          const updatedWorkers = workers.map(worker => 
            worker.id === workerId ? { 
              ...worker, 
              status: 'Approved', 
              verified: true,
              badges: ['Verified', 'Trusted Pro']
            } : worker
          );
          setWorkers(updatedWorkers);
          showToast('Worker approved successfully with Verified and Trusted badges', 'success');
          return;
        }
      }
      
      throw new Error('Failed to approve worker');
    } catch (error) {
      console.error('❌ Failed to approve worker:', error.message);
      showToast('Failed to approve worker. Please try again.', 'error');
    }
  };

  const handleReject = async (worker) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      const token = localStorage.getItem('adminToken');
      console.log('🔄 Rejecting worker:', worker.id);
      
      const response = await fetch(`https://passo-backend.onrender.com/api/workers/${worker.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Worker rejected in MongoDB');
          
          // Update local state
          const updatedWorkers = workers.map(w => 
            w.id === worker.id ? { ...w, status: 'Rejected', rejectionReason: reason } : w
          );
          setWorkers(updatedWorkers);
          showToast('Worker rejected', 'warning');
          return;
        }
      }
      
      throw new Error('Failed to reject worker');
    } catch (error) {
      console.error('❌ Failed to reject worker:', error.message);
      showToast('Failed to reject worker. Please try again.', 'error');
    }
  };

  const handleBlock = async (workerId) => {
    if (!window.confirm('Are you sure you want to block this worker?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      console.log('🔄 Blocking worker:', workerId);
      
      const response = await fetch(`https://passo-backend.onrender.com/api/workers/${workerId}/block`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Worker blocked in MongoDB');
          
          // Update local state
          const updatedWorkers = workers.map(worker => 
            worker.id === workerId ? { ...worker, status: 'Blocked', online: false } : worker
          );
          setWorkers(updatedWorkers);
          showToast('Worker blocked successfully', 'success');
          return;
        }
      }
      
      throw new Error('Failed to block worker');
    } catch (error) {
      console.error('❌ Failed to block worker:', error.message);
      showToast('Failed to block worker. Please try again.', 'error');
    }
  };

  const handleDelete = async (workerId, workerName) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${workerName}? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      console.log('🔄 Deleting worker:', workerId);
      
      const response = await fetch(`https://passo-backend.onrender.com/api/workers/${workerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('✅ Worker deleted from MongoDB');
          
          // Remove from local state
          const updatedWorkers = workers.filter(worker => worker.id !== workerId);
          setWorkers(updatedWorkers);
          showToast('Worker deleted successfully', 'success');
          return;
        }
      }
      
      throw new Error('Failed to delete worker');
    } catch (error) {
      console.error('❌ Failed to delete worker:', error.message);
      showToast('Failed to delete worker. Please try again.', 'error');
    }
  };

  const toggleFeatured = async (workerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const worker = workers.find(w => w.id === workerId);
      const newFeatured = !worker.featured;
      
      const endpoint = newFeatured 
        ? `https://passo-backend.onrender.com/api/workers/${workerId}/featured`
        : `https://passo-backend.onrender.com/api/workers/${workerId}/featured`;
      
      const response = await fetch(endpoint, {
        method: newFeatured ? 'POST' : 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: newFeatured ? JSON.stringify({ plan: 'Monthly' }) : undefined
      });

      if (response.ok) {
        setWorkers(workers.map(w => 
          w.id === workerId ? { ...w, featured: newFeatured } : w
        ));
        showToast(`Worker ${newFeatured ? 'marked as' : 'removed from'} featured`, 'success');
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      showToast('Failed to update featured status', 'error');
    }
  };

  const handleViewProfile = (worker) => {
    setSelectedWorker(worker);
    setIsProfileModalOpen(true);
  };

  const filteredWorkers = workers.filter(worker => {
    if (activeTab === 'pending') return worker.status === 'Pending';
    if (activeTab === 'kyc') return !worker.verified;
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Workers', count: workers.length },
    { id: 'pending', label: 'Pending Approval', count: workers.filter(w => w.status === 'Pending').length },
    { id: 'kyc', label: 'KYC Verification', count: workers.filter(w => !w.verified).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Workers Management</h1>
          <p className="text-gray-600 text-sm">Manage all workers and approvals</p>
        </div>
        <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <MdFilterList className="inline mr-2" />
          Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Workers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badges</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-sm shadow-md">
                        {worker.profilePhoto ? (
                          <img 
                            src={worker.profilePhoto} 
                            alt={worker.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails to load, show initials
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                            }}
                          />
                        ) : (
                          <span>{worker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <button 
                          type="button"
                          onClick={() => handleViewProfile(worker)}
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {worker.name}
                        </button>
                        <p className="text-xs text-gray-500">{worker.online ? '🟢 Online' : '⚫ Offline'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{worker.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {Array.isArray(worker.category) ? worker.category.join(', ') : worker.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{worker.city}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      worker.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      worker.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {worker.verified && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                          <MdVerified size={12} /> Verified
                        </span>
                      )}
                      {worker.badges && worker.badges.includes('Trusted Pro') && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Trusted
                        </span>
                      )}
                      {worker.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                          <MdStar size={12} /> Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {worker.status === 'Pending' && (
                        <>
                          <button 
                            type="button"
                            onClick={() => handleApprove(worker.id)}
                            className="p-2 hover:bg-green-50 rounded" 
                            title="Approve"
                          >
                            <MdCheckCircle size={18} className="text-green-600" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleReject(worker)}
                            className="p-2 hover:bg-red-50 rounded" 
                            title="Reject"
                          >
                            <MdCancel size={18} className="text-red-600" />
                          </button>
                        </>
                      )}
                      {worker.status === 'Approved' && (
                        <>
                          <button 
                            type="button"
                            onClick={() => toggleFeatured(worker.id)}
                            className="p-2 hover:bg-yellow-50 rounded" 
                            title={worker.featured ? 'Remove Featured' : 'Mark Featured'}
                          >
                            <MdStar size={18} className={worker.featured ? 'text-yellow-500' : 'text-gray-400'} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleBlock(worker.id)}
                            className="p-2 hover:bg-red-50 rounded" 
                            title="Block"
                          >
                            <MdBlock size={18} className="text-red-600" />
                          </button>
                        </>
                      )}
                      <button 
                        type="button"
                        onClick={() => handleDelete(worker.id, worker.name)}
                        className="p-2 hover:bg-red-50 rounded" 
                        title="Delete Permanently"
                      >
                        <MdDelete size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal - Custom Implementation */}
      {isProfileModalOpen && selectedWorker && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full z-[10000]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedWorker.name} - Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-6 pb-6 border-b">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                      {selectedWorker.profilePhoto ? (
                        <img 
                          src={selectedWorker.profilePhoto} 
                          alt={selectedWorker.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const initials = selectedWorker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                            e.target.parentElement.innerHTML = `<span class="text-3xl font-bold">${initials}</span>`;
                          }}
                        />
                      ) : (
                        <span>{selectedWorker.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedWorker.name}</h3>
                      <p className="text-gray-600">
                        {Array.isArray(selectedWorker.category) 
                          ? selectedWorker.category.join(', ') 
                          : selectedWorker.category}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {selectedWorker.verified && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                            <MdVerified size={14} /> Verified
                          </span>
                        )}
                        {selectedWorker.badges && selectedWorker.badges.includes('Trusted Pro') && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                            <MdCheckCircle size={14} /> Trusted
                          </span>
                        )}
                        {selectedWorker.featured && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center gap-1">
                            <MdStar size={14} /> Featured
                          </span>
                        )}
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          selectedWorker.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          selectedWorker.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedWorker.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MdPerson className="text-blue-600" />
                      Contact Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedWorker.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mobile</p>
                        <p className="font-medium text-gray-900">{selectedWorker.mobile || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Service Area</p>
                        <p className="font-medium text-gray-900">{selectedWorker.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Worker Type</p>
                        <p className="font-medium text-gray-900">{selectedWorker.type}</p>
                      </div>
                      {selectedWorker.type === 'Crew' && selectedWorker.teamSize && (
                        <div>
                          <p className="text-sm text-gray-600">Team Members</p>
                          <p className="font-medium text-gray-900">{selectedWorker.teamSize} people</p>
                        </div>
                      )}
                      {selectedWorker.languages && selectedWorker.languages.length > 0 && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600 mb-2">Languages Known</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedWorker.languages.map((language, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full font-medium"
                              >
                                {language}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  {selectedWorker.aadhaarDoc && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MdDescription className="text-blue-600" />
                        Uploaded Documents
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          { label: 'Aadhaar Card', file: selectedWorker.aadhaarDoc },
                          { label: 'PAN Card', file: selectedWorker.panCard },
                          { label: 'Electricity Bill', file: selectedWorker.electricityBill },
                          { label: 'Cancelled Cheque', file: selectedWorker.cancelledCheque }
                        ].filter(doc => doc.file).map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <MdCheckCircle className="text-green-600" size={20} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.label}</p>
                              <p className="text-xs text-gray-500">{doc.file}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission Info */}
                  {selectedWorker.submittedAt && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Submitted on:</strong> {new Date(selectedWorker.submittedAt).toLocaleString()}
                      </p>
                      {selectedWorker.transactionNumber && (
                        <p className="text-sm text-blue-800 mt-2">
                          <strong>Transaction Number:</strong> {selectedWorker.transactionNumber}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default Workers;
