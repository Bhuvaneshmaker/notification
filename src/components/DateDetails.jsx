import React from 'react';
import { Calendar, Gift, Star } from 'lucide-react';

const DateDetails = ({ 
  selectedDate, 
  birthdayEmployees, 
  joinEmployee, 
  calculateAge, 
  getYearsOfService, 
  formatDate 
}) => {
  const hasEvents = birthdayEmployees.length > 0 || joinEmployee.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="text-purple-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">
          Events on {formatDate(selectedDate)}
        </h3>
      </div>

      {!hasEvents ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No celebrations on this date</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Birthdays */}
          {birthdayEmployees.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold text-pink-600 mb-4">
                <Gift size={20} />
                Birthdays ({birthdayEmployees.length})
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {birthdayEmployees.map((emp, index) => (
                  <div key={index} className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">{emp.name}</h5>
                    <p className="text-pink-600">🎂 Turning {calculateAge(emp.birthday)} years old!</p>
                    {emp.department && (
                      <p className="text-sm text-gray-600">{emp.department}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Anniversaries */}
          {joinEmployee.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-lg font-semibold text-green-600 mb-4">
                <Star size={20} />
                Work Anniversaries ({joinEmployee.length})
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {joinEmployee.map((emp, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900">{emp.name}</h5>
                    <p className="text-green-600">⭐ {getYearsOfService(emp.joinDate)} years of service!</p>
                    {emp.department && (
                      <p className="text-sm text-gray-600">{emp.department}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateDetails;