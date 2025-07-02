import { useMemo, useState } from 'react';

export const useDateFilters = (employees) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const todayString = today.toDateString();

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday) => {
    if (!birthday) return 0;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getYearsOfService = (joinDate) => {
    if (!joinDate) return 0;
    const today = new Date();
    const join = new Date(joinDate);
    let years = today.getFullYear() - join.getFullYear();
    const monthDiff = today.getMonth() - join.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < join.getDate())) {
      years--;
    }
    return years;
  };

  const isSameMonthDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  // Memoized calculations
  const { todaysBirthdays, todayJoin, birthdayEmployees, joinEmployee } = useMemo(() => {
    const todaysBirthdays = employees.filter(emp => 
      emp.birthday && isSameMonthDay(emp.birthday, today)
    );

    const todayJoin = employees.filter(emp => 
      emp.joinDate && isSameMonthDay(emp.joinDate, today)
    );

    const birthdayEmployees = employees.filter(emp => 
      emp.birthday && isSameMonthDay(emp.birthday, selectedDate)
    );

    const joinEmployee = employees.filter(emp => 
      emp.joinDate && isSameMonthDay(emp.joinDate, selectedDate)
    );

    return { todaysBirthdays, todayJoin, birthdayEmployees, joinEmployee };
  }, [employees, selectedDate, todayString]);

  const hasBirthdayOnDate = (day) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => 
      emp.birthday && isSameMonthDay(emp.birthday, checkDate)
    );
  };

  const isJoinDate = (day) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return employees.some(emp => 
      emp.joinDate && isSameMonthDay(emp.joinDate, checkDate)
    );
  };

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    todaysBirthdays,
    todayJoin,
    birthdayEmployees,
    joinEmployee,
    calculateAge,
    getYearsOfService,
    formatDate,
    hasBirthdayOnDate,
    isJoinDate
  };
};