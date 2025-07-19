import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
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
    watch,
    setValue,
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

  // Watch form values for controlled components
  const watchedStatus = watch('status');
  const watchedPriority = watch('priority');

  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description || '');
      setValue('status', task.status);
      setValue('priority', task.priority);
      setValue('dueDate', task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    }
  }, [task, setValue]);

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

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white'
      }}>
        <Box sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          {task ? 'Edit Task' : 'Create New Task'}
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          {(error || submitError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || submitError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 1, message: 'Title is required' },
                maxLength: { value: 100, message: 'Title cannot be more than 100 characters' }
              })}
              label="Title"
              placeholder="Enter task title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              variant="outlined"
              required
            />

            <TextField
              {...register('description', {
                maxLength: { value: 500, message: 'Description cannot be more than 500 characters' }
              })}
              label="Description"
              placeholder="Enter task description"
              fullWidth
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              variant="outlined"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  {...register('status', { required: 'Status is required' })}
                  value={watchedStatus}
                  onChange={(e) => setValue('status', e.target.value as 'pending' | 'in-progress' | 'completed')}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
                {errors.status && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                    {errors.status.message}
                  </Box>
                )}
              </FormControl>

              <FormControl fullWidth required error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Select
                  {...register('priority', { required: 'Priority is required' })}
                  value={watchedPriority}
                  onChange={(e) => setValue('priority', e.target.value as 'low' | 'medium' | 'high')}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
                {errors.priority && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                    {errors.priority.message}
                  </Box>
                )}
              </FormControl>
            </Box>

            <TextField
              {...register('dueDate')}
              label="Due Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              }
            }}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
