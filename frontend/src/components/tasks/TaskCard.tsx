import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Warning,
  CalendarToday,
  Schedule,
} from '@mui/icons-material';
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
        return { color: 'error' as const, bg: '#ffebee' };
      case 'medium':
        return { color: 'warning' as const, bg: '#fff8e1' };
      case 'low':
        return { color: 'success' as const, bg: '#e8f5e8' };
      default:
        return { color: 'default' as const, bg: '#f5f5f5' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'success' as const, bg: '#e8f5e8' };
      case 'in-progress':
        return { color: 'info' as const, bg: '#e3f2fd' };
      case 'pending':
        return { color: 'default' as const, bg: '#f5f5f5' };
      default:
        return { color: 'default' as const, bg: '#f5f5f5' };
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
  const wasOverdueWhenCompleted = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'completed';
  const priorityTheme = getPriorityColor(task.priority);
  const statusTheme = getStatusColor(task.status);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        },
        border: isOverdue
          ? '2px solid #f44336'
          : wasOverdueWhenCompleted
            ? '2px solid #ff9800'
            : '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 'bold',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {task.title}
              </Typography>
              {isOverdue && (
                <Tooltip title="Overdue">
                  <Warning color="error" fontSize="small" />
                </Tooltip>
              )}
              {wasOverdueWhenCompleted && (
                <Tooltip title="Completed after due date">
                  <Warning sx={{ color: '#ff9800' }} fontSize="small" />
                </Tooltip>
              )}
            </Box>

            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4,
                }}
              >
                {task.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                label={task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                color={statusTheme.color}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: statusTheme.bg,
                }}
              />
              <Chip
                label={`${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority`}
                color={priorityTheme.color}
                size="small"
                sx={{
                  fontWeight: 600,
                  backgroundColor: priorityTheme.bg,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {task.dueDate && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: isOverdue
                      ? '#ffebee'
                      : wasOverdueWhenCompleted
                        ? '#fff3e0'
                        : '#f5f5f5',
                    color: isOverdue
                      ? '#d32f2f'
                      : wasOverdueWhenCompleted
                        ? '#f57c00'
                        : 'text.secondary'
                  }}
                >
                  <CalendarToday fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Due {formatDate(task.dueDate)}
                    {wasOverdueWhenCompleted && ' (completed late)'}
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: '#f5f5f5'
                }}
              >
                <Schedule fontSize="small" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Created {formatDate(task.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
            <Tooltip title="Edit task">
              <IconButton
                onClick={() => onEdit(task)}
                color="primary"
                size="small"
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete task">
              <IconButton
                onClick={() => onDelete(task._id)}
                color="error"
                size="small"
                sx={{
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'white',
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
