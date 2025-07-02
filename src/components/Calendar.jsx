import React from 'react';

const Calendar = ({ 
  currentMonth, 
  selectedDate, 
  setSelectedDate, 
  setCurrentMonth, 
  hasBirthdayOnDate, 
  isJoinDate 
}) => {
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      const hasBday = hasBirthdayOnDate(day);
      const hasJoin = isJoinDate(day);

      days.push(
        <div
          key={day}
          className={`
            h-12 w-12 flex flex-col items-center justify-center cursor-pointer rounded-lg border-2 relative
            ${isSelected 
              ? 'bg-purple-600 text-white border-purple-600' 
              : 'bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-300'
            }
            ${hasBday ? 'ring-2 ring-pink-400' : ''}
            ${hasJoin ? 'ring-2 ring-green-400' : ''}
            transition-all duration-200
          `}
          onClick={() =>
            setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
          }
        >
          <span className="text-sm font-medium">{day}</span>
          <div className="flex gap-1 absolute -bottom-1">
            {hasBday && <div className="text-sm ">🎂</div>}
            {hasJoin && <div className="text-sm ">⭐</div>}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => changeMonth(-1)}
        >
          ← Previous
        </button>
        <h3 className="text-xl font-semibold text-gray-800">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => changeMonth(1)}
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {renderCalendar()}
      </div>

      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="text-lg ring-2 ring-pink-400">🎂</div>
          <span className="text-gray-600">Birthday</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-lg ring-2 ring-green-400">⭐</div>
          <span className="text-gray-600">Work Anniversary</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
