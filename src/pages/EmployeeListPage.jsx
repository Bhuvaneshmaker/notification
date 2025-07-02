import React, { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeSearch from '../components/EmployeeSearch';
import CSVExport from '../components/CSVExport';
import { Users, Download, Search } from 'lucide-react';

const EmployeeListPage = () => {
  const { employees, loading, deleteEmployee } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let aValue = a[sortBy] || '';
    let bValue = b[sortBy] || '';
    
    if (sortBy === 'birthday' || sortBy === 'joinDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-600 font-medium">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="text-purple-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-purple-800">Employee Directory</h1>
                <p className="text-gray-600">Manage and view all employee information</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-purple-100 px-4 py-2 rounded-lg">
                <span className="text-purple-800 font-semibold">
                  Total Employees: {employees.length}
                </span>
              </div>
              <CSVExport employees={employees} />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <EmployeeSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <EmployeeTable
            employees={sortedEmployees}
            onDelete={deleteEmployee}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="mt-4 text-center text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListPage;