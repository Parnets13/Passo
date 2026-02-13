import { useState, useEffect } from 'react';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { 
  FaWrench, FaPlug, FaPaintRoller, FaHammer, FaTools, FaBroom, 
  FaTshirt, FaCar, FaLeaf, FaSnowflake, FaFire, FaWater, 
  FaLaptop, FaMobileAlt, FaTv, FaCamera, FaPrint, FaWifi,
  FaCouch, FaBed, FaChair, FaDoorOpen, FaWindowMaximize, FaLightbulb,
  FaShower, FaToilet, FaSink, FaBath, FaSprayCan,
  FaCut, FaSpa, FaUserMd, FaStethoscope, FaHeartbeat,
  FaDumbbell, FaRunning, FaSwimmer, FaBicycle, FaFootballBall, FaBasketballBall,
  FaPizzaSlice, FaUtensils, FaCoffee, FaBirthdayCake, FaIceCream, FaHamburger,
  FaTruck, FaShippingFast, FaBox, FaWarehouse, FaPallet, FaDolly,
  FaTree, FaSeedling, FaBug, FaRecycle, FaTrash, FaIndustry,
  FaGuitar, FaMusic, FaDrum, FaMicrophone, FaHeadphones, FaCompactDisc,
  FaBook, FaGraduationCap, FaPencilAlt, FaChalkboardTeacher, FaUserGraduate, FaCalculator,
  FaDog, FaCat, FaPaw, FaHorse, FaFish, FaKiwiBird,
  FaHome, FaBuilding, FaCity, FaStore, FaHospital,
  FaLock, FaKey, FaShieldAlt, FaVideo, FaBell, FaExclamationTriangle
} from 'react-icons/fa';
import Toast from '../components/Toast';
import { categoryAPI } from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    active: true,
    workerTypes: [],
    icon: 'FaWrench'
  });
  const [toast, setToast] = useState(null);

  const workerTypeOptions = ['Worker', 'Crew / Team', 'Contractor', 'Service Provider'];

  // Comprehensive icon options organized by category
  const iconOptions = [
    { category: 'General Services', icons: [
      { name: 'FaWrench', icon: FaWrench, label: 'Wrench' },
      { name: 'FaTools', icon: FaTools, label: 'Tools' },
      { name: 'FaHammer', icon: FaHammer, label: 'Hammer' },
      { name: 'FaBroom', icon: FaBroom, label: 'Cleaning' },
      { name: 'FaSprayCan', icon: FaSprayCan, label: 'Spray' },
    ]},
    { category: 'Electrical & Electronics', icons: [
      { name: 'FaPlug', icon: FaPlug, label: 'Electrical' },
      { name: 'FaLightbulb', icon: FaLightbulb, label: 'Lighting' },
      { name: 'FaLaptop', icon: FaLaptop, label: 'Computer' },
      { name: 'FaMobileAlt', icon: FaMobileAlt, label: 'Mobile' },
      { name: 'FaTv', icon: FaTv, label: 'TV' },
      { name: 'FaCamera', icon: FaCamera, label: 'Camera' },
      { name: 'FaPrint', icon: FaPrint, label: 'Printer' },
      { name: 'FaWifi', icon: FaWifi, label: 'WiFi' },
    ]},
    { category: 'Home & Interior', icons: [
      { name: 'FaPaintRoller', icon: FaPaintRoller, label: 'Painting' },
      { name: 'FaCouch', icon: FaCouch, label: 'Furniture' },
      { name: 'FaBed', icon: FaBed, label: 'Bed' },
      { name: 'FaChair', icon: FaChair, label: 'Chair' },
      { name: 'FaDoorOpen', icon: FaDoorOpen, label: 'Door' },
      { name: 'FaWindowMaximize', icon: FaWindowMaximize, label: 'Window' },
      { name: 'FaHome', icon: FaHome, label: 'Home' },
    ]},
    { category: 'Plumbing & Bathroom', icons: [
      { name: 'FaWater', icon: FaWater, label: 'Water' },
      { name: 'FaShower', icon: FaShower, label: 'Shower' },
      { name: 'FaToilet', icon: FaToilet, label: 'Toilet' },
      { name: 'FaSink', icon: FaSink, label: 'Sink' },
      { name: 'FaBath', icon: FaBath, label: 'Bath' },
      { name: 'FaSprayCan', icon: FaSprayCan, label: 'Cleaning' },
    ]},
    { category: 'HVAC & Climate', icons: [
      { name: 'FaSnowflake', icon: FaSnowflake, label: 'AC/Cooling' },
      { name: 'FaFire', icon: FaFire, label: 'Heating' },
    ]},
    { category: 'Automotive', icons: [
      { name: 'FaCar', icon: FaCar, label: 'Car' },
      { name: 'FaTruck', icon: FaTruck, label: 'Truck' },
      { name: 'FaBicycle', icon: FaBicycle, label: 'Bicycle' },
    ]},
    { category: 'Beauty & Wellness', icons: [
      { name: 'FaCut', icon: FaCut, label: 'Haircut' },
      { name: 'FaSpa', icon: FaSpa, label: 'Spa' },
      { name: 'FaUserMd', icon: FaUserMd, label: 'Medical' },
      { name: 'FaStethoscope', icon: FaStethoscope, label: 'Health' },
      { name: 'FaHeartbeat', icon: FaHeartbeat, label: 'Heartbeat' },
    ]},
    { category: 'Fitness & Sports', icons: [
      { name: 'FaDumbbell', icon: FaDumbbell, label: 'Gym' },
      { name: 'FaRunning', icon: FaRunning, label: 'Running' },
      { name: 'FaSwimmer', icon: FaSwimmer, label: 'Swimming' },
      { name: 'FaFootballBall', icon: FaFootballBall, label: 'Football' },
      { name: 'FaBasketballBall', icon: FaBasketballBall, label: 'Basketball' },
    ]},
    { category: 'Food & Catering', icons: [
      { name: 'FaPizzaSlice', icon: FaPizzaSlice, label: 'Pizza' },
      { name: 'FaUtensils', icon: FaUtensils, label: 'Dining' },
      { name: 'FaCoffee', icon: FaCoffee, label: 'Coffee' },
      { name: 'FaBirthdayCake', icon: FaBirthdayCake, label: 'Cake' },
      { name: 'FaIceCream', icon: FaIceCream, label: 'Ice Cream' },
      { name: 'FaHamburger', icon: FaHamburger, label: 'Fast Food' },
    ]},
    { category: 'Logistics & Moving', icons: [
      { name: 'FaShippingFast', icon: FaShippingFast, label: 'Delivery' },
      { name: 'FaBox', icon: FaBox, label: 'Package' },
      { name: 'FaWarehouse', icon: FaWarehouse, label: 'Warehouse' },
      { name: 'FaPallet', icon: FaPallet, label: 'Pallet' },
      { name: 'FaDolly', icon: FaDolly, label: 'Moving' },
    ]},
    { category: 'Gardening & Outdoor', icons: [
      { name: 'FaLeaf', icon: FaLeaf, label: 'Gardening' },
      { name: 'FaTree', icon: FaTree, label: 'Tree' },
      { name: 'FaSeedling', icon: FaSeedling, label: 'Plant' },
      { name: 'FaBug', icon: FaBug, label: 'Pest Control' },
      { name: 'FaRecycle', icon: FaRecycle, label: 'Recycling' },
      { name: 'FaTrash', icon: FaTrash, label: 'Waste' },
    ]},
    { category: 'Music & Entertainment', icons: [
      { name: 'FaGuitar', icon: FaGuitar, label: 'Guitar' },
      { name: 'FaMusic', icon: FaMusic, label: 'Music' },
      { name: 'FaDrum', icon: FaDrum, label: 'Drums' },
      { name: 'FaMicrophone', icon: FaMicrophone, label: 'Microphone' },
      { name: 'FaHeadphones', icon: FaHeadphones, label: 'Audio' },
      { name: 'FaCompactDisc', icon: FaCompactDisc, label: 'DJ' },
    ]},
    { category: 'Education & Training', icons: [
      { name: 'FaBook', icon: FaBook, label: 'Book' },
      { name: 'FaGraduationCap', icon: FaGraduationCap, label: 'Education' },
      { name: 'FaPencilAlt', icon: FaPencilAlt, label: 'Writing' },
      { name: 'FaChalkboardTeacher', icon: FaChalkboardTeacher, label: 'Teaching' },
      { name: 'FaUserGraduate', icon: FaUserGraduate, label: 'Student' },
      { name: 'FaCalculator', icon: FaCalculator, label: 'Math' },
    ]},
    { category: 'Pet Services', icons: [
      { name: 'FaDog', icon: FaDog, label: 'Dog' },
      { name: 'FaCat', icon: FaCat, label: 'Cat' },
      { name: 'FaPaw', icon: FaPaw, label: 'Pet' },
      { name: 'FaHorse', icon: FaHorse, label: 'Horse' },
      { name: 'FaFish', icon: FaFish, label: 'Fish' },
      { name: 'FaKiwiBird', icon: FaKiwiBird, label: 'Bird' },
    ]},
    { category: 'Buildings & Property', icons: [
      { name: 'FaBuilding', icon: FaBuilding, label: 'Building' },
      { name: 'FaCity', icon: FaCity, label: 'City' },
      { name: 'FaStore', icon: FaStore, label: 'Store' },
      { name: 'FaHospital', icon: FaHospital, label: 'Hospital' },
      { name: 'FaIndustry', icon: FaIndustry, label: 'Industry' },
    ]},
    { category: 'Security & Safety', icons: [
      { name: 'FaLock', icon: FaLock, label: 'Lock' },
      { name: 'FaKey', icon: FaKey, label: 'Key' },
      { name: 'FaShieldAlt', icon: FaShieldAlt, label: 'Security' },
      { name: 'FaVideo', icon: FaVideo, label: 'CCTV' },
      { name: 'FaBell', icon: FaBell, label: 'Alarm' },
      { name: 'FaExclamationTriangle', icon: FaExclamationTriangle, label: 'Warning' },
    ]},
    { category: 'Laundry & Clothing', icons: [
      { name: 'FaTshirt', icon: FaTshirt, label: 'Laundry' },
    ]},
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading categories...');
      const response = await categoryAPI.getAll();
      console.log('✅ Categories response:', response);
      if (response && response.success) {
        setCategories(response.data || []);
      } else {
        console.warn('⚠️ No success in response');
        setCategories([]);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      showToast(error.message || 'Failed to load categories', 'error');
      setCategories([]);
    } finally {
      console.log('✅ Loading complete, setting loading to false');
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ 
      name: '', 
      active: true,
      workerTypes: [],
      icon: 'FaWrench'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ 
      name: category.name, 
      active: category.active,
      workerTypes: category.workerTypes || [],
      icon: category.icon || 'FaWrench'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        showToast('Category deleted successfully', 'success');
        loadCategories();
      } catch (error) {
        showToast(error.message || 'Failed to delete category', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (formData.workerTypes.length === 0) {
      showToast('Please select at least one worker type', 'error');
      return;
    }

    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
        showToast('Category updated successfully', 'success');
      } else {
        await categoryAPI.create(formData);
        showToast('Category added successfully', 'success');
      }
      
      setIsModalOpen(false);
      setFormData({ 
        name: '', 
        active: true,
        workerTypes: [],
        icon: 'FaWrench'
      });
      loadCategories();
    } catch (error) {
      showToast(error.message || 'Operation failed', 'error');
    }
  };

  const toggleStatus = async (category) => {
    try {
      await categoryAPI.update(category._id, { ...category, active: !category.active });
      showToast('Status updated successfully', 'success');
      loadCategories();
    } catch (error) {
      showToast(error.message || 'Failed to update status', 'error');
    }
  };

  const handleWorkerTypeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, workerTypes: selectedOptions });
  };

  // Helper function to get icon component by name
  const getIconComponent = (iconName) => {
    const allIcons = iconOptions.flatMap(group => group.icons);
    const iconData = allIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.icon : FaWrench;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  console.log('🎨 Rendering Categories page, categories count:', categories.length);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
          <p className="text-gray-600 text-sm">Manage service categories and unlock pricing</p>
        </div>
        <button 
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <MdAdd size={20} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker Types</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No categories found. Click "Add Category" to create one.
                </td>
              </tr>
            ) : (
              categories.map((category) => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <IconComponent className="text-blue-600 text-xl" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-wrap gap-1">
                        {category.workerTypes?.map(type => (
                          <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(category)}
                        className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                          category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {category.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="p-2 hover:bg-blue-50 rounded" 
                          title="Edit"
                        >
                          <MdEdit size={18} className="text-blue-600" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDelete(category._id)}
                          className="p-2 hover:bg-red-50 rounded" 
                          title="Delete"
                        >
                          <MdDelete size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal - Custom Implementation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full z-[10000]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <span className="text-2xl text-gray-500">×</span>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Electrician, Plumber, AC Repair"
                      required
                    />
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Icon <span className="text-red-500">*</span>
                    </label>
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                        {(() => {
                          const SelectedIcon = getIconComponent(formData.icon);
                          return <SelectedIcon className="text-blue-600 text-2xl" />;
                        })()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Selected Icon</p>
                        <p className="text-xs text-blue-700">{formData.icon}</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
                      {iconOptions.map((group) => (
                        <div key={group.category} className="mb-4 last:mb-0">
                          <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2 sticky top-0 bg-gray-50 py-1">
                            {group.category}
                          </h4>
                          <div className="grid grid-cols-6 gap-2">
                            {group.icons.map((iconData) => {
                              const IconComp = iconData.icon;
                              const isSelected = formData.icon === iconData.name;
                              return (
                                <button
                                  key={iconData.name}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, icon: iconData.name })}
                                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                    isSelected 
                                      ? 'border-blue-500 bg-blue-100 shadow-md' 
                                      : 'border-gray-200 bg-white hover:border-blue-300'
                                  }`}
                                  title={iconData.label}
                                >
                                  <IconComp className={`text-2xl mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                                  <span className={`text-[9px] text-center leading-tight ${isSelected ? 'text-blue-800 font-semibold' : 'text-gray-500'}`}>
                                    {iconData.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available For Worker Types <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Select All Checkbox */}
                    <div className="mb-3 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="selectAllWorkerTypes"
                        checked={formData.workerTypes.length === workerTypeOptions.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Select all
                            setFormData({ ...formData, workerTypes: [...workerTypeOptions] });
                          } else {
                            // Deselect all
                            setFormData({ ...formData, workerTypes: [] });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="selectAllWorkerTypes" className="text-sm font-semibold text-blue-800 cursor-pointer">
                        Select All Worker Types
                      </label>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-2">
                      Select which worker types can register for this category (hold Ctrl/Cmd to select multiple)
                    </p>
                    <select
                      multiple
                      value={formData.workerTypes}
                      onChange={handleWorkerTypeChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 overflow-y-auto"
                      required
                    >
                      {workerTypeOptions.map((type) => (
                        <option key={type} value={type} className="py-2">
                          {type}
                        </option>
                      ))}
                    </select>
                    {formData.workerTypes.length > 0 && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                        Selected ({formData.workerTypes.length}): {formData.workerTypes.join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-700">
                      Active (visible to users)
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4 border-t mt-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      {editingCategory ? 'Update Category' : 'Add Category'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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

export default Categories;
