import React, { useState, useEffect } from 'react';
import { Bell, Mail, CheckCircle, XCircle, Send, TestTube } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';

const NotificationCenter = ({ employees }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Auto-check for notifications on component mount
    if (employees.length > 0) {
      checkTodayNotifications();
    }

    // Set up interval to check notifications every hour
    const interval = setInterval(() => {
      if (employees.length > 0) {
        checkTodayNotifications();
      }
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [employees]);

  const checkTodayNotifications = async () => {
    if (!employees.length) {
      toast.info('No employees found to check for notifications');
      return;
    }

    setIsChecking(true);
    try {
      console.log('🔍 Checking notifications for employees:', employees);
      const results = await notificationService.checkAndSendTodayNotifications(employees);
      setNotifications(results);
      
      const successCount = results.filter(r => r.success && !r.skipped).length;
      const skippedCount = results.filter(r => r.skipped).length;
      const errorCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast.success(`🎉 ${successCount} celebration notification(s) sent successfully!`);
      }
      if (skippedCount > 0) {
        toast.info(`ℹ️ ${skippedCount} notification(s) already sent today`);
      }
      if (errorCount > 0) {
        toast.error(`❌ ${errorCount} notification(s) failed to send`);
      }
      if (results.length === 0) {
        toast.info('No celebrations today - all quiet! 😊');
      }

      setStats(notificationService.getNotificationStats());
    } catch (error) {
      console.error('Error checking notifications:', error);
      toast.error(`Error checking notifications: ${error.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const sendTestNotification = async (employee, type) => {
    setIsTesting(true);
    try {
      console.log(`🧪 Sending test ${type} notification to:`, employee);
      const result = await notificationService.sendTestNotification(employee, type);
      
      if (result.success) {
        if (result.results.email?.success) {
          toast.success(`✅ Test ${type} notification sent via email to ${employee.name}!`);
        } else {
          toast.error(`❌ Failed to send test notification to ${employee.name}`);
        }
      } else {
        toast.error(`❌ Failed to send test notification to ${employee.name}`);
      }
    } catch (error) {
      console.error('Test notification error:', error);
      toast.error(`Error sending test notification: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const getTodayCelebrants = () => {
    const today = new Date();
    const celebrants = [];

    employees.forEach(emp => {
      if (emp.birthday) {
        const birthDate = new Date(emp.birthday);
        if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
          celebrants.push({ ...emp, type: 'birthday', age: notificationService.calculateAge(emp.birthday) });
        }
      }

      if (emp.joinDate) {
        const joinDate = new Date(emp.joinDate);
        if (joinDate.getMonth() === today.getMonth() && joinDate.getDate() === today.getDate()) {
          const years = notificationService.calculateYearsOfService(emp.joinDate);
          if (years > 0) {
            celebrants.push({ ...emp, type: 'anniversary', years });
          }
        }
      }
    });

    return celebrants;
  };

  const todayCelebrants = getTodayCelebrants();

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-full transition-all duration-200 ${
          todayCelebrants.length > 0
            ? 'bg-red-100 text-red-600 animate-pulse'
            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
        }`}
        title="Notification Center"
      >
        <Bell size={24} />
        {todayCelebrants.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
            {todayCelebrants.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">🔔 Notification Center</h3>
              <div className="flex gap-2">
                <button
                  onClick={checkTodayNotifications}
                  disabled={isChecking}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors text-sm"
                  title="Check for today's celebrations"
                >
                  {isChecking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Check Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Today's Celebrants */}
          {todayCelebrants.length > 0 ? (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                🎉 Today's Celebrations ({todayCelebrants.length})
              </h4>
              <div className="space-y-2">
                {todayCelebrants.map((celebrant, index) => (
                  <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{celebrant.name}</p>
                      <p className="text-sm text-gray-600">
                        {celebrant.type === 'birthday' 
                          ? `🎂 ${celebrant.age}th Birthday` 
                          : `⭐ ${celebrant.years} Year Anniversary`
                        }
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {celebrant.email && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Mail size={12} />
                            <span>Email</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => sendTestNotification(celebrant, celebrant.type)}
                      disabled={isTesting}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                      title="Send test notification"
                    >
                      <TestTube size={14} />
                      {isTesting ? 'Sending...' : 'Test'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <p className="text-gray-600 text-center">No celebrations today 😊</p>
            </div>
          )}

          {/* Test Section for All Employees */}
          {employees.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">🧪 Test Notifications</h4>
              <div className="space-y-2">
                {employees.slice(0, 3).map((employee, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        {employee.email && (
                          <div className="flex items-center gap-1">
                            <Mail size={10} />
                            <span>{employee.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => sendTestNotification(employee, 'birthday')}
                        disabled={isTesting}
                        className="px-2 py-1 bg-pink-600 text-white rounded text-xs hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
                        title="Test birthday notification"
                      >
                        🎂
                      </button>
                      <button
                        onClick={() => sendTestNotification(employee, 'anniversary')}
                        disabled={isTesting}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        title="Test anniversary notification"
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Notifications */}
          <div className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3">📊 Recent Activity</h4>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notification, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    {notification.success ? (
                      <CheckCircle className="text-green-600 mt-0.5" size={16} />
                    ) : (
                      <XCircle className="text-red-600 mt-0.5" size={16} />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.employee} - {notification.type}
                        {notification.age && ` (${notification.age} years old)`}
                        {notification.years && ` (${notification.years} years)`}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {notification.results?.email?.success && (
                          <div className="flex items-center gap-1 text-xs text-blue-600">
                            <Mail size={10} />
                            <span>Email ✓</span>
                          </div>
                        )}
                      </div>
                      {!notification.success && (
                        <p className="text-xs text-red-600 mt-1">
                          {notification.error || 'Failed to send'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
