import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Grid,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { PageHeader, SearchableSelect, CustomDatePicker } from '../../components';
import { useNotification } from '../../hooks';
import timetableService from '../../services/timetableService';

const TimetableFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { notify } = useNotification();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    classId: '',
    sectionId: '',
    subject: '',
    teacher: '',
    day: '',
    startTime: '08:00',
    endTime: '09:00',
  });
  const [formErrors, setFormErrors] = useState({});

  // ─── Options ──────────────────────────────────────────
  const classOptions = [{ _id: 'c1', name: 'Class 10' }, { _id: 'c2', name: 'Class 9' }];
  const sectionOptions = [{ _id: 's1', name: 'Section A' }, { _id: 's2', name: 'Section B' }];
  const subjectOptions = ['Mathematics', 'Science', 'English', 'History', 'Physical Ed.'];
  const teacherOptions = ['Eleanor Rigby', 'Mei Lin', 'David Miller', 'John Doe', 'Sarah Connor'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (isEdit) {
      // Mock fetch
      setFormData({
        classId: 'c1',
        sectionId: 's1',
        subject: 'Mathematics',
        teacher: 'Eleanor Rigby',
        day: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.classId) errs.classId = 'Class is required';
    if (!formData.day) errs.day = 'Day is required';
    if (!formData.subject) errs.subject = 'Subject is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));
      notify('Timetable slot saved successfully', 'success');
      navigate('/timetable');
    } catch (err) {
      notify('Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Edit Schedule Slot' : 'Add Time Slot'}
        subtitle="Define a new academic period with specific subject, teacher, and timing."
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Timetable', path: '/timetable' },
          { label: isEdit ? 'Edit Slot' : 'Add Slot' },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate('/timetable')}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
        }
      />

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 1.6, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Slot Information
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Class"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  options={classOptions.map(c => ({ value: c._id, label: c.name }))}
                  placeholder="Select Class"
                  error={formErrors.classId}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Section"
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  options={sectionOptions.map(s => ({ value: s._id, label: s.name }))}
                  placeholder="Select Section"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  options={subjectOptions.map(s => ({ value: s, label: s }))}
                  placeholder="Select Subject"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Teacher"
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  options={teacherOptions.map(t => ({ value: t, label: t }))}
                  placeholder="Select Teacher"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <SearchableSelect
                  label="Day"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  options={days.map(d => ({ value: d, label: d }))}
                  placeholder="Select Day"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomDatePicker
                  label="Start Time"
                  selected={formData.startTime ? new Date(`2000-01-01T${formData.startTime}`) : null}
                  onChange={(date) => setFormData(p => ({ ...p, startTime: date.toTimeString().split(' ')[0].substring(0,5) }))}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholder="Select Start Time"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomDatePicker
                  label="End Time"
                  selected={formData.endTime ? new Date(`2000-01-01T${formData.endTime}`) : null}
                  onChange={(date) => setFormData(p => ({ ...p, endTime: date.toTimeString().split(' ')[0].substring(0,5) }))}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholder="Select End Time"
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/timetable')}
                    sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                  >
                    Discard
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{ borderRadius: 2, px: 4, fontWeight: 700, textTransform: 'none' }}
                  >
                    Save Slot
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimetableFormPage;
