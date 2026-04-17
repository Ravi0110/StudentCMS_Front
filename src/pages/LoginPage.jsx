import { useState } from 'react';
import { useNavigate, Link as RouterLink, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, Button,
  Alert, IconButton, InputAdornment, useTheme,
  CircularProgress, TextField, Link
} from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined, MailOutline, LockOutlined, School } from '@mui/icons-material';
import { loginUser, loginAdmin, clearError } from '../app/slices/authSlice';

const LoginPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    if (error) dispatch(clearError());
  };

  const validate = () => {
    const errs = {};
    if (!form.identifier) errs.identifier = 'Email or phone is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Map identifier to email for backend compatibility, or backend should handle it
    const credentials = { email: form.identifier, password: form.password };
    
    const action = isAdmin ? loginAdmin : loginUser;
    const result = await dispatch(action(credentials));
    if (action.fulfilled.match(result)) {
      navigate('/dashboard');
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
              {isAdmin ? 'Master Admin' : 'Welcome back'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isAdmin 
                ? 'Sign in to manage schools and institutions' 
                : 'Please enter your details to sign in.'
              }
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
             <Button 
                fullWidth 
                variant="outlined" 
                size="small"
                onClick={() => setIsAdmin(!isAdmin)}
                sx={{ borderRadius: 2 }}
             >
                {isAdmin ? 'Switch to School Login' : 'Switch to Master Admin'}
             </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Identifier Input */}
            <Box sx={{ mb: 3 }}>
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

            {/* Password Input */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'text.primary' }}>
                  Password
                </Typography>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="caption"
                  color="primary.main"
                  fontWeight={600}
                  underline="hover"
                >
                  Forgot password?
                </Link>
              </Box>
              <TextField
                fullWidth
                name="password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                placeholder="••••••••"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPwd(!showPwd)}
                        edge="end"
                      >
                        {showPwd ? <VisibilityOutlined fontSize="small" /> : <VisibilityOffOutlined fontSize="small" />}
                      </IconButton>
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
                'Sign In'
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="caption" color="text.secondary">
              Having trouble logging in?{' '}
              <Link href="#" underline="hover" fontWeight={600} color="primary.main">
                Contact IT Support
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
