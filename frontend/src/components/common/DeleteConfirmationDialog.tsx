import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  taskTitle,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          pb: 2,
        }}
      >
        <Warning sx={{ fontSize: 28 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Delete Task
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2, color: 'text.primary' }}>
            Are you sure you want to delete this task?
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'error.light',
              border: '1px solid',
              borderColor: 'error.main',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'error.dark',
                wordBreak: 'break-word',
              }}
            >
              "{taskTitle}"
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All data associated with this task will be permanently removed.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'grey.100',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #ee5a24 0%, #d63031 100%)',
            },
          }}
        >
          Delete Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};
