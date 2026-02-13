import { MdDownload, MdTrendingUp, MdLocationOn, MdCategory } from 'react-icons/md';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const unlocksByCategory = [
    { category: 'Helper', unlocks: 1245 },
    { category: 'Painter', unlocks: 987 },
    { category: 'Electrician', unlocks: 856 },
    { category: 'Plumber', unlocks: 743 },
    { category: 'Carpenter', unlocks: 621 },
    { category: 'Mason', unlocks: 534 },
  ];

  const workersByCity = [
    { city: 'Mumbai', workers: 456, active: 342 },
    { city: 'Delhi', workers: 398, active: 289 },
    { city: 'Bangalore', workers: 367, active: 278 },
    { city: 'Pune', workers: 289, active: 201 },
    { city: 'Hyderabad', workers: 234, active: 167 },
  ];

  const conversionData = [
    { month: 'Jan', views: 12450, unlocks: 3245 },
    { month: 'Feb', views: 13890, unlocks: 3678 },
    { month: 'Mar', views: 15230, unlocks: 4123 },
    { month: 'Apr', views: 14560, unlocks: 3890 },
    { month: 'May', views: 16780, unlocks: 4567 },
    { month: 'Jun', views: 18920, unlocks: 5234 },
  ];

  const revenueStreams = [
    { name: 'Unlocks', value: 45, color: '#3B82F6' },
    { name: 'Onboarding', value: 25, color: '#10B981' },
    { name: 'Featured', value: 20, color: '#F59E0B' },
    { name: 'Subscription', value: 10, color: '#8B5CF6' },
  ];

  const topPerformers = [
    { name: 'Rajesh Kumar', category: 'Electrician', unlocks: 234, rating: 4.8 },
    { name: 'Suresh Painting', category: 'Painter', unlocks: 198, rating: 4.9 },
    { name: 'Quick Fix Services', category: 'Plumber', unlocks: 187, rating: 4.7 },
    { name: 'Pro Carpenters', category: 'Carpenter', unlocks: 156, rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
          <p className="text-gray-600 text-sm">Detailed analytics and insights</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <MdDownload size={20} />
          Export Analytics
        </button>
      </div>

      {/* Unlocks per Category */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <MdCategory size={24} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Unlocks per Category</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={unlocksByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="unlocks" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Active Workers by City */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <MdLocationOn size={24} className="text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Active Workers by City</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workersByCity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="workers" fill="#8B5CF6" name="Total Workers" />
            <Bar dataKey="active" fill="#10B981" name="Active Workers" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rate */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <MdTrendingUp size={24} className="text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Conversion Rate (View → Unlock)</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} name="Profile Views" />
            <Line type="monotone" dataKey="unlocks" stroke="#10B981" strokeWidth={2} name="Unlocks" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Stream */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Stream</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueStreams}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueStreams.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Workers</h3>
          <div className="space-y-4">
            {topPerformers.map((worker, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{worker.name}</p>
                  <p className="text-sm text-gray-600">{worker.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">{worker.unlocks} unlocks</p>
                  <p className="text-sm text-yellow-600">⭐ {worker.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
