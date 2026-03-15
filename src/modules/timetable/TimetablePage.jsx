import { Box } from '@mui/material';
import { PageHeader, EmptyState } from '../../components';
import { Schedule } from '@mui/icons-material';

const TimetablePage = () => {
  return (
    <Box>
      <PageHeader
        title="Timetable"
        subtitle="Manage weekly class schedules and teacher assignments."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Timetable' }]}
      />
      <EmptyState
        title="No Timetable Created"
        description="Start scheduling classes, periods, and subjects for the current academic session."
        actionLabel="Create Schedule"
        icon={Schedule}
      />
    </Box>
  );
};

export default TimetablePage;
