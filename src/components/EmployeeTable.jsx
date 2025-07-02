import React, { useState } from 'react';
import { Trash2, Calendar, Mail, Building, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

const EmployeeTable = ({ employees, onDelete, onSort, sortBy, sortOrder }) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, employee: null });

  const handleDeleteClick = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.employee) {
      await onDelete(deleteModal.employee.id);
      setDeleteModal({ isOpen: false, employee: null });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday) => {
    if (!birthday) return 'N/A';
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
    if (!joinDate) return 'N/A';
    const today = new Date();
    const join = new Date(joinDate);
    let years = today.getFullYear() - join.getFullYear();
    const monthDiff = today.getMonth() - join.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < join.getDate())) {
      years--;
    }
    return years;
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
    >
      {children}
      {sortBy === field && (
        sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
      )}
    </button>
  );

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No employees found</h3>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-50 border-b border-purple-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-purple-800">
                <SortButton field="name">Name</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-purple-800">
                <SortButton field="email">Email</SortButton>
              </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-purple-800">
                <SortButton field="phoneNo">Phone Number</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-purple-800">
                <SortButton field="birthday">Birthday</SortButton>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-purple-800">
                <SortButton field="joinDate">Join Date</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-purple-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((employee, index) => (
              <tr key={employee.id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{employee.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    {employee.email || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building size={16} />
                    {employee.phoneNo || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600">
                    {formatDate(employee.birthday)}
                    {employee.birthday && (
                      <div className="text-sm text-purple-600">
                        Age: {calculateAge(employee.birthday)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600">
                    {formatDate(employee.joinDate)}
                    {employee.joinDate && (
                      <div className="text-sm text-green-600">
                        {getYearsOfService(employee.joinDate)} years
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteClick(employee)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Employee"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {employees.map((employee, index) => (
          <div key={employee.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-900">{employee.name || 'N/A'}</h3>
              <button
                onClick={() => handleDeleteClick(employee)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>{employee.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Building size={16} />
                <span>{employee.phoneNo || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>Birthday: {formatDate(employee.birthday)} (Age: {calculateAge(employee.birthday)})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>Joined: {formatDate(employee.joinDate)} ({getYearsOfService(employee.joinDate)} years)</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        employee={deleteModal.employee}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, employee: null })}
      />
    </>
  );
};

export default EmployeeTable;