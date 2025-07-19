import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { TaskFilters as TaskFiltersType } from '../../types';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFilterChange: (filters: TaskFiltersType) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  searchQuery,
}) => {
  const handleStatusChange = (status: string) => {
    onFilterChange({
      ...filters,
      status: status === 'all' ? undefined : (status as TaskFiltersType['status']),
    });
  };

  const handlePriorityChange = (priority: string) => {
    onFilterChange({
      ...filters,
      priority: priority === 'all' ? undefined : (priority as TaskFiltersType['priority']),
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    onFilterChange({
      ...filters,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
          <Filter className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Filters & Search
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Tasks
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="Search by title..."
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={filters.priority || 'all'}
            onChange={(e) => handlePriorityChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleSortChange(sortBy, sortOrder);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="priority-desc">Priority (High-Low)</option>
            <option value="priority-asc">Priority (Low-High)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
