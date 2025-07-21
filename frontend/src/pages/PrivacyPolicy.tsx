import React from 'react';
import { Container, Typography, Box, Card, CardContent, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, FileText, Clock, Globe } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <ArrowLeft style={{ marginRight: 8 }} />
          <Typography variant="h6">Back</Typography>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy & Data Protection
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Last updated: {new Date().toLocaleDateString()}<br />
          Effective date: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          <Chip icon={<Shield />} label="GDPR Compliant" color="success" />
          <Chip icon={<Lock />} label="Data Encrypted" color="primary" />
          <Chip icon={<Eye />} label="Transparent Processing" color="info" />
          <Chip icon={<FileText />} label="User Rights Protected" color="secondary" />
        </Box>
      </Box>

      {/* Data Controller Information */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Globe style={{ marginRight: 8 }} /> Data Controller Information
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Service:</strong> Processity Task Manager<br />
            <strong>Data Controller:</strong> Processity Development Team<br />
            <strong>Contact:</strong> privacy@processity.com<br />
            <strong>Data Protection Officer:</strong> dpo@processity.com
          </Typography>
        </CardContent>
      </Card>

      {/* What Data We Collect */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            1. What Personal Data We Collect
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Account Information</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Email Address"
                secondary="Used for account identification, authentication, and important service notifications"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Full Name"
                secondary="Used for personalization and account management"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Encrypted Password"
                secondary="Securely hashed using bcrypt with 12 salt rounds - we never store plain text passwords"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Task Data</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Task Content"
                secondary="Titles, descriptions, due dates, status, and priority levels you create"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Task Metadata"
                secondary="Creation dates, modification timestamps, and task relationships"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Technical Data</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Login Activity"
                secondary="IP addresses, browser information, login/logout times for security monitoring"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Usage Analytics"
                secondary="Feature usage patterns, performance metrics, error logs (anonymized where possible)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Device Information"
                secondary="Browser type, operating system, screen resolution for optimization"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Legal Basis and Purpose */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            2. Legal Basis and Purpose of Processing
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Consent (Article 6(1)(a) GDPR)</Typography>
            <Typography variant="body2" paragraph>
              • Account creation and user registration<br />
              • Marketing communications (if opted in)<br />
              • Optional analytics and improvement features
            </Typography>

            <Typography variant="h6" gutterBottom>Contractual Necessity (Article 6(1)(b) GDPR)</Typography>
            <Typography variant="body2" paragraph>
              • Providing the task management service<br />
              • User authentication and access control<br />
              • Data synchronization across devices<br />
              • Customer support and technical assistance
            </Typography>

            <Typography variant="h6" gutterBottom>Legitimate Interest (Article 6(1)(f) GDPR)</Typography>
            <Typography variant="body2" paragraph>
              • Security monitoring and fraud prevention<br />
              • System optimization and performance improvement<br />
              • Business analytics and service enhancement
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Data Storage and Security */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Lock style={{ marginRight: 8 }} /> 3. Data Storage and Security Measures
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Encryption Standards</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Data in Transit"
                secondary="All data is encrypted using TLS 1.3 during transmission between your device and our servers"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Data at Rest"
                secondary="Database encryption using AES-256 encryption provided by MongoDB Atlas"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Password Security"
                secondary="Passwords are hashed using bcrypt with 12 salt rounds and never stored in plain text"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Infrastructure Security</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Cloud Provider"
                secondary="Microsoft Azure with SOC 2 Type II, ISO 27001, and other enterprise certifications"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Database"
                secondary="MongoDB Atlas with built-in security features and automated backups"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Access Controls"
                secondary="JWT-based authentication with secure token management and session controls"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Security Monitoring</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Audit Logging"
                secondary="Comprehensive audit trail of all data access and modifications"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Threat Detection"
                secondary="Automated monitoring for suspicious activities and security threats"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Rate Limiting"
                secondary="Protection against brute force attacks and API abuse"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Shield style={{ marginRight: 8 }} /> 4. Your Data Protection Rights (GDPR)
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Right of Access (Article 15)"
                secondary="Request a copy of all personal data we hold about you - available via 'Export Data' in your account settings"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Right to Rectification (Article 16)"
                secondary="Correct any inaccurate or incomplete personal data"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Right to Erasure (Article 17)"
                secondary="Request deletion of your personal data - available via 'Delete Account' in settings"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Right to Restrict Processing (Article 18)"
                secondary="Request limitation of how we process your data"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Right to Data Portability (Article 20)"
                secondary="Receive your data in a structured, machine-readable format"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Right to Object (Article 21)"
                secondary="Object to processing based on legitimate interests or direct marketing"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Right to Withdraw Consent"
                secondary="Withdraw consent at any time where processing is based on consent"
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Exercise Your Rights:</strong> You can exercise most of these rights directly through your account settings.
              For other requests, contact us at privacy@processity.com. We will respond within 30 days as required by GDPR.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Clock style={{ marginRight: 8 }} /> 5. Data Retention Policy
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="Account Data"
                secondary="Retained for the duration of your account plus 30 days grace period after deletion request"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Task Data"
                secondary="Retained until you delete tasks or close your account"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Audit Logs"
                secondary="Retained for 7 years for security and compliance purposes, then automatically deleted"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytics Data"
                secondary="Anonymized data retained for 2 years for service improvement"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Backup Data"
                secondary="Included in automated backups for 90 days, then permanently deleted"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            6. Data Sharing and Third Parties
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>We do not sell, trade, or rent your personal data to third parties.</strong>
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Service Providers We Work With:</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Microsoft Azure"
                secondary="Cloud hosting and infrastructure services (Privacy Statement: https://privacy.microsoft.com/)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="MongoDB Atlas"
                secondary="Database hosting and management (Privacy Policy: https://www.mongodb.com/legal/privacy-policy)"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Data Processing Agreements:</Typography>
          <Typography variant="body2" paragraph>
            All third-party service providers have signed Data Processing Agreements (DPAs) ensuring GDPR compliance
            and appropriate safeguards for your personal data.
          </Typography>
        </CardContent>
      </Card>

      {/* Compliance and Certifications */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            7. Compliance and Certifications
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Standards We Follow:</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="GDPR (General Data Protection Regulation)"
                secondary="Full compliance with EU data protection laws"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="OWASP Security Standards"
                secondary="Following OWASP Top 10 security best practices"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="SOC 2 Type II"
                secondary="Our cloud infrastructure providers maintain SOC 2 Type II certification"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="ISO 27001"
                secondary="Information security management standards through our service providers"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Contact and Updates */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            8. Contact Information and Updates
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Contact Us:</Typography>
          <Typography variant="body2" paragraph>
            <strong>Data Protection Officer:</strong> abc@xyz.com<br />
            <strong>Privacy Questions:</strong> abc@xyz.com<br />
            <strong>General Support:</strong> abc@xyz.com<br />
            <strong>Security Issues:</strong> abc@xyz.com
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Policy Updates:</Typography>
          <Typography variant="body2" paragraph>
            We may update this Privacy Policy to reflect changes in our practices or legal requirements.
            We will notify you of significant changes via email or through the application.
            Continued use of the service after changes indicates acceptance of the updated policy.
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Supervisory Authority:</Typography>
          <Typography variant="body2" paragraph>
            If you believe we have not addressed your privacy concerns adequately, you have the right to lodge a complaint
            with your local data protection supervisory authority.
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body2" color="text.secondary">
          This Privacy Policy demonstrates our commitment to protecting your personal data and complying with international privacy laws.
          <br />
          For questions about this policy or our data practices, please contact our Data Protection Officer at abc@xyz.com
        </Typography>
      </Box>
    </Container>
  );
};
