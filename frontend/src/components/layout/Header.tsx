import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from '@mui/material';
import { LogOut, CheckSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

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
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<LogOut size={18} />}
            sx={{ 
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
