import emailjs from 'emailjs-com';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  birthdayTemplateId: import.meta.env.VITE_EMAILJS_BIRTHDAY_TEMPLATE_ID,
  anniversaryTemplateId: import.meta.env.VITE_EMAILJS_ANNIVERSARY_TEMPLATE_ID,
  userId: import.meta.env.VITE_EMAILJS_USER_ID,
};

class NotificationService {
  constructor() {
    this.initializeEmailJS();
    this.notificationHistory = this.loadNotificationHistory();
  }

  // Initialize EmailJS
  initializeEmailJS() {
    try {
      emailjs.init(EMAILJS_CONFIG.userId);
      console.log('✅ EmailJS initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize EmailJS:', error);
    }
  }

  // Load notification history from localStorage
  loadNotificationHistory() {
    try {
      const history = localStorage.getItem('notificationHistory');
      return history ? JSON.parse(history) : {};
    } catch (error) {
      console.error('Error loading notification history:', error);
      return {};
    }
  }

  // Save notification history to localStorage
  saveNotificationHistory() {
    try {
      localStorage.setItem('notificationHistory', JSON.stringify(this.notificationHistory));
    } catch (error) {
      console.error('Error saving notification history:', error);
    }
  }

  // Check if notification was already sent today
  wasNotificationSentToday(employeeId, type) {
    const today = new Date().toDateString();
    const key = `${employeeId}_${type}_${today}`;
    return this.notificationHistory[key]?.sent || false;
  }

  // Mark notification as sent
  markNotificationSent(employeeId, type, success = true) {
    const today = new Date().toDateString();
    const key = `${employeeId}_${type}_${today}`;
    this.notificationHistory[key] = {
      sent: success,
      timestamp: new Date().toISOString(),
      attempts: (this.notificationHistory[key]?.attempts || 0) + 1
    };
    this.saveNotificationHistory();
  }

  // Generate birthday message
  generateBirthdayMessage(employee, age) {
const messages = [
      `   On behalf of everyone at Rennova Solutions, we wish you a very 🎁 Happy Birthday ${employee.name}🎊!.. 🎂 May your day be filled with joy, laughter, and memorable moments. 
      Thank you ${employee.name} for your dedication and hard work—you’re an invaluable part of our team.
     🎊 Wishing you success and happiness in the year ahead 🎉!. Have a fantastic day of your ${age}th year!, ${employee.name} 🎈`
    ];
    return messages;
  }

  // Generate anniversary message
  generateAnniversaryMessage(employee, years) {
const messages = [
      `   On behalf of everyone at Rennova Solutions, we wish you a very 🎉 Happy Work Anniversary, ${employee.name}! 🥳 
      🏅Thank you for your ${years} years dedication, hard work, and the value you bring to our team. Your contributions have played a vital role in our success from ${years} years🎯 . 
      🎊 Wishing you continued growth,success, and happiness in the years ahead. Have a fantastic work anniversary, ${employee.name}! 🏆`
    ];
    return messages;
  }

