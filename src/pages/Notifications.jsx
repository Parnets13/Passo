import { useState } from 'react';
import { MdSend, MdImage, MdLocationOn, MdCategory, MdPeople } from 'react-icons/md';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('push');

  const sentNotifications = [
    { id: 1, title: 'New Workers Available', message: 'Check out verified electricians in your area', target: 'City: Mumbai', date: '2024-02-09 14:30', sent: 1245 },
    { id: 2, title: 'Special Offer', message: 'Get 5 free unlocks on first purchase', target: 'All Users', date: '2024-02-08 10:00', sent: 5678 },
    { id: 3, title: 'Category Update', message: 'New painters added in your city', target: 'Category: Painter', date: '2024-02-07 16:45', sent: 892 },
  ];

  const banners = [
    { id: 1, title: 'Welcome Banner', image: 'banner1.jpg', active: true, position: 'Home Top' },
    { id: 2, title: 'Featured Workers', image: 'banner2.jpg', active: true, position: 'Search Page' },
    { id: 3, title: 'Subscription Offer', image: 'banner3.jpg', active: false, position: 'Profile Page' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Notifications & Content</h1>
        <p className="text-gray-600 text-sm">Send push notifications and manage banners</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('push')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'push'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Push Notifications
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'banners'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Banners & Announcements
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Notification History
          </button>
        </div>

        {/* Push Notifications Tab */}
        {activeTab === 'push' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Send Notification Form */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Send Push Notification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>All Users</option>
                      <option>City Based</option>
                      <option>Category Based</option>
                      <option>Custom Segment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City (if city-based)</label>
                    <div className="relative">
                      <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Select city..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category (if category-based)</label>
                    <div className="relative">
                      <MdCategory className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Select category..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification Title</label>
                    <input
                      type="text"
                      placeholder="Enter title..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      placeholder="Enter notification message..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <MdSend size={20} />
                    Send Notification
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Send Templates</h3>
                  <div className="space-y-3">
                    <button className="w-full p-4 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <MdLocationOn size={24} className="text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-800">City Alert</p>
                          <p className="text-sm text-gray-600">Send to specific city users</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full p-4 text-left border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <MdCategory size={24} className="text-green-600" />
                        <div>
                          <p className="font-medium text-gray-800">Category Update</p>
                          <p className="text-sm text-gray-600">Notify about category changes</p>
                        </div>
                      </div>
                    </button>

                    <button className="w-full p-4 text-left border rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <MdPeople size={24} className="text-purple-600" />
                        <div>
                          <p className="font-medium text-gray-800">Promotional</p>
                          <p className="text-sm text-gray-600">Send offers to all users</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2">Notification Stats</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>Total Sent Today: <span className="font-bold">1,245</span></p>
                    <p>This Week: <span className="font-bold">8,932</span></p>
                    <p>This Month: <span className="font-bold">34,567</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="p-6">
            <div className="mb-6">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <MdImage size={20} />
                Upload New Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-200 flex items-center justify-center">
                    <MdImage size={48} className="text-gray-400" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800">{banner.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">Position: {banner.position}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex gap-2">
                        <button className="text-sm text-blue-600 hover:underline">Edit</button>
                        <button className="text-sm text-red-600 hover:underline">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sentNotifications.map((notif) => (
                    <tr key={notif.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{notif.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{notif.message}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{notif.target}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600">{notif.sent} users</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{notif.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
