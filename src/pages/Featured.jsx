import { useState, useEffect } from 'react';
import { MdCheckCircle, MdCancel, MdStar, MdArrowUpward, MdArrowDownward, MdRemoveCircle, MdRateReview, MdPerson, MdWork } from 'react-icons/md';
import Toast from '../components/Toast';
import api from '../services/api';

const Featured = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    avgRating: 0
  });

  // Featured state
  const [featuredRequests, setFeaturedRequests] = useState([]);
  const [activeFeatured, setActiveFeatured] = useState([]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      loadReviews();
      loadReviewStats();
    } else if (activeTab === 'requests') {
      loadFeaturedRequests();
    } else if (activeTab === 'active') {
      loadActiveFeatured();
    }
  }, [activeTab]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading reviews...');
      const response = await api.get('/reviews');
      console.log('📥 Reviews response:', response);
      
      // The api interceptor already returns response.data, so response IS the data object
      if (response.success) {
        console.log('✅ Reviews loaded:', response.data.length);
        setReviews(response.data); // response.data contains the array of reviews
      } else {
        console.error('❌ Response not successful:', response);
        showToast('Failed to load reviews', 'error');
      }
    } catch (error) {
      console.error('❌ Failed to load reviews:', error);
      console.error('Error details:', error.message);
      showToast(error.message || 'Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadReviewStats = async () => {
    try {
      console.log('🔍 Loading review stats...');
      const response = await api.get('/reviews/stats');
      console.log('📊 Stats response:', response);
      
      // The api interceptor already returns response.data
      if (response.success) {
        console.log('✅ Stats loaded:', response.data);
        setReviewStats(response.data); // response.data contains the stats object
      }
    } catch (error) {
      console.error('❌ Failed to load review stats:', error);
    }
  };

  const loadFeaturedRequests = async () => {
    setLoading(true);
    try {
      // Load workers who want to be featured (you can add a field in Worker model)
      // For now, using static data
      setFeaturedRequests([
        { id: 1, workerName: 'Rajesh Kumar', type: 'Individual', category: 'Electrician', plan: 'Weekly', amount: 199, status: 'Pending' },
        { id: 2, workerName: 'ABC Contractors', type: 'Contractor', category: 'Construction', plan: 'Monthly', amount: 699, status: 'Pending' },
      ]);
    } catch (error) {
      console.error('Failed to load featured requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveFeatured = async () => {
    setLoading(true);
    try {
      const response = await api.get('/workers?featured=true&status=Approved');
      if (response.data.success) {
        const featured = response.data.data.map((worker, index) => ({
          id: worker._id,
          workerName: worker.name,
          category: worker.category,
          plan: worker.featuredPlan || 'Monthly',
          startDate: worker.createdAt ? new Date(worker.createdAt).toISOString().split('T')[0] : '',
          endDate: worker.featuredExpiresAt ? new Date(worker.featuredExpiresAt).toISOString().split('T')[0] : '',
          priority: worker.featuredPriority || index + 1,
        }));
        setActiveFeatured(featured);
      }
    } catch (error) {
      console.error('Failed to load active featured:', error);
      showToast('Failed to load featured workers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Review actions
  const handleApproveReview = async (reviewId) => {
    try {
      console.log('🔄 Approving review:', reviewId);
      const response = await api.post(`/reviews/${reviewId}/approve`);
      console.log('✅ Approve response:', response);
      
      if (response.success) {
        showToast('Review approved successfully', 'success');
        // Update local state immediately for better UX
        setReviews(reviews.map(r => 
          r._id === reviewId ? { ...r, status: 'Approved', isVerified: true } : r
        ));
        // Update stats
        setReviewStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
      } else {
        showToast(response.message || 'Failed to approve review', 'error');
      }
    } catch (error) {
      console.error('❌ Failed to approve review:', error);
      showToast(error.message || 'Failed to approve review', 'error');
    }
  };

  const handleRejectReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to reject this review?')) {
      try {
        console.log('🔄 Rejecting review:', reviewId);
        const response = await api.post(`/reviews/${reviewId}/reject`);
        console.log('✅ Reject response:', response);
        
        if (response.success) {
          showToast('Review rejected', 'warning');
          // Update local state immediately
          setReviews(reviews.map(r => 
            r._id === reviewId ? { ...r, status: 'Rejected' } : r
          ));
          // Update stats
          setReviewStats(prev => ({
            ...prev,
            pending: prev.pending - 1,
            rejected: prev.rejected + 1
          }));
        } else {
          showToast(response.message || 'Failed to reject review', 'error');
        }
      } catch (error) {
        console.error('❌ Failed to reject review:', error);
        showToast(error.message || 'Failed to reject review', 'error');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        console.log('🗑️ Deleting review:', reviewId);
        const response = await api.delete(`/reviews/${reviewId}`);
        console.log('✅ Delete response:', response);
        
        if (response.success) {
          showToast('Review deleted successfully', 'success');
          // Remove from local state immediately
          const deletedReview = reviews.find(r => r._id === reviewId);
          setReviews(reviews.filter(r => r._id !== reviewId));
          // Update stats
          setReviewStats(prev => ({
            ...prev,
            total: prev.total - 1,
            [deletedReview.status.toLowerCase()]: prev[deletedReview.status.toLowerCase()] - 1
          }));
        } else {
          showToast(response.message || 'Failed to delete review', 'error');
        }
      } catch (error) {
        console.error('❌ Failed to delete review:', error);
        showToast(error.message || 'Failed to delete review', 'error');
      }
    }
  };

  // Featured actions
  const handleApproveFeatured = (requestId) => {
    const request = featuredRequests.find(r => r.id === requestId);
    if (request) {
      setFeaturedRequests(featuredRequests.filter(r => r.id !== requestId));
      
      const newFeatured = {
        id: Math.max(...activeFeatured.map(f => f.id), 0) + 1,
        workerName: request.workerName,
        category: request.category,
        plan: request.plan,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (request.plan === 'Weekly' ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: activeFeatured.length + 1,
      };
      setActiveFeatured([...activeFeatured, newFeatured]);
      
      showToast('Featured request approved successfully', 'success');
    }
  };

  const handleRejectFeatured = (requestId) => {
    if (window.confirm('Are you sure you want to reject this featured request?')) {
      setFeaturedRequests(featuredRequests.filter(r => r.id !== requestId));
      showToast('Featured request rejected', 'warning');
    }
  };

  const movePriority = (id, direction) => {
    const index = activeFeatured.findIndex(f => f.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === activeFeatured.length - 1)
    ) {
      return;
    }

    const newFeatured = [...activeFeatured];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newFeatured[index], newFeatured[swapIndex]] = [newFeatured[swapIndex], newFeatured[index]];
    
    newFeatured.forEach((item, idx) => {
      item.priority = idx + 1;
    });
    
    setActiveFeatured(newFeatured);
    showToast('Priority updated successfully', 'success');
  };

  const removeFeatured = (id) => {
    if (window.confirm('Are you sure you want to remove this featured listing?')) {
      setActiveFeatured(activeFeatured.filter(f => f.id !== id).map((item, idx) => ({
        ...item,
        priority: idx + 1
      })));
      showToast('Featured listing removed', 'success');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Featured & Reviews Management</h1>
        <p className="text-gray-600 text-sm">Manage reviews, featured listings and ranking priority</p>
      </div>

      {/* Stats Cards */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviewStats.total}</p>
              </div>
              <MdRateReview size={32} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{reviewStats.pending}</p>
              </div>
              <MdStar size={32} className="text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{reviewStats.approved}</p>
              </div>
              <MdCheckCircle size={32} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{reviewStats.rejected}</p>
              </div>
              <MdCancel size={32} className="text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-blue-600">{reviewStats.avgRating.toFixed(1)}</p>
              </div>
              <MdStar size={32} className="text-yellow-500" />
            </div>
          </div>
        </div>
      )}

      {/* Ranking Logic Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Ranking Priority Logic</h3>
        <p className="text-sm text-blue-800">Featured &gt; Verified &gt; Free</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Reviews
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{reviewStats.total}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Featured Requests
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">{featuredRequests.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Active Featured
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">{activeFeatured.length}</span>
          </button>
        </div>

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <MdRateReview size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No reviews yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MdPerson size={20} className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{review.workerName}</div>
                            {review.worker?.mobile && (
                              <div className="text-xs text-gray-500">{review.worker.mobile}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <MdWork size={16} className="text-blue-500" />
                          <span className="text-sm text-gray-900">{review.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{review.userName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <MdStar
                              key={i}
                              size={16}
                              className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                          <span className="ml-1 text-sm font-semibold text-gray-900">{review.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={review.comment}>
                          {review.comment || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(review.status)}`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {review.status === 'Pending' && (
                            <>
                              <button 
                                type="button"
                                onClick={() => handleApproveReview(review._id)}
                                className="p-2 hover:bg-green-50 rounded" 
                                title="Approve"
                              >
                                <MdCheckCircle size={20} className="text-green-600" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleRejectReview(review._id)}
                                className="p-2 hover:bg-red-50 rounded" 
                                title="Reject"
                              >
                                <MdCancel size={20} className="text-red-600" />
                              </button>
                            </>
                          )}
                          <button 
                            type="button"
                            onClick={() => handleDeleteReview(review._id)}
                            className="p-2 hover:bg-red-50 rounded" 
                            title="Delete"
                          >
                            <MdRemoveCircle size={20} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Featured Requests Tab */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featuredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.workerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.plan}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">₹{request.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => handleApproveFeatured(request.id)}
                            className="p-2 hover:bg-green-50 rounded" 
                            title="Approve"
                          >
                            <MdCheckCircle size={20} className="text-green-600" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleRejectFeatured(request.id)}
                            className="p-2 hover:bg-red-50 rounded" 
                            title="Reject"
                          >
                            <MdCancel size={20} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Active Featured Tab */}
        {activeTab === 'active' && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {activeFeatured.map((featured, index) => (
                    <tr key={featured.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MdStar size={20} className="text-yellow-500" />
                          <span className="text-sm font-bold text-gray-900">#{featured.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{featured.workerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{featured.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{featured.plan}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{featured.startDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{featured.endDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => movePriority(featured.id, 'up')}
                            disabled={index === 0}
                            className={`p-2 rounded ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                            title="Move Up"
                          >
                            <MdArrowUpward size={18} className="text-blue-600" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => movePriority(featured.id, 'down')}
                            disabled={index === activeFeatured.length - 1}
                            className={`p-2 rounded ${index === activeFeatured.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                            title="Move Down"
                          >
                            <MdArrowDownward size={18} className="text-blue-600" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => removeFeatured(featured.id)}
                            className="p-2 hover:bg-red-50 rounded" 
                            title="Remove Featured"
                          >
                            <MdRemoveCircle size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

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

export default Featured;
