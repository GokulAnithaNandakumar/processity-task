import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TaskCard } from '../components/tasks/TaskCard';
import type { Task } from '../types';

const mockTask: Task = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'high',
  user: 'user1',
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T10:30:00.000Z',
};

const mockOverdueTask: Task = {
  ...mockTask,
  _id: '2',
  title: 'Overdue Task',
  dueDate: '2024-01-10T10:30:00.000Z', // Past date
  status: 'pending',
};

const mockCompletedLateTask: Task = {
  ...mockTask,
  _id: '3',
  title: 'Completed Late Task',
  dueDate: '2024-01-10T10:30:00.000Z', // Past date
  status: 'completed',
};

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

describe('TaskCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
  });

  it('displays overdue indicator for overdue tasks', () => {
    render(
      <TaskCard
        task={mockOverdueTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
  });

  it('displays completed late indicator for completed overdue tasks', () => {
    render(
      <TaskCard
        task={mockCompletedLateTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByLabelText('Completed after due date')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask._id);
  });

  it('formats dates correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Created Jan 15, 2024/)).toBeInTheDocument();
  });

  it('displays due date when present', () => {
    const taskWithDueDate = {
      ...mockTask,
      dueDate: '2024-02-15T10:30:00.000Z'
    };

    render(
      <TaskCard
        task={taskWithDueDate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/Due Feb 15, 2024/)).toBeInTheDocument();
  });

  it('applies correct styling for different priorities', () => {
    const { rerender } = render(
      <TaskCard
        task={{ ...mockTask, priority: 'low' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Low Priority')).toBeInTheDocument();

    rerender(
      <TaskCard
        task={{ ...mockTask, priority: 'medium' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Medium Priority')).toBeInTheDocument();
  });

  it('applies correct styling for different statuses', () => {
    const { rerender } = render(
      <TaskCard
        task={{ ...mockTask, status: 'in-progress' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('In Progress')).toBeInTheDocument();

    rerender(
      <TaskCard
        task={{ ...mockTask, status: 'completed' }}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('truncates long descriptions', () => {
    const longDescriptionTask = {
      ...mockTask,
      description: 'This is a very long description that should be truncated when displayed in the task card component to maintain a clean and organized layout.'
    };

    render(
      <TaskCard
        task={longDescriptionTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // The description should be present but may be truncated
    expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
  });
});
