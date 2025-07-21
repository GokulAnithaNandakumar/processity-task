import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from '../../hooks/useAuth';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    return {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleRegister = async () => {
    try {
      await registerUser(name, email, password, confirmPassword);
      navigate('/dashboard');
    } catch {
      // Error is handled by the context
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Register</Typography>
          <Box sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              name="name"
              required
              fullWidth
              id="name"
              label="Name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
              error={password.length > 0 && !passwordValidation.isValid}
              helperText={password.length > 0 && !passwordValidation.isValid ?
                "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)"
                : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {password.length > 0 && (
              <Box sx={{ mb: 2, pl: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Password requirements:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    color={passwordValidation.minLength ? 'success.main' : 'error.main'}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    ✓ 8+ characters
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordValidation.hasUppercase ? 'success.main' : 'error.main'}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    ✓ Uppercase
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordValidation.hasLowercase ? 'success.main' : 'error.main'}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    ✓ Lowercase
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordValidation.hasNumber ? 'success.main' : 'error.main'}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    ✓ Number
                  </Typography>
                  <Typography
                    variant="caption"
                    color={passwordValidation.hasSpecialChar ? 'success.main' : 'error.main'}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    ✓ Special (@$!%*?&)
                  </Typography>
                </Box>
              </Box>
            )}

            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
              error={confirmPassword.length > 0 && !passwordsMatch}
              helperText={confirmPassword.length > 0 && !passwordsMatch ? "Passwords do not match" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
              disabled={loading || !passwordValidation.isValid || !passwordsMatch || !name || !email}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link to="/login">Already have an account? Login</Link>
            </Box>

            <Box sx={{ textAlign: 'center', fontSize: '0.8rem', color: 'text.secondary' }}>
              By registering, you agree to our{' '}
              <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Privacy Policy & Terms
              </Link>{' '}
              and consent to data processing as described.
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};
