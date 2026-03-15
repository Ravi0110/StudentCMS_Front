import { Box } from '@mui/material';
import { PageHeader, EmptyState } from '../../components';
import { Campaign } from '@mui/icons-material';

const AnnouncementsPage = () => {
  return (
    <Box>
      <PageHeader
        title="Announcements"
        subtitle="Manage and broadcast notifications to students and staff."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Announcements' }]}
      />
      <EmptyState
        title="No Recent Announcements"
        description="Share important updates, news, and alerts with the school community."
        actionLabel="Create Announcement"
        icon={Campaign}
      />
    </Box>
  );
};

export default AnnouncementsPage;
