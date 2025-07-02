import React, { useState } from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';

const CSVExport = ({ employees }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const calculateAge = (birthday) => {
    if (!birthday) return '';
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
    if (!joinDate) return '';
    const today = new Date();
    const join = new Date(joinDate);
    let years = today.getFullYear() - join.getFullYear();
    const monthDiff = today.getMonth() - join.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < join.getDate())) {
      years--;
    }
    return years;
  };

  const escapeCSVField = (field) => {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    
    try {
      // CSV Headers
      const headers = [
        'Name',
        'Email',
        'Phone Number',
        'Birthday',
        'Age',
        'Join Date',
        'Years of Service',
        //'Created At'
      ];

      // CSV Data
      const csvData = employees.map(employee => [
        escapeCSVField(employee.name || ''),
        escapeCSVField(employee.email || ''),
        escapeCSVField(employee.phoneNo || ''),
        escapeCSVField(formatDate(employee.birthday)),
        escapeCSVField(calculateAge(employee.birthday)),
        escapeCSVField(formatDate(employee.joinDate)),
        escapeCSVField(getYearsOfService(employee.joinDate)),
       // escapeCSVField(formatDate(employee.createdAt))
      ]);

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={exportToCSV}
        disabled={isExporting || employees.length === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isExporting || employees.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : exportSuccess
            ? 'bg-green-600 text-white'
            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
        }`}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Exporting...</span>
          </>
        ) : exportSuccess ? (
          <>
            <CheckCircle size={20} />
            <span>Exported!</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </>
        )}
      </button>

      {employees.length === 0 && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
          No employees to export
        </div>
      )}
    </div>
  );
};

export default CSVExport;