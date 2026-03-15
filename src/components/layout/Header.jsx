import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, IconButton, Typography,
  Badge, Avatar, Tooltip, Menu, MenuItem,
  ListItemIcon, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import {
  MenuOpen as MenuOpenIcon,
  Notifications as NotifIcon,
  DarkMode, LightMode, Logout, Person,
  Settings, Search as SearchIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { toggleMobileSidebar } from '../../app/slices/uiSlice';
import { logout } from '../../app/slices/authSlice';
import { useThemeMode } from '../../context/ThemeContext';
import { getInitials } from '../../utils';
import SearchBar from '../SearchBar';
import config from '../../config';

const Header = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeMode();
  const { user } = useSelector((s) => s.auth);
  const { sidebarOpen } = useSelector((s) => s.ui);

  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');

  const drawerWidth = sidebarOpen ? config.SIDEBAR_WIDTH : config.SIDEBAR_COLLAPSED_WIDTH;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        ml: isMobile ? 0 : `${drawerWidth}px`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* ── Mobile menu toggle ──────────────────────────── */}
        {isMobile && (
          <IconButton
            edge="start"
            onClick={() => dispatch(toggleMobileSidebar())}
          >
            <MenuOpenIcon />
          </IconButton>
        )}

        {/* ── Search ─────────────────────────────────────── */}
        <Box sx={{ flex: 1, maxWidth: 420, display: { xs: 'none', sm: 'block' } }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search students, teachers, classes…"
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* ── Actions ────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Theme toggle */}
          <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton onClick={toggleTheme} size="small">
              {mode === 'light' ? (
                <DarkMode sx={{ fontSize: 20 }} />
              ) : (
                <LightMode sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton size="small">
              <Badge badgeContent={5} color="error" max={9}>
                <NotifIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Account">
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ ml: 0.5 }}
            >
              <Avatar
                src={user?.avatar}
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  bgcolor: theme.palette.primary.main,
                }}
              >
                {getInitials(user?.name || 'User')}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* User info (desktop only) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', ml: 0.5 }}>
            <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" lineHeight={1.2}>
              {user?.role || 'School Admin'}
            </Typography>
          </Box>
        </Box>

        {/* ── Profile Menu ───────────────────────────────── */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email || 'user@school.edu'}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); setAnchorEl(null); }}>
            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
