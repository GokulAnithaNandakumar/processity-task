import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

// Mock the auth hook
jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    loading: false,
    error: null,
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  it('renders login form', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows register link', () => {
    renderWithRouter(<LoginForm />);

    expect(screen.getByText('create a new account')).toBeInTheDocument();
  });
});
