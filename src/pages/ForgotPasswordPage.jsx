import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button,
  Alert, InputAdornment, useTheme,
  CircularProgress, TextField, Link
} from '@mui/material';
import { MailOutline, School, ArrowBack } from '@mui/icons-material';

const ForgotPasswordPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ identifier: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setError(null);
  };

  const validate = () => {
    const errs = {};
    if (!form.identifier) errs.identifier = 'Email or phone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setSuccessMsg('');
    setError(null);
    
    try {
      // Mock API call for sending reset link
      // await authService.forgotPassword(form.identifier);
      
      setTimeout(() => {
        setSuccessMsg(`We've sent a password reset link to ${form.identifier}. Please check your inbox.`);
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: theme.palette.mode === 'light' ? '#eff6ff' : theme.palette.background.default, // Light blue background
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'light' ? '0 10px 40px rgba(0,0,0,0.04)' : 'none',
          border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
        }}
      >
        <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <School sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              EduAdmin Pro
            </Typography>
          </Box>

          {/* Titles */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: '1.75rem' }}>
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email or phone number and we'll send you instructions to reset your password.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {successMsg ? (
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {successMsg}
              </Alert>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                size="large"
                sx={{
                  py: 1.4,
                  borderRadius: 2.5,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                }}
              >
                Return to Sign In
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Identifier Input */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Email or Phone
                </Typography>
                <TextField
                  fullWidth
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  error={!!errors.identifier}
                  helperText={errors.identifier}
                  placeholder="Enter your email or phone number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutline fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2.5 },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.4,
                  borderRadius: 2.5,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Send reset link'
                )}
              </Button>
            </form>
          )}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
             <Link
                component={RouterLink}
                to="/login"
                variant="body2"
                fontWeight={600}
                color="primary.main"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
              >
                <ArrowBack fontSize="small" />
                Back to Login
              </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;
