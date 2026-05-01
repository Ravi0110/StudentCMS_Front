import { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Typography, IconButton, Tooltip,
  Divider, useTheme, useMediaQuery, alpha,
} from '@mui/material';
import {
  Dashboard, School, Person, People, Class as ClassIcon,
  MenuBook, Assignment, Event, CalendarToday, Campaign,
  Schedule, FactCheck, Settings, AdminPanelSettings, Group,
  Layers, Circle, ChevronLeft, ChevronRight,
} from '@mui/icons-material';
import { toggleSidebar, setMobileSidebarOpen } from '../../app/slices/uiSlice';
import { fetchAccessibleMenus } from '../../app/slices/authSlice';
import config from '../../config';

// ─── Icon registry ──────────────────────────────────────────────
const iconMap = {
  Dashboard, School, Person, People, Class: ClassIcon,
  MenuBook, Assignment, Event, CalendarToday, Campaign,
  Schedule, FactCheck, Settings, AdminPanelSettings, Group,
  Layers, Circle,
};

const resolveIcon = (iconName) => {
  const mapping = {
    dashboard: 'Dashboard',
    school: 'School',
    person: 'Person',
    people: 'People',
    class: 'Class',
    book: 'MenuBook',
    assignment: 'Assignment',
    event: 'Event',
    calendar: 'CalendarToday',
    announcement: 'Campaign',
    campaign: 'Campaign',
    schedule: 'Schedule',
    attendance: 'FactCheck',
    homework: 'Assignment',
    timetable: 'Schedule',
    settings: 'Settings',
    admin: 'AdminPanelSettings',
    users: 'Group',
    sections: 'Layers',
    layers: 'Layers',
    classes: 'Class',
    students: 'School',
    teachers: 'Person',
    parents: 'People',
    schools: 'School',
    myclasses: 'Class',
  };
  const key = mapping[iconName?.toLowerCase()] || 'Circle';
  return iconMap[key] || Circle;
};



const Sidebar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { sidebarOpen, sidebarMobileOpen } = useSelector((s) => s.ui);
  const { user, menuItems: backendMenu, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user && isAuthenticated && (!backendMenu || backendMenu.length === 0)) {
      dispatch(fetchAccessibleMenus());
    }
  }, [dispatch, user, isAuthenticated, backendMenu?.length]);

  const menuItems = useMemo(() => {
    return backendMenu || [];
  }, [backendMenu]);
  const drawerWidth = sidebarOpen ? config.SIDEBAR_WIDTH : config.SIDEBAR_COLLAPSED_WIDTH;

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) dispatch(setMobileSidebarOpen(false));
  };

  // ── Content ─────────────────────────────────────────────────
  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.custom.sidebar,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* ── Brand ──────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          px: sidebarOpen ? 2.5 : 0,
          py: 2,
          minHeight: 64,
        }}
      >
        {sidebarOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, #7c3aed)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <School sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, #7c3aed)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              {config.APP_NAME}
            </Typography>
          </Box>
        )}

        {!isMobile && (
          <IconButton
            size="small"
            onClick={() => dispatch(toggleSidebar())}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              width: 28,
              height: 28,
            }}
          >
            {sidebarOpen ? (
              <ChevronLeft fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* ── Menu ───────────────────────────────────────────── */}
      <List
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 1.5,
          py: 1,
        }}
      >
        {menuItems.map((item) => {
          const Icon = resolveIcon(item.icon);
          const isActive = location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');

          return (
            <Tooltip
              key={item.path}
              title={sidebarOpen ? '' : item.name}
              placement="right"
              arrow
            >
              <ListItemButton
                selected={isActive}
                onClick={() => handleNav(item.path)}
                sx={{
                  mb: 0.5,
                  minHeight: 44,
                  justifyContent: sidebarOpen ? 'initial' : 'center',
                  px: sidebarOpen ? 2 : 1.5,
                  borderRadius: 2.5,
                  transition: 'all 0.15s ease',
                  ...(isActive && {
                    backgroundColor: theme.palette.custom.sidebarPrimary,
                    color: theme.palette.custom.sidebarPrimaryForeground,
                    fontWeight: 600,
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.custom.sidebarPrimaryForeground,
                    },
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 2 : 0,
                    justifyContent: 'center',
                    color: isActive
                      ? theme.palette.custom.sidebarPrimaryForeground
                      : theme.palette.text.secondary,
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  // ── Responsive Drawer ───────────────────────────────────────
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={sidebarMobileOpen}
        onClose={() => dispatch(setMobileSidebarOpen(false))}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: config.SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
