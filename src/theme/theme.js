import { createTheme, alpha } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';

// ─── Theme Factory ───────────────────────────────────────────────
// Returns a fully configured MUI theme for the given mode.

const getTheme = (mode = 'light') => {
  const colors = palette[mode];

  return createTheme({
    palette: {
      mode,
      ...colors,
    },
    typography,
    shape: {
      borderRadius: 10,
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgba(0,0,0,0.05)',
      '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.05)',
      '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)',
      '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
      '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.05)',
      ...Array(19).fill('0 25px 50px -12px rgba(0,0,0,0.15)'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
          html: {
            scrollBehavior: 'smooth',
          },
          body: {
            backgroundColor: colors.background.default,
            color: colors.text.primary,
          },
          '::-webkit-scrollbar': {
            width: 6,
            height: 6,
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '::-webkit-scrollbar-thumb': {
            background: alpha(colors.text.secondary, 0.2),
            borderRadius: 3,
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: alpha(colors.text.secondary, 0.35),
          },
        },
      },

      // ── Card ─────────────────────────────────────────────────
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            borderRadius: 14,
            border: `1px solid ${colors.divider}`,
            backgroundColor: colors.custom.card,
            transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            },
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '20px 24px',
            '&:last-child': {
              paddingBottom: 20,
            },
          },
        },
      },

      // ── Buttons ──────────────────────────────────────────────
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 20px',
            fontWeight: 600,
            transition: 'all 0.2s ease-in-out',
          },
          contained: {
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            },
          },
          outlined: {
            borderColor: colors.divider,
            '&:hover': {
              borderColor: colors.primary.main,
              backgroundColor: alpha(colors.primary.main, 0.04),
            },
          },
          text: {
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.06),
            },
          },
          sizeSmall: {
            padding: '5px 14px',
            fontSize: '0.8125rem',
          },
          sizeLarge: {
            padding: '11px 28px',
            fontSize: '0.9375rem',
          },
        },
      },

      // ── Icon Button ──────────────────────────────────────────
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.06),
            },
          },
        },
      },

      // ── Inputs ───────────────────────────────────────────────
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: colors.custom.input,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.divider,
              transition: 'border-color 0.2s ease-in-out',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(colors.primary.main, 0.4),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
          input: {
            padding: '12px 14px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: colors.text.secondary,
            fontWeight: 500,
            fontSize: '0.875rem',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },

      // ── Paper ────────────────────────────────────────────────
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },

      // ── Chip ─────────────────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: alpha(colors.primary.main, 0.08),
            color: colors.primary.main,
          },
          colorSuccess: {
            backgroundColor: alpha(colors.success.main, 0.08),
            color: colors.success.main,
          },
          colorWarning: {
            backgroundColor: alpha(colors.warning.main, 0.08),
            color: colors.warning.main,
          },
          colorError: {
            backgroundColor: alpha(colors.error.main, 0.08),
            color: colors.error.main,
          },
        },
      },

      // ── Table ────────────────────────────────────────────────
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: colors.text.secondary,
              backgroundColor: colors.custom.muted,
              borderBottom: `1px solid ${colors.divider}`,
              padding: '12px 16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.divider}`,
            padding: '14px 16px',
            fontSize: '0.875rem',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.15s ease-in-out',
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.02),
            },
          },
        },
      },

      // ── Dialog ───────────────────────────────────────────────
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `1px solid ${colors.divider}`,
          },
        },
      },

      // ── Tooltip ──────────────────────────────────────────────
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 500,
            padding: '6px 12px',
          },
        },
      },

      // ── Drawer ───────────────────────────────────────────────
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: 'none',
          },
        },
      },

      // ── Avatar ───────────────────────────────────────────────
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            fontSize: '0.875rem',
          },
        },
      },

      // ── Badge ────────────────────────────────────────────────
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontWeight: 600,
            fontSize: '0.6875rem',
          },
        },
      },

      // ── List ─────────────────────────────────────────────────
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'all 0.15s ease-in-out',
            '&.Mui-selected': {
              backgroundColor: colors.custom.sidebarPrimary,
              color: colors.custom.sidebarPrimaryForeground,
              '& .MuiListItemIcon-root': {
                color: colors.custom.sidebarPrimaryForeground,
              },
              '&:hover': {
                backgroundColor: colors.custom.sidebarPrimary,
              },
            },
            '&:hover': {
              backgroundColor: colors.custom.sidebarHover,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 40,
            color: colors.text.secondary,
          },
        },
      },
    },
  });
};

export default getTheme;
