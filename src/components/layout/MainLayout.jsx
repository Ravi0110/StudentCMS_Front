import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, useTheme, useMediaQuery, Snackbar, Alert } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import config from '../../config';
import { useNotification } from '../../hooks';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useSelector((s) => s.ui);
  const { snackbar } = useSelector((s) => s.ui);
  const { close } = useNotification();

  const drawerWidth = sidebarOpen ? config.SIDEBAR_WIDTH : config.SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
          ml: isMobile ? 0 : 0,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Header />
        {/* Toolbar spacer */}
        <Box sx={{ height: 64 }} />
        {/* Page content */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            maxWidth: 1400,
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* ── Global Snackbar ──────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={close}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={close}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainLayout;
