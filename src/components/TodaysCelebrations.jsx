import React from 'react';
import { Star, Heart } from 'lucide-react';

const TodaysCelebrations = ({ todaysBirthdays, todayJoin, calculateAge, getYearsOfService, formatDate }) => {
  return (
    <>
      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <Star className="text-yellow-300 animate-spin" />
            🎉 Today's Birthday Celebrations! 🎉  <Heart className='text-red-300 animate-bounce'/>
          </h2>
          <div className="rid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-items-center">
            {todaysBirthdays.map((emp, index) => (
              <div key={index} className="bg-black bg-opacity-20 rounded-lg p-4">
                <h4 className="font-bold text-xl">{emp.name}</h4>
                <p className="text-pink-300">🎂 Turning {calculateAge(emp.birthday)} years old!</p>
                <div className="mt-2 p-2 bg-white bg-opacity-10 rounded">
                  <p className="text-sm">
                    🎊 "Wishing you a fantastic birthday filled with joy, laughter, and wonderful memories!"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Work Anniversaries */}
      {todayJoin.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
            <Star className="text-yellow-300 animate-spin" />
            🎉 Work Anniversary Celebrations! 🎉<Heart className='text-red-300 animate-bounce'/>
          </h2>
          <div className="rid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-items-center">
            {todayJoin.map((emp, index) => (
              <div key={index} className="bg-white text-black bg-opacity-20  rounded-lg p-4">
                <h4 className="font-bold text-xl text-black">{emp.name}</h4>
                <p className="text-green-700">🎉 Stepping to {getYearsOfService(emp.joinDate)} years!</p>
                <div className="mt-2 p-2 bg-grey-200 bg-opacity-10 rounded">
                  <p className="text-sm text-black">
                    🎊 "{emp.name} Congratulations on {getYearsOfService(emp.joinDate)} amazing years with us since {formatDate(emp.joinDate)}!"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TodaysCelebrations;
