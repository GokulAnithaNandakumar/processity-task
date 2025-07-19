import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Fab,
} from '@mui/material';
import { Plus, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { useTask } from '../hooks/useTask';
import type { Task, TaskFilters as TaskFiltersType } from '../types';

export const Dashboard: React.FC = () => {
  const { tasks, stats, loading, error, fetchTasks, deleteTask, fetchStats } = useTask();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<TaskFiltersType>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  // Fetch tasks and stats on component mount and when filters change
  useEffect(() => {
    fetchTasks(filters);
    fetchStats();
  }, [filters, fetchTasks, fetchStats]);

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        // Refresh stats after deletion
        fetchStats();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    // Refresh tasks and stats after form submission
    fetchTasks(filters);
    fetchStats();
  };

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters);
  };

  // Calculate stats for display
  const pendingCount = stats?.stats.find(s => s._id === 'pending')?.count || 0;
  const inProgressCount = stats?.stats.find(s => s._id === 'in-progress')?.count || 0;
  const completedCount = stats?.stats.find(s => s._id === 'completed')?.count || 0;
  const overdueCount = stats?.overdue || 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Task Dashboard
            </h1>
            <p className="text-gray-600 mt-1 font-medium">Manage your tasks efficiently</p>
          </div>
          <button
            onClick={handleCreateTask}
            className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-3 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">
                      Total Tasks
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {stats?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">
                      Pending
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {pendingCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-green-100 to-green-200 p-3 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">
                      Completed
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {completedCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-red-100 to-red-200 p-3 rounded-xl">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-600 truncate">
                      Overdue
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {overdueCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center shadow-lg">
            <AlertTriangle className="h-5 w-5 mr-3" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Tasks Grid */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your tasks...</p>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                {searchQuery ? 'Try adjusting your search terms or filters.' : 'Get started by creating your first task.'}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateTask}
                    className="inline-flex items-center px-6 py-3 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Task
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          task={editingTask}
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onSuccess={handleFormSuccess}
        />
      </div>
    </Layout>
  );
};
