import React from 'react';
import { Users, Calendar, TrendingUp, Award } from 'lucide-react';

const Stats = ({ employees, currentMonth }) => {
  const currentMonthBirthdays = employees.filter(emp => {
    if (!emp.birthday) return false;
    const birthDate = new Date(emp.birthday);
    return birthDate.getMonth() === currentMonth.getMonth();
  });

  const currentMonthJoins = employees.filter(emp => {
    if (!emp.joinDate) return false;
    const joinDate = new Date(emp.joinDate);
    return joinDate.getMonth() === currentMonth.getMonth();
  });

  const avgYearsOfService = employees.reduce((sum, emp) => {
    if (!emp.joinDate) return sum;
    const years = new Date().getFullYear() - new Date(emp.joinDate).getFullYear();
    return sum + years;
  }, 0) / employees.length || 0;

  const stats = [
    {
      icon: Users,
      label: 'Total Employees',
      value: employees.length,
      color: 'purple'
    },
    {
      icon: Calendar,
      label: 'Birthdays This Month',
      value: currentMonthBirthdays.length,
      color: 'pink'
    },
    {
      icon: Award,
      label: 'Anniversaries This Month',
      value: currentMonthJoins.length,
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: 'Avg Years of Service',
      value: avgYearsOfService.toFixed(1),
      color: 'blue'
    }
  ];

  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600 border-purple-200',
    pink: 'bg-pink-100 text-pink-600 border-pink-200',
    green: 'bg-green-100 text-green-600 border-green-200',
    blue: 'bg-blue-100 text-blue-600 border-blue-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Statistics</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`border rounded-lg p-4 ${colorClasses[stat.color]}`}>
            <div className="flex items-center gap-3">
              <stat.icon size={24} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;