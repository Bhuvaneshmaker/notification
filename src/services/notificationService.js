import emailjs from 'emailjs-com';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_3vpz11v',
  birthdayTemplateId: 'template_btpxixl',
  anniversaryTemplateId: 'template_aeteyjk',
  userId: '7y2RRXhY4jQpcyrOa'
};

class NotificationService {
  constructor() {
    this.initializeEmailJS();
    this.notificationHistory = this.loadNotificationHistory();
  }

  initializeEmailJS() {
    try {
      emailjs.init(EMAILJS_CONFIG.userId);
      console.log('✅ EmailJS initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize EmailJS:', error);
    }
  }

  // Notification history (localStorage)
  loadNotificationHistory() {
    try {
      const history = localStorage.getItem('notificationHistory');
      return history ? JSON.parse(history) : {};
    } catch (error) {
      console.error('Error loading notification history:', error);
      return {};
    }
  }

  saveNotificationHistory() {
    try {
      localStorage.setItem('notificationHistory', JSON.stringify(this.notificationHistory));
    } catch (error) {
      console.error('Error saving notification history:', error);
    }
  }

  wasNotificationSentToday(employeeId, type) {
    const today = new Date().toDateString();
    const key = `${employeeId}_${type}_${today}`;
    return this.notificationHistory[key]?.sent || false;
  }

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

  generateBirthdayMessage(employee, age) {
    const messages = [
      `🎉 Happy Birthday, ${employee.name}! 🎂 Wishing you a fantastic ${age}th birthday filled with joy, happiness, and success. May your special day be full of laughter and unforgettable moments, 
      and may the year ahead bring you amazing opportunities and endless reasons to celebrate! 🎁`
    ];
    return messages;
  }

  generateAnniversaryMessage(employee, years) {
    const messages = [
    `🎉 Congratulations, ${employee.name}! 🏆 Today marks ${years} amazing years with us, filled with impact, growth, and dedication. Thank you for everything you bring to the 
    team — your contributions truly make a difference. Here’s to many more successful years ahead! 🎯`
    ];
    return messages;
  }

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
        subject,
        message,
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

  async sendBirthdayNotification(employee, age) {
    if (this.wasNotificationSentToday(employee.id, 'birthday')) {
      return { success: true, message: 'Already sent today', skipped: true };
    }

    const message = this.generateBirthdayMessage(employee, age);
    let result;

    try {
      result = await this.sendEmailNotification(employee, message, 'birthday');
      this.markNotificationSent(employee.id, 'birthday', true);
    } catch (error) {
      this.markNotificationSent(employee.id, 'birthday', false);
      result = { success: false, error: error.message };
    }

    return { ...result, employee: employee.name, type: 'birthday', message, age };
  }

  async sendAnniversaryNotification(employee, years) {
    if (this.wasNotificationSentToday(employee.id, 'anniversary')) {
      return { success: true, message: 'Already sent today', skipped: true };
    }

    const message = this.generateAnniversaryMessage(employee, years);
    let result;

    try {
      result = await this.sendEmailNotification(employee, message, 'anniversary');
      this.markNotificationSent(employee.id, 'anniversary', true);
    } catch (error) {
      this.markNotificationSent(employee.id, 'anniversary', false);
      result = { success: false, error: error.message };
    }

    return { ...result, employee: employee.name, type: 'anniversary', message, years };
  }

  async checkAndSendTodayNotifications(employees) {
    const today = new Date();
    const results = [];

    for (const employee of employees) {
      try {
        if (employee.birthday) {
          const birthDate = new Date(employee.birthday);
          if (birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate()) {
            const age = this.calculateAge(employee.birthday);
            const result = await this.sendBirthdayNotification(employee, age);
            results.push(result);
          }
        }

        if (employee.joinDate) {
          const joinDate = new Date(employee.joinDate);
          if (joinDate.getMonth() === today.getMonth() && joinDate.getDate() === today.getDate()) {
            const years = this.calculateYearsOfService(employee.joinDate);
            if (years > 0) {
              const result = await this.sendAnniversaryNotification(employee, years);
              results.push(result);
            }
          }
        }
      } catch (error) {
        results.push({
          employee: employee.name,
          type: 'error',
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  async sendTestNotification(employee, type) {
    const results = { email: null };

    try {
      if (type === 'birthday') {
        const age = this.calculateAge(employee.birthday || '1990-01-01');
        const message = `🧪 TEST: Happy Birthday, ${employee.name}! You would be ${age} today.`;
        results.email = await this.sendEmailNotification(employee, message, 'birthday');
      } else {
        const years = this.calculateYearsOfService(employee.joinDate || '2020-01-01');
        const message = `🧪 TEST: Happy ${years} Year Work Anniversary, ${employee.name}!`;
        results.email = await this.sendEmailNotification(employee, message, 'anniversary');
      }

      return { success: results.email.success, results, type };
    } catch (error) {
      return { success: false, error: error.message, type };
    }
  }

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
      emailsSent: 0,
      smsSent: 0
    };

    Object.entries(this.notificationHistory).forEach(([key, record]) => {
      if (record.sent) {
        stats.totalSent++;
        if (key.includes('birthday')) stats.birthdaysSent++;
        if (key.includes('anniversary')) stats.anniversariesSent++;
      } else {
        stats.failedAttempts++;
      }
    });

    return stats;
  }

  // Get available message templates
  getMessageTemplates() {
    return TWILIO_TEMPLATES;
  }
}

export const notificationService = new NotificationService();
