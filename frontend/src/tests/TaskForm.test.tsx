import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TaskForm } from '../components/tasks/TaskForm';
import type { Task } from '../types';

// Mock the task hook
const { useTask } = vi.hoisted(() => ({
  useTask: vi.fn(),
}));

vi.mock('../hooks/useTask', () => ({
  useTask,
}));

const mockTask: Task = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'high',
  user: 'user1',
  createdAt: '2024-01-15T10:30:00.000Z',
  updatedAt: '2024-01-15T10:30:00.000Z',
  dueDate: '2024-02-15',
};

const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

describe('TaskForm', () => {
  const mockCreateTask = vi.fn();
  const mockUpdateTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useTask.mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      loading: false,
      error: null,
    });
  });

  it('renders create form when no task is provided', () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
  });

  it('renders edit form when task is provided', () => {
    render(
      <TaskForm
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('calls createTask when creating a new task', async () => {
    mockCreateTask.mockResolvedValueOnce(undefined);

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByText('Create Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task'
        })
      );
    });
  });

  it('calls updateTask when editing an existing task', async () => {
    mockUpdateTask.mockResolvedValueOnce(undefined);

    render(
      <TaskForm
        task={mockTask}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByDisplayValue('Test Task');
    const submitButton = screen.getByText('Update Task');

    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(
        mockTask._id,
        expect.objectContaining({
          title: 'Updated Task'
        })
      );
    });
  });

  it('validates required fields', async () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const submitButton = screen.getByText('Create Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    expect(mockCreateTask).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', () => {
    useTask.mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      loading: true,
      error: null,
    });

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error message when submission fails', () => {
    useTask.mockReturnValue({
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      loading: false,
      error: 'Failed to create task',
    });

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Failed to create task')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onSuccess after successful submission', async () => {
    mockCreateTask.mockResolvedValueOnce(undefined);

    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByText('Create Task');

    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles status and priority changes', () => {
    render(
      <TaskForm
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const statusSelect = screen.getByLabelText(/status/i);
    const prioritySelect = screen.getByLabelText(/priority/i);

    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
    fireEvent.change(prioritySelect, { target: { value: 'low' } });

    expect(statusSelect).toHaveValue('in-progress');
    expect(prioritySelect).toHaveValue('low');
  });
});
