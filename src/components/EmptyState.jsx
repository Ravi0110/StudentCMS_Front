import { Box, Typography, Button, useTheme } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';

/**
 * Empty-state placeholder for lists/tables with no data.
 */
const EmptyState = ({
  title = 'No data found',
  description = 'There are no records to display at the moment.',
  icon: Icon = InboxOutlined,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: theme.palette.custom.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Icon sx={{ fontSize: 40, color: theme.palette.text.secondary }} />
      </Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 360, mb: actionLabel ? 3 : 0 }}
      >
        {description}
      </Typography>
      {actionLabel && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
