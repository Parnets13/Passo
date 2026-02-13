import { useState } from 'react';
import { MdEdit, MdSave } from 'react-icons/md';

const CMS = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [isEditing, setIsEditing] = useState(false);

  const [content, setContent] = useState({
    terms: 'Terms and Conditions content goes here...\n\n1. Acceptance of Terms\n2. User Responsibilities\n3. Privacy Policy\n4. Limitation of Liability',
    privacy: 'Privacy Policy content goes here...\n\n1. Information Collection\n2. Data Usage\n3. Data Protection\n4. User Rights',
    consent: 'User consent text for data collection and processing...\n\nBy using this app, you agree to our terms and conditions.',
    about: 'About Us content...\n\nWe are a leading platform connecting workers with customers.',
    help: 'Help & Support content...\n\nFAQ:\n1. How to unlock a worker?\n2. How to report an issue?\n3. Payment methods',
  });

  const handleSave = () => {
    setIsEditing(false);
    // API call to save content
    alert('Content saved successfully!');
  };

  const tabs = [
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'consent', label: 'Consent Text' },
    { id: 'about', label: 'About Us' },
    { id: 'help', label: 'Help & Support' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">CMS / Legal</h1>
          <p className="text-gray-600 text-sm">Manage legal content and policies</p>
        </div>
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <MdSave size={20} />
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MdEdit size={20} />
            Edit Content
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditing ? 'Edit the content below and click Save Changes' : 'Click Edit Content to modify'}
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <textarea
              value={content[activeTab]}
              onChange={(e) => setContent({ ...content, [activeTab]: e.target.value })}
              disabled={!isEditing}
              rows="20"
              className={`w-full p-4 font-mono text-sm ${
                isEditing
                  ? 'bg-white border-2 border-blue-300 focus:ring-2 focus:ring-blue-500'
                  : 'bg-gray-50 text-gray-700'
              }`}
            />
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Changes to legal content should be reviewed by legal team before publishing.
              These changes will be reflected in the mobile app immediately after saving.
            </p>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm text-gray-600 mb-2">Last Updated</h4>
          <p className="text-lg font-semibold text-gray-800">2024-02-09</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm text-gray-600 mb-2">Updated By</h4>
          <p className="text-lg font-semibold text-gray-800">Admin</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm text-gray-600 mb-2">Version</h4>
          <p className="text-lg font-semibold text-gray-800">v1.2.0</p>
        </div>
      </div>
    </div>
  );
};

export default CMS;
