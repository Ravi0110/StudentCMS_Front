import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  alpha,
  useTheme,
  Tabs,
  Tab,
  ButtonGroup,
  InputAdornment,
} from '@mui/material';
import {
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
} from '@mui/icons-material';
import { PageHeader, SearchableSelect, CustomDatePicker } from '../../components';
import { useNotification } from '../../hooks';
import attendanceService from '../../services/attendanceService';

const AttendancePage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // ─── Filters State ──────────────────────────────────────────
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [selectedDate, setSelectedDate] = useState('2024-10-24');

  // ─── Attendance Data State ──────────────────────────────────
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ─── Options (Mock) ─────────────────────────────────────────
  const classOptions = ['Class 10', 'Class 9', 'Class 8'];
  const sectionOptions = ['Section A', 'Section B', 'Section C'];

  const fetchStudents = () => {
    // Mock data based on screenshot
    const mockData = [
      { id: '1', rollNo: '01', name: 'Alexander Wright', admissionNo: 'ADM-2023-001', status: 'Present', remarks: '', avatar: '' },
      { id: '2', rollNo: '02', name: 'Chloe Chen', admissionNo: 'ADM-2023-002', status: 'Present', remarks: '', avatar: '' },
      { id: '3', rollNo: '03', name: 'David Osei', admissionNo: 'ADM-2023-003', status: 'Absent', remarks: 'Sick leave', avatar: '' },
      { id: '4', rollNo: '04', name: 'Emma Thompson', admissionNo: 'ADM-2023-004', status: 'Present', remarks: '', avatar: '' },
      { id: '5', rollNo: '05', name: 'Liam Wilson', admissionNo: 'ADM-2023-005', status: 'Present', remarks: '', avatar: '' },
    ];
    setStudents(mockData);
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSection, selectedDate]);

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const handleRemarksChange = (id, newRemarks) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, remarks: newRemarks } : s));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: 'Present' })));
    notify('All students marked as present', 'info');
  };

  const handleSave = () => {
    notify('Attendance saved successfully', 'success');
  };

  // Stats Calculation
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'Present').length;
  const absentCount = students.filter(s => s.status === 'Absent').length;
  const attendancePercentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : 0;

  return (
    <Box>
      <PageHeader
        title="Take Attendance"
        subtitle="Mark daily attendance for your students."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Attendance' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, bgcolor: '#2563eb' }}
          >
            Save Attendance
          </Button>
        }
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 140 },
          }}
        >
          <Tab label="Take Attendance" />
          <Tab label="Attendance Report" />
        </Tabs>
      </Box>

      {/* Filters Section */}
      <Card sx={{ borderRadius: 4, mb: 4, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={3}>
              <SearchableSelect
                label="Class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                options={classOptions.map(c => ({ value: c, label: c }))}
                placeholder="Select Class"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SearchableSelect
                label="Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                options={sectionOptions.map(s => ({ value: s, label: s }))}
                placeholder="Select Section"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CustomDatePicker
                label="Date"
                selected={selectedDate ? new Date(selectedDate) : null}
                onChange={(date) => setSelectedDate(date.toISOString().split('T')[0])}
                placeholder="Select Date"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={markAllPresent}
                sx={{
                  borderRadius: 2,
                  height: 40,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: theme.palette.divider,
                  color: 'text.primary',
                }}
              >
                Mark All Present
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Students', value: 32, color: 'text.primary' },
          { label: 'Present', value: presentCount || '-', color: theme.palette.success.main },
          { label: 'Absent', value: absentCount, color: '#ef4444' }, // Pure Red as in screenshot
          { label: 'Attendance %', value: `${attendancePercentage}%`, color: 'text.primary' },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderRadius: 4, height: '100%', boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight={700} sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Attendance Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.action.hover, 0.02) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>ROLL NO</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>STUDENT NAME</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>ADMISSION NO</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary' }}>REMARKS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const isAbsent = student.status === 'Absent';
              return (
                <TableRow
                  key={student.id}
                  sx={{
                    bgcolor: isAbsent ? alpha('#ef4444', 0.02) : 'inherit',
                    '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.04) },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{student.rollNo}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={student.avatar}
                        sx={{ width: 32, height: 32, bgcolor: isAbsent ? '#fee2e2' : '#e0e7ff' }}
                      >
                        {student.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={700}>
                        {student.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{student.admissionNo}</TableCell>
                  <TableCell>
                    <ButtonGroup size="small" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <Button
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        startIcon={student.status === 'Present' ? <PresentIcon sx={{ fontSize: '14px !important' }} /> : null}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          px: 2,
                          bgcolor: student.status === 'Present' ? '#10b981' : alpha(theme.palette.grey[200], 0.2),
                          color: student.status === 'Present' ? '#fff' : 'text.disabled',
                          borderColor: 'transparent !important',
                          '&:hover': { bgcolor: student.status === 'Present' ? '#059669' : alpha(theme.palette.grey[200], 0.4) },
                        }}
                      >
                        Present
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        startIcon={student.status === 'Absent' ? <AbsentIcon sx={{ fontSize: '14px !important' }} /> : null}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          px: 2,
                          bgcolor: student.status === 'Absent' ? '#ef4444' : alpha(theme.palette.grey[200], 0.2),
                          color: student.status === 'Absent' ? '#fff' : 'text.disabled',
                          borderColor: 'transparent !important',
                          '&:hover': { bgcolor: student.status === 'Absent' ? '#dc2626' : alpha(theme.palette.grey[200], 0.4) },
                        }}
                      >
                        Absent
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add remark..."
                      value={student.remarks}
                      onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: isAbsent ? alpha('#fecaca', 0.1) : '#fff',
                          fontSize: '0.75rem',
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendancePage;
