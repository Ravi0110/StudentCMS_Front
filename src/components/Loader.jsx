import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

/**
 * Full-page or inline loading spinner.
 */
const Loader = ({ text = 'Loading…', fullPage = false, size = 44 }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullPage && {
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          backgroundColor:
            theme.palette.mode === 'light'
              ? 'rgba(247,249,252,0.85)'
              : 'rgba(15,23,36,0.85)',
          backdropFilter: 'blur(4px)',
        }),
        ...(!fullPage && {
          py: 6,
        }),
      }}
    >
      <CircularProgress
        size={size}
        thickness={3}
        sx={{ color: theme.palette.primary.main }}
      />
      {text && (
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
