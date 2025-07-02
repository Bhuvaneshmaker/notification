import React, { useState } from 'react';
import { Settings, Mail, TestTube, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { notificationService } from '../services/notificationService';

const EmailNotificationSetup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testContact, setTestContact] = useState({
    email: '',
    name: 'Test User'
  });
  const [testing, setTesting] = useState(false);

  const sendTestEmail = async () => {
    if (!testContact.email) {
      toast.error('Please enter a test email address');
      return;
    }

    setTesting(true);
    try {
      const testEmployee = {
        id: 'test',
        name: testContact.name,
        email: testContact.email,
        department: 'Test Department'
      };

      const result = await notificationService.sendTestNotification(testEmployee, 'birthday');

      if (result.success && result.results.email?.success) {
        toast.success('✅ Test email sent successfully! Check your inbox.');
      } else {
        const error = result.results.email?.error || 'Unknown error';
        toast.error(`❌ Test email failed: ${error}`);
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast.error(`❌ Test email failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
      >
        <Settings size={20} />
        <span className="hidden sm:inline">Email Notification Test</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Mail size={20} /> Test Email Notification
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Input Fields */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={testContact.name}
                  onChange={(e) => setTestContact({ ...testContact, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Test User"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={testContact.email}
                  onChange={(e) => setTestContact({ ...testContact, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="test@example.com"
                />
              </div>
            </div>

            {/* Test Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={sendTestEmail}
                disabled={testing || !testContact.email}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {testing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <TestTube size={16} />
                    <span>Send Test Email</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default EmailNotificationSetup;
