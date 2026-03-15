import { Box, Typography, Breadcrumbs, Link, useTheme } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Reusable page header with title, subtitle, breadcrumbs, and actions slot.
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 3,
        ...sx,
      }}
    >
      <Box>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{ mb: 0.5 }}
          >
            {breadcrumbs.map((crumb, i) =>
              crumb.path ? (
                <Link
                  key={i}
                  component={RouterLink}
                  to={crumb.path}
                  underline="hover"
                  color="text.secondary"
                  sx={{ fontSize: '0.8125rem' }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography
                  key={i}
                  color="text.primary"
                  sx={{ fontSize: '0.8125rem', fontWeight: 500 }}
                >
                  {crumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}
        <Typography variant="h2" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {actions && (
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>
      )}
    </Box>
  );
};

export default PageHeader;
