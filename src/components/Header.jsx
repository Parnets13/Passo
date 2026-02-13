import { MdMenu, MdNotifications, MdAccountCircle, MdLogout } from 'react-icons/md';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdMenu size={22} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-gray-800">Welcome, Admin</h2>
            <p className="text-[10px] text-gray-500">Manage your platform efficiently</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <MdNotifications size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-1.5 px-2 py-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <MdAccountCircle size={24} className="text-gray-600" />
            <span className="text-xs font-medium text-gray-700">Admin</span>
          </div>
          <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
            <MdLogout size={20} className="text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
