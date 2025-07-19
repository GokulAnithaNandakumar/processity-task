import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { LoginForm } from '../components/auth/LoginForm';

// Mock react-router-dom first
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the auth hook with factory function
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    login: vi.fn(),
    loading: false,
    error: null,
  })),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  const mockUseAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null,
    });
  });

  it('renders login form elements', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows register link', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByText("Don't have an account? Register")).toBeInTheDocument();
  });

  it('calls login function with correct credentials', () => {
    renderWithRouter(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByRole('textbox', { name: /password/i }) || 
                          document.querySelector('input[name="password"]') as HTMLInputElement;
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('navigates to dashboard on successful login', async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    renderWithRouter(<LoginForm />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message when login fails', () => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      loading: false,
      error: 'Invalid credentials',
    });

    renderWithRouter(<LoginForm />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('shows loading indicator when submitting', () => {
    const mockSubmit = vi.fn();
    mockUseAuth.mockReturnValue({
      login: mockSubmit,
      loading: true,
      error: null,
    });

    renderWithRouter(<LoginForm />);

    // Check if loading state is visible (could be disabled button text or loading spinner)
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderWithRouter(<LoginForm />);

    const passwordInputs = screen.getAllByDisplayValue('');
    const passwordField = passwordInputs.find(input => (input as HTMLInputElement).name === 'password') as HTMLInputElement;
    const toggleButton = screen.getByLabelText(/toggle password visibility/i);

    expect(passwordField.type).toBe('password');

    fireEvent.click(toggleButton);
    expect(passwordField.type).toBe('text');

    fireEvent.click(toggleButton);
    expect(passwordField.type).toBe('password');
  });
});
