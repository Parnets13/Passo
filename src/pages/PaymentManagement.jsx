import { useState, useEffect } from 'react';
import { MdAdd, MdDelete, MdCheckCircle, MdWarning } from 'react-icons/md';
import Toast from '../components/Toast';

const PaymentManagement = () => {
  const [validTransactions, setValidTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const transactions = JSON.parse(localStorage.getItem('validTransactions') || '[]');
    setValidTransactions(transactions);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddTransaction = () => {
    const txn = newTransaction.trim().toUpperCase();
    
    if (!txn) {
      showToast('Please enter a transaction number', 'error');
      return;
    }

    if (txn.length < 12) {
      showToast('Transaction number must be at least 12 characters', 'error');
      return;
    }

    const txnRegex = /^[A-Z0-9]{12,}$/;
    if (!txnRegex.test(txn)) {
      showToast('Invalid format. Use only letters and numbers', 'error');
      return;
    }

    const exists = validTransactions.some(t => t.transactionNumber === txn);
    if (exists) {
      showToast('This transaction number already exists', 'error');
      return;
    }

    const newTxn = {
      transactionNumber: txn,
      amount: 1,
      status: 'success',
      addedAt: new Date().toISOString()
    };

    const updated = [...validTransactions, newTxn];
    setValidTransactions(updated);
    localStorage.setItem('validTransactions', JSON.stringify(updated));
    setNewTransaction('');
    showToast('Transaction number added successfully', 'success');
  };

  const handleDeleteTransaction = (txnNumber) => {
    if (window.confirm('Are you sure you want to delete this transaction number?')) {
      const updated = validTransactions.filter(t => t.transactionNumber !== txnNumber);
      setValidTransactions(updated);
      localStorage.setItem('validTransactions', JSON.stringify(updated));
      showToast('Transaction number deleted', 'success');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all valid transaction numbers? This cannot be undone.')) {
      setValidTransactions([]);
      localStorage.setItem('validTransactions', JSON.stringify([]));
      showToast('All transaction numbers cleared', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Payment Management</h1>
          <p className="text-gray-600 text-sm">Manage valid transaction numbers for worker registration</p>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start gap-3">
          <MdWarning className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800 mb-1">Important Notice</h3>
            <p className="text-sm text-yellow-700">
              This is a temporary solution for testing. In production, integrate with a real payment gateway API 
              (Razorpay, Paytm, PhonePe) to automatically verify transactions. Only add transaction numbers 
              that you have confirmed as successful payments.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Transaction */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Valid Transaction Number</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTransaction}
            onChange={(e) => setNewTransaction(e.target.value.toUpperCase())}
            placeholder="Enter transaction number (min 12 characters)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            maxLength="20"
          />
          <button
            onClick={handleAddTransaction}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MdAdd size={20} />
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Only alphanumeric characters allowed. Transaction numbers must be unique.
        </p>
      </div>

      {/* Valid Transactions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Valid Transaction Numbers</h2>
            <p className="text-sm text-gray-600">Total: {validTransactions.length}</p>
          </div>
          {validTransactions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          {validTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <MdCheckCircle size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No valid transaction numbers added yet</p>
              <p className="text-sm text-gray-400 mt-1">Add transaction numbers above to allow worker registrations</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {validTransactions.map((txn, index) => (
                  <tr key={txn.transactionNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {txn.transactionNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">₹{txn.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(txn.addedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteTransaction(txn.transactionNumber)}
                        className="p-2 hover:bg-red-50 rounded text-red-600"
                        title="Delete"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">How to Use</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>When a worker makes a payment, note their transaction number</li>
          <li>Add the transaction number to this list</li>
          <li>The worker can now verify their payment during registration</li>
          <li>Each transaction number can only be used once</li>
          <li>After verification, the transaction is moved to payment records</li>
        </ol>
      </div>

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

export default PaymentManagement;