  // Send email notification using EmailJS
  async sendEmailNotification(employee, message, type) {
    if (!employee.email) {
      throw new Error('Employee email not provided');
    }

    try {
      const templateId = type === 'birthday' ? EMAILJS_CONFIG.birthdayTemplateId : EMAILJS_CONFIG.anniversaryTemplateId;
      const subject = type === 'birthday' ? '🎉 Happy Birthday!' : '🎊 Happy Work Anniversary!';
      
      const templateParams = {
        to_name: employee.name,
        to_email: employee.email,
        from_name: 'Rennova Solution',
        subject: subject,
        message: message,
        employee_name: employee.name,
        department: employee.department || 'Team Member',
        celebration_type: type === 'birthday' ? 'Birthday' : 'Work Anniversary',
        company_name: 'Rennova Solution',
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        reply_to: 'noreply@rennovasolution.com'
      };

      console.log('📧 Sending email notification:', {
        service: EMAILJS_CONFIG.serviceId,
        template: templateId,
        to: employee.email,
        employee: employee.name
      });

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        templateId,
        templateParams,
        EMAILJS_CONFIG.userId
      );

      console.log('✅ Email sent successfully:', response);
      return { success: true, response, method: 'email' };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error(`Email failed: ${error.text || error.message}`);
    }
  }

  // Send birthday notification (email only)
  async sendBirthdayNotification(employee, age) {
    console.log(`🎂 Processing birthday notification for ${employee.name} (Age: ${age})`);
    
    if (this.wasNotificationSentToday(employee.id, 'birthday')) {
      console.log(`🔄 Birthday notification already sent today for ${employee.name}`);
      return { success: true, message: 'Already sent today', skipped: true };
    }

    const emailMessage = this.generateBirthdayMessage(employee, age);
    const results = { email: null };
    let overallSuccess = false;

    try {
      // Send email notification
      if (employee.email) {
        try {
          console.log(`📧 Sending birthday email to ${employee.name}...`);
          results.email = await this.sendEmailNotification(employee, emailMessage, 'birthday');
          overallSuccess = true;
          console.log(`✅ Birthday email sent to ${employee.name}`);
        } catch (error) {
          console.error(`❌ Birthday email failed for ${employee.name}:`, error);
          results.email = { success: false, error: error.message, method: 'email' };
        }
      } else {
        console.log(`⚠️ No email address for ${employee.name}`);
      }

      this.markNotificationSent(employee.id, 'birthday', overallSuccess);

      return { 
        success: overallSuccess, 
        results, 
        message: emailMessage,
        employee: employee.name,
        type: 'birthday',
        age
      };
    } catch (error) {
      console.error(`❌ Birthday notification process failed for ${employee.name}:`, error);
      this.markNotificationSent(employee.id, 'birthday', false);
      throw error;
    }
  }

  // Send anniversary notification (email only)
  async sendAnniversaryNotification(employee, years) {
    console.log(`🎉 Processing anniversary notification for ${employee.name} (${years} years)`);
    
    if (this.wasNotificationSentToday(employee.id, 'anniversary')) {
      console.log(`🔄 Anniversary notification already sent today for ${employee.name}`);
      return { success: true, message: 'Already sent today', skipped: true };
    }

    const emailMessage = this.generateAnniversaryMessage(employee, years);
    const results = { email: null };
    let overallSuccess = false;

    try {
      // Send email notification
      if (employee.email) {
        try {
          console.log(`📧 Sending anniversary email to ${employee.name}...`);
          results.email = await this.sendEmailNotification(employee, emailMessage, 'anniversary');
          overallSuccess = true;
          console.log(`✅ Anniversary email sent to ${employee.name}`);
        } catch (error) {
          console.error(`❌ Anniversary email failed for ${employee.name}:`, error);
          results.email = { success: false, error: error.message, method: 'email' };
        }
      } else {
        console.log(`⚠️ No email address for ${employee.name}`);
      }

      this.markNotificationSent(employee.id, 'anniversary', overallSuccess);

      return { 
        success: overallSuccess, 
        results, 
        message: emailMessage,
        employee: employee.name,
        type: 'anniversary',
        years
      };
    } catch (error) {
      console.error(`❌ Anniversary notification process failed for ${employee.name}:`, error);
      this.markNotificationSent(employee.id, 'anniversary', false);
      throw error;
    }
  }

  // Check and send notifications for today's celebrations
  async checkAndSendTodayNotifications(employees) {
    const today = new Date();
    const results = [];

    console.log(`🔍 Checking notifications for ${employees.length} employees on ${today.toDateString()}`);

    for (const employee of employees) {
      try {
        console.log(`👤 Processing employee: ${employee.name} (ID: ${employee.id})`);
        
        // Check birthday
        if (employee.birthday) {
          const birthDate = new Date(employee.birthday);
          if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
            console.log(`🎂 Today is ${employee.name}'s birthday!`);
            const age = this.calculateAge(employee.birthday);
            const result = await this.sendBirthdayNotification(employee, age);
            results.push(result);
          }
        }

        // Check work anniversary
        if (employee.joinDate) {
          const joinDate = new Date(employee.joinDate);
          if (joinDate.getMonth() === today.getMonth() && joinDate.getDate() === today.getDate()) {
            const years = this.calculateYearsOfService(employee.joinDate);
            if (years > 0) {
              console.log(`🎉 Today is ${employee.name}'s ${years} year work anniversary!`);
              const result = await this.sendAnniversaryNotification(employee, years);
              results.push(result);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error processing notifications for ${employee.name}:`, error);
        results.push({
          employee: employee.name,
          type: 'error',
          success: false,
          error: error.message
        });
      }
    }

    console.log('📊 Notification results:', results);
    return results;
  }

  // Send test notification (email only)
  async sendTestNotification(employee, type) {
    console.log(`🧪 Sending test ${type} notification to ${employee.name}`);
    
    try {
      let result;
      if (type === 'birthday') {
        const age = this.calculateAge(employee.birthday || '1990-01-01');
        const emailMessage = `🎉 TEST MESSAGE: Happy Birthday, ${employee.name}! This is a test birthday notification. You would be turning ${age} years old!`;
        
        const results = { email: null };
        
        // Test email
        if (employee.email) {
          try {
            console.log(`📧 Testing birthday email for ${employee.name}...`);
            results.email = await this.sendEmailNotification(employee, emailMessage, 'birthday');
          } catch (error) {
            console.error(`❌ Test email failed:`, error);
            results.email = { success: false, error: error.message };
          }
        }
        
        result = { 
          success: results.email?.success || false, 
          results,
          type: 'birthday'
        };
      } else {
        const years = this.calculateYearsOfService(employee.joinDate || '2020-01-01');
        const emailMessage = `🎊 TEST MESSAGE: Happy Work Anniversary, ${employee.name}! This is a test anniversary notification. You would be celebrating ${years} years with us!`;
        
        const results = { email: null };
        
        // Test email
        if (employee.email) {
          try {
            console.log(`📧 Testing anniversary email for ${employee.name}...`);
            results.email = await this.sendEmailNotification(employee, emailMessage, 'anniversary');
          } catch (error) {
            console.error(`❌ Test email failed:`, error);
            results.email = { success: false, error: error.message };
          }
        }
        
        result = { 
          success: results.email?.success || false, 
          results,
          type: 'anniversary'
        };
      }
      
      console.log(`🧪 Test notification result for ${employee.name}:`, result);
      return result;
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      throw error;
    }
  }

  // Calculate age
  calculateAge(birthday) {
    if (!birthday) return 0;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Calculate years of service
  calculateYearsOfService(joinDate) {
    if (!joinDate) return 0;
    const today = new Date();
    const join = new Date(joinDate);
    let years = today.getFullYear() - join.getFullYear();
    const monthDiff = today.getMonth() - join.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < join.getDate())) {
      years--;
    }
    return years;
  }

  // Get notification statistics
  getNotificationStats() {
    const stats = {
      totalSent: 0,
      birthdaysSent: 0,
      anniversariesSent: 0,
      failedAttempts: 0,
      emailsSent: 0
    };

    Object.entries(this.notificationHistory).forEach(([key, record]) => {
      if (record.sent) {
        stats.totalSent++;
        if (key.includes('birthday')) stats.birthdaysSent++;
        if (key.includes('anniversary')) stats.anniversariesSent++;
        stats.emailsSent++;
      } else {
        stats.failedAttempts++;
      }
    });

    return stats;
  }
}

export const notificationService = new NotificationService();
