import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import { Download, Trash2, Shield, Clock, FileText, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [exportDialog, setExportDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/gdpr/export');

      // Create and download file
      const blob = new Blob([JSON.stringify(response.data.data, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully!' });
      setExportDialog(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmEmail !== user?.email) {
      setMessage({ type: 'error', text: 'Email confirmation does not match' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/gdpr/delete-request', {
        confirmEmail,
        confirmPassword,
        reason: deleteReason
      });

      setMessage({
        type: 'success',
        text: 'Account deletion request submitted. You will be logged out and your account will be deleted within 30 days.'
      });
      setDeleteDialog(false);

      // Logout user after successful deletion request
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Deletion request failed';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings & Privacy
      </Typography>

      {message && (
        <Alert
          severity={message.type}
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Account Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Name"
                secondary={user?.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={user?.email}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Account Created"
                secondary={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* GDPR Data Rights */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Shield style={{ marginRight: 8 }} />
            Your Data Rights (GDPR)
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You have the following rights regarding your personal data:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <Download size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Right of Access"
                secondary="Export all your personal data in a structured format"
              />
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => setExportDialog(true)}
              >
                Export Data
              </Button>
            </ListItem>

            <Divider sx={{ my: 2 }} />

            <ListItem>
              <ListItemIcon>
                <Trash2 size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Right to Erasure"
                secondary="Request permanent deletion of your account and all associated data"
              />
              <Button
                variant="outlined"
                color="error"
                startIcon={<Trash2 />}
                onClick={() => setDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Privacy Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <FileText style={{ marginRight: 8 }} />
            Privacy & Compliance
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip label="GDPR Compliant" color="success" size="small" sx={{ mr: 1 }} />
            <Chip label="Data Encrypted" color="primary" size="small" sx={{ mr: 1 }} />
            <Chip label="Audit Logged" color="info" size="small" />
          </Box>

          <List>
            <ListItem>
              <ListItemIcon>
                <Clock size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Data Retention"
                secondary="Account data: Until deletion requested • Audit logs: 7 years • Backups: 90 days"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Shield size={20} />
              </ListItemIcon>
              <ListItemText
                primary="Data Security"
                secondary="AES-256 encryption, TLS 1.3 transport, bcrypt password hashing"
              />
            </ListItem>
          </List>

          <Button
            variant="text"
            href="/privacy"
            sx={{ mt: 2 }}
          >
            View Full Privacy Policy
          </Button>
        </CardContent>
      </Card>

      {/* Export Data Dialog */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            This will download a JSON file containing all your personal data, including:
          </Typography>
          <List dense>
            <ListItem>• Account information (name, email, registration date)</ListItem>
            <ListItem>• All your tasks and their details</ListItem>
            <ListItem>• Recent activity logs (last 1000 entries)</ListItem>
            <ListItem>• Data processing metadata</ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            This action is logged for security purposes as required by GDPR.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button
            onClick={handleExportData}
            variant="contained"
            disabled={loading}
            startIcon={<Download />}
          >
            {loading ? 'Exporting...' : 'Export Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
          <AlertTriangle style={{ marginRight: 8 }} />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 3 }}>
            <strong>Warning:</strong> This action will permanently delete your account and all associated data.
            This cannot be undone.
          </Alert>

          <Typography variant="body2" sx={{ mb: 2 }}>
            To confirm account deletion, please provide:
          </Typography>

          <TextField
            fullWidth
            label="Confirm your email"
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            sx={{ mb: 2 }}
            placeholder={user?.email}
          />

          <TextField
            fullWidth
            label="Confirm your password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Reason for deletion (optional)"
            multiline
            rows={3}
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Help us improve by telling us why you're leaving..."
          />

          <Alert severity="info">
            <strong>Processing Time:</strong> Your account will be deactivated immediately and permanently
            deleted within 30 days as required by GDPR. You can withdraw this request within 30 days.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading || !confirmEmail || !confirmPassword}
            startIcon={<Trash2 />}
          >
            {loading ? 'Processing...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
