import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import type { Task } from '../../types';
import { useTask } from '../../hooks/useTask';

interface FormData {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskFormProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, isOpen, onClose, onSuccess }) => {
  const { createTask, updateTask, loading, error } = useTask();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitError(null);

      const taskData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      };

      if (task) {
        await updateTask(task._id, taskData);
      } else {
        await createTask(taskData);
      }

      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {(error || submitError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <span className="text-sm">{error || submitError}</span>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title *
            </label>
            <input
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 1, message: 'Title is required' },
                maxLength: { value: 100, message: 'Title cannot be more than 100 characters' }
              })}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description', {
                maxLength: { value: 500, message: 'Description cannot be more than 500 characters' }
              })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status *
              </label>
              <select
                {...register('status', { required: 'Status is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && (
                <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                Priority *
              </label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="mt-2 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date
            </label>
            <input
              {...register('dueDate')}
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
            />
            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                task ? 'Update Task' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
