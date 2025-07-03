import React, { useState } from 'react';
import { Settings, Mail, Save, CheckCircle, TestTube } from 'lucide-react';
import { toast } from 'react-toastify';
import { notificationService } from '../services/notificationService';

const NotificationSetup = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Test contact information
  const [testContact, setTestContact] = useState({
    email: '',
    name: 'Test User'
  });

  const [testing, setTesting] = useState({
    email: false
  });

  const handleSave = () => {
    toast.success('🎉 Notification settings saved successfully!');
    setIsOpen(false);
  };

  const sendTestEmail = async () => {
    if (!testContact.email) {
      toast.error('Please enter a test email address');
      return;
    }

    setTesting(prev => ({ ...prev, email: true }));
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
      setTesting(prev => ({ ...prev, email: false }));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
      >
        <Settings className='animate-spin' size={20} />
        <span className="hidden sm:inline">Setup Notifications</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">📧 Notification Setup</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mt-2 font-bold"> Test email notifications</p>
            </div>

            <div className="p-6 space-y-6">

              {/* Test Section */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="flex items-center gap-2 font-semibold text-purple-800 mb-4">
                  <TestTube size={20} />
                  Test Email Notifications
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Name
                    </label>
                    <input
                      type="text"
                      value={testContact.name}
                      onChange={(e) => setTestContact(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Test User"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Email
                    </label>
                    <input
                      type="email"
                      value={testContact.email}
                      onChange={(e) => setTestContact(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="test@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={sendTestEmail}
                    disabled={testing.email || !testContact.email}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    {testing.email ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={16} />
                        <span>Test Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSetup;
