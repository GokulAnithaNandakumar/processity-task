import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { LogOut, CheckSquare, Settings, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate('/settings');
    handleClose();
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
            <CheckSquare size={24} />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Task Manager
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Welcome, <strong>{user?.name}</strong>
          </Typography>

          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
            title="Account menu"
          >
            <User size={20} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleSettings}>
              <Settings style={{ marginRight: 8 }} size={18} />
              Settings & Privacy
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogOut style={{ marginRight: 8 }} size={18} />
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </MenuItem>
          </Menu>

          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogOut size={18} />}
            disabled={isLoggingOut}
            sx={{
              textTransform: 'none',
              display: { xs: 'none', md: 'flex' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
