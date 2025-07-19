import React from 'react';
import { Calendar, Clock, Edit, Trash2, AlertCircle } from 'lucide-react';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-200';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-200';
      case 'in-progress':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {task.title}
            </h3>
            {isOverdue && (
              <div title="Overdue" className="bg-red-100 p-1 rounded-full">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>

          {task.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                task.status
              )}`}
            >
              {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {task.dueDate && (
              <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-gray-50'}`}>
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Due {formatDate(task.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Created {formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
            title="Edit task"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
