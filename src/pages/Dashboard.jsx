import { MdPeople, MdWork, MdLock, MdTrendingUp, MdWarning } from 'react-icons/md';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Sample data
  const stats = [
    { label: 'Total Users', value: '12,458', icon: MdPeople, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Workers', value: '3,247', icon: MdWork, color: 'bg-green-500', change: '+8%' },
    { label: "Today's Unlocks", value: '342', icon: MdLock, color: 'bg-purple-500', change: '+23%' },
    { label: "Today's Revenue", value: '₹45,230', icon: MdTrendingUp, color: 'bg-orange-500', change: '+15%' },
    { label: 'Monthly Revenue', value: '₹12.5L', icon: MdTrendingUp, color: 'bg-red-500', change: '+18%' },
    { label: 'Pending KYC', value: '28', icon: MdWarning, color: 'bg-yellow-500', change: '-5%' },
  ];

  const dailyUnlocks = [
    { day: 'Mon', unlocks: 245 },
    { day: 'Tue', unlocks: 312 },
    { day: 'Wed', unlocks: 289 },
    { day: 'Thu', unlocks: 356 },
    { day: 'Fri', unlocks: 423 },
    { day: 'Sat', unlocks: 398 },
    { day: 'Sun', unlocks: 342 },
  ];

  const revenueByType = [
    { name: 'Unlocks', value: 45, color: '#3B82F6' },
    { name: 'Onboarding', value: 25, color: '#10B981' },
    { name: 'Featured', value: 20, color: '#F59E0B' },
    { name: 'Subscription', value: 10, color: '#8B5CF6' },
  ];

  const topCategories = [
    { category: 'Helper', unlocks: 1245 },
    { category: 'Painter', unlocks: 987 },
    { category: 'Electrician', unlocks: 856 },
    { category: 'Plumber', unlocks: 743 },
    { category: 'Carpenter', unlocks: 621 },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 text-sm">Quick business overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                <span className="text-green-500 text-xs font-medium mt-2 inline-block">{stat.change}</span>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon size={28} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Daily Unlocks Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Daily Unlocks</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyUnlocks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="unlocks" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Type */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Revenue by Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">Top Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="unlocks" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
