import { Box } from '@mui/material';
import { PageHeader, EmptyState } from '../../components';
import { FactCheck } from '@mui/icons-material';

const AttendancePage = () => {
  return (
    <Box>
      <PageHeader
        title="Attendance Management"
        subtitle="Mark, track, and review student attendance records."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Attendance' }]}
      />
      <EmptyState
        title="Attendance Logs"
        description="Select a class and date to view or mark attendance."
        actionLabel="Mark Attendance"
        icon={FactCheck}
      />
    </Box>
  );
};

export default AttendancePage;
