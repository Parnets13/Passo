import { NavLink, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdPeople, 
  MdWork, 
  MdCategory, 
  MdAttachMoney, 
  MdStar,
  MdPayment,
  MdReport,
  MdBarChart,
  MdNotifications,
  MdDescription,
  MdLogout
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Sidebar = ({ isOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { path: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard', color: '#3B82F6' },
    { path: '/admin/users', icon: MdPeople, label: 'Users Management', color: '#10B981' },
    { path: '/admin/workers', icon: MdWork, label: 'Workers Management', color: '#F59E0B' },
    { path: '/admin/categories', icon: MdCategory, label: 'Categories', color: '#8B5CF6' },
    { path: '/admin/pricing', icon: MdAttachMoney, label: 'Pricing & Plans', color: '#EF4444' },
    { path: '/admin/featured', icon: MdStar, label: 'Featured & Ranking', color: '#F59E0B' },
    { path: '/admin/payments', icon: MdPayment, label: 'Payments & Revenue', color: '#10B981' },
    { path: '/admin/payment-management', icon: MdPayment, label: 'Payment Management', color: '#059669' },
    { path: '/admin/complaints', icon: MdReport, label: 'Complaints & Reports', color: '#EF4444' },
    { path: '/admin/analytics', icon: MdBarChart, label: 'Analytics', color: '#3B82F6' },
    { path: '/admin/notifications', icon: MdNotifications, label: 'Notifications', color: '#8B5CF6' },
    { path: '/admin/cms', icon: MdDescription, label: 'CMS / Legal', color: '#6B7280' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setIsLoggingOut(true);
      setTimeout(() => {
        logout();
        navigate('/admin/login');
      }, 500);
    }
  };

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-56' : 'w-0'} overflow-hidden flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/src/assets/logo.jpeg" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
          <div>
            <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
            <p className="text-[10px] text-gray-500">Worker Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2.5 transition-colors ${
                isActive
                  ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={18} style={{ color: item.color }} />
            <span className="font-medium text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.email || 'admin@admin.com'}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
            isLoggingOut
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          <MdLogout size={16} />
          <span className="font-medium text-xs">
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
