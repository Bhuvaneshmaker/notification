import React from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';

const EmployeeSearch = ({ searchTerm, setSearchTerm, sortBy, sortOrder, onSort }) => {
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'department', label: 'Department' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'joinDate', label: 'Join Date' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSort(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </select>
        
        <button
          onClick={() => onSort(sortBy)}
          className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
          <span className="hidden sm:inline">
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default EmployeeSearch;