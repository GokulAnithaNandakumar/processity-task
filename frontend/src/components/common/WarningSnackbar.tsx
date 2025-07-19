import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface WarningSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export const WarningSnackbar: React.FC<WarningSnackbarProps> = ({
  open,
  message,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity="warning"
        variant="filled"
        onClose={onClose}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={onClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
        sx={{
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(255, 152, 0, 0.3)',
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold', mb: 1 }}>
          Warning
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};
