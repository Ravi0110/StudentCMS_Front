import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  MenuItem,
  useTheme,
  alpha,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { PageHeader } from '../../components';
import { useNotification } from '../../hooks';
import timetableService from '../../services/timetableService';

const TimetablePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { notify } = useNotification();

  // ─── State ──────────────────────────────────────────────────
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('c1');

  // ─── Mock Data for Grid ───────────────────────────────────
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 10:30 AM', // Break
    '10:30 AM - 11:30 AM',
  ];

  const subjectColors = {
    'Mathematics': '#2563eb', // Blue
    'English': '#7c3aed',     // Purple
    'Science': '#10b981',     // Green
    'History': '#d97706',     // Orange
    'Physical Ed.': '#ef4444', // Red
    'Physics': '#3b82f6',
    'Break': '#f3f4f6',      // Light Gray
  };

  const mockTimetable = {
    '08:00 AM - 09:00 AM': {
      'Monday': { subject: 'Mathematics', teacher: 'Eleanor Rigby', classInfo: '10 - A' },
      'Thursday': { subject: 'Mathematics', teacher: 'Eleanor Rigby', classInfo: '10 - A' },
      'Friday': { subject: 'History', teacher: 'John Doe', classInfo: '10 - A' },
    },
    '09:00 AM - 10:00 AM': {
      'Monday': { subject: 'English', teacher: 'Mei Lin', classInfo: '10 - A' },
      'Tuesday': { subject: 'Mathematics', teacher: 'Eleanor Rigby', classInfo: '10 - A' },
      'Wednesday': { subject: 'Science', teacher: 'David Miller', classInfo: '10 - A' },
      'Thursday': { subject: 'English', teacher: 'Mei Lin', classInfo: '10 - A' },
      'Friday': { subject: 'Physical Ed.', teacher: 'Sarah Connor', classInfo: '10 - A' },
    },
    '10:00 AM - 10:30 AM': {
      'Monday': { subject: 'Break', teacher: '-', isBreak: true },
      'Tuesday': { subject: 'Break', teacher: '-', isBreak: true },
      'Wednesday': { subject: 'Break', teacher: '-', isBreak: true },
      'Thursday': { subject: 'Break', teacher: '-', isBreak: true },
      'Friday': { subject: 'Break', teacher: '-', isBreak: true },
    },
    '10:30 AM - 11:30 AM': {
      'Monday': { subject: 'Science', teacher: 'David Miller', classInfo: '10 - A' },
      'Tuesday': { subject: 'English', teacher: 'Mei Lin', classInfo: '10 - A' },
      'Wednesday': { subject: 'Physical Ed.', teacher: 'Sarah Connor', classInfo: '10 - A' },
      'Thursday': { subject: 'Physical Ed.', teacher: 'Sarah Connor', classInfo: '10 - A' },
      'Friday': { subject: 'Mathematics', teacher: 'Eleanor Rigby', classInfo: '10 - A' },
    },
  };

  // ─── Select Options ───────────────────────────────────────
  const classOptions = [{ _id: 'c1', name: 'Class 10' }, { _id: 'c2', name: 'Class 9' }];

  useEffect(() => {
    // Initial fetch
    setTimetable(mockTimetable);
  }, [selectedClassId]);

  const handleAddSlot = () => navigate('/timetable/add');

  return (
    <Box>
      <PageHeader
        title="Timetable Management"
        subtitle="Organize and Manage schedule for classes."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Timetable' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSlot}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Add Time Slot
          </Button>
        }
      />

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          select
          size="small"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: alpha(theme.palette.action.hover, 0.04) } }}
        >
          {classOptions.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
        </TextField>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.action.hover, 0.02) }}>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center', width: 140 }}>Time</TableCell>
              {days.map((day) => (
                <TableCell key={day} sx={{ fontWeight: 700, textAlign: 'center' }}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((time) => (
              <TableRow key={time}>
                <TableCell sx={{ fontWeight: 600, color: 'text.secondary', textAlign: 'center', py: 3 }}>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                    {time.split(' - ')[0]}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                    {time.split(' - ')[1]}
                  </Typography>
                </TableCell>

                {days.map((day) => {
                  const slot = timetable[time]?.[day];
                  if (!slot) return <TableCell key={day} sx={{ borderLeft: `1px solid ${theme.palette.divider}` }} />;

                  if (slot.isBreak) {
                    return (
                      <TableCell key={day} sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5), textAlign: 'center', borderLeft: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="caption" fontWeight={700} color="text.disabled">
                          RECESS / BREAK
                        </Typography>
                      </TableCell>
                    );
                  }

                  const bgColor = subjectColors[slot.subject] || theme.palette.primary.main;

                  return (
                    <TableCell key={day} sx={{ px: 1, py: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                      <Card
                        sx={{
                          p: 1.5,
                          bgcolor: bgColor,
                          color: '#fff',
                          borderRadius: 2,
                          boxShadow: 'none',
                          minHeight: 80,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'scale(1.02)' }
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700}>
                          {slot.subject}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>
                          {slot.teacher}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, fontSize: '0.65rem' }}>
                          {slot.classInfo}
                        </Typography>
                      </Card>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimetablePage;
