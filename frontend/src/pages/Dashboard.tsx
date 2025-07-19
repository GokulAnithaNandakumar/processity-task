import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
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
  const completedCount = stats?.stats.find(s => s._id === 'completed')?.count || 0;
  const overdueCount = stats?.overdue || 0;

  return (
    <Layout>
      <Box sx={{ space: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              Task Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Manage your tasks efficiently
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleCreateTask}
            sx={{
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 600,
            }}
          >
            New Task
          </Button>
        </Box>

        {/* Stats Cards */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
          gap: 3,
          mb: 4
        }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  p: 1,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <BarChart3 size={24} color="white" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Tasks
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {stats?.total || 0}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  bgcolor: 'warning.main',
                  borderRadius: 1,
                  p: 1,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Clock size={24} color="white" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {pendingCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  bgcolor: 'success.main',
                  borderRadius: 1,
                  p: 1,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CheckCircle size={24} color="white" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {completedCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                  bgcolor: 'error.main',
                  borderRadius: 1,
                  p: 1,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <AlertTriangle size={24} color="white" />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Overdue
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {overdueCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tasks Grid */}
        <Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={48} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Loading your tasks...
                </Typography>
              </Box>
            </Box>
          ) : filteredTasks.length === 0 ? (
            <Card sx={{ py: 8 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{
                    bgcolor: 'primary.light',
                    borderRadius: '50%',
                    width: 64,
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}>
                    <Plus size={32} color="white" />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    No tasks found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                    {searchQuery ? 'Try adjusting your search terms or filters.' : 'Get started by creating your first task.'}
                  </Typography>
                  {!searchQuery && (
                    <Button
                      variant="contained"
                      startIcon={<Plus size={20} />}
                      onClick={handleCreateTask}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      Create Your First Task
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
              gap: 3
            }}>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Task Form Modal */}
        <TaskForm
          task={editingTask}
          isOpen={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onSuccess={handleFormSuccess}
        />

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add task"
          onClick={handleCreateTask}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', sm: 'none' }, // Only show on mobile
          }}
        >
          <Plus size={24} />
        </Fab>
      </Box>
    </Layout>
  );
};
