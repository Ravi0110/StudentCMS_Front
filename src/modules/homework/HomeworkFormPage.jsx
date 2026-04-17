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
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
  FileUploadOutlined as UploadIcon,
} from '@mui/icons-material';
import { PageHeader, SearchableSelect, CustomDatePicker } from '../../components';
import { useNotification } from '../../hooks';
import homeworkService from '../../services/homeworkService';

const HomeworkFormPage = () => {
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
    dueDate: '',
    title: '',
    description: '',
    attachment: null,
  });
  const [formErrors, setFormErrors] = useState({});

  // ─── Options ──────────────────────────────────────────
  const classOptions = [
    { _id: 'c1', name: 'Grade 10' },
    { _id: 'c2', name: 'Grade 9' },
    { _id: 'c3', name: 'Grade 8' },
  ];
  const sectionOptions = [
    { _id: 's1', name: 'Section A' },
    { _id: 's2', name: 'Section B' },
    { _id: 's3', name: 'Section C' },
  ];
  const subjectOptions = ['Mathematics', 'Science', 'English', 'History', 'Physics'];

  useEffect(() => {
    if (isEdit) {
      fetchHomeworkDetails();
    }
  }, [id]);

  const fetchHomeworkDetails = async () => {
    try {
      setLoading(true);
      // Mock fetch
      setTimeout(() => {
          setFormData({
            classId: 'c1',
            sectionId: 's1',
            subject: 'Mathematics',
            dueDate: '2024-10-24',
            title: 'Algebra Linear Equations',
            description: 'Please complete exercises 1 to 10 from Chapter 5.',
            attachment: null,
          });
          setLoading(false);
      }, 500);
    } catch (err) {
      notify('Failed to load homework details', 'error');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
    if (formErrors.dueDate) setFormErrors((prev) => ({ ...prev, dueDate: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.classId) errs.classId = 'Class is required';
    if (!formData.sectionId) errs.sectionId = 'Section is required';
    if (!formData.subject) errs.subject = 'Subject is required';
    if (!formData.title.trim()) errs.title = 'Title is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      // Simulate API
      await new Promise(r => setTimeout(r, 1000));
      notify(isEdit ? 'Homework updated successfully' : 'Homework published successfully', 'success');
      navigate('/homework');
    } catch (err) {
      notify(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Edit Homework' : 'Create Homework'}
        subtitle={isEdit ? 'Modify the specifics of this assignment.' : 'Design and publish a new academic task for your students.'}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Homework', path: '/homework' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
        actions={
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate('/homework')}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Back to List
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Assignment Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Homework Title
                </Typography>
                <TextField
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Chapter 5: Advanced Algebra"
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Description / Instructions
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Outline the homework requirements, reference materials, and expectations..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Attachments & Resources
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 160,
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    bgcolor: alpha(theme.palette.action.hover, 0.02),
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                    },
                  }}
                >
                  <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1.5 }} />
                  <Typography variant="body1" color="text.primary" fontWeight={600}>
                    Upload reference files or assignments
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports PDF, DOCX, Images (Max 20MB)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 4, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none', position: 'sticky', top: 24 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
              Publishing Info
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <SearchableSelect
                  label="Class"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  options={classOptions.map(c => ({ value: c._id, label: c.name }))}
                  placeholder="Select target class..."
                  error={formErrors.classId}
                />
              </Grid>

              <Grid item xs={12}>
                <SearchableSelect
                  label="Section"
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  options={sectionOptions.map(s => ({ value: s._id, label: s.name }))}
                  placeholder="Select target section..."
                  error={formErrors.sectionId}
                />
              </Grid>

              <Grid item xs={12}>
                <SearchableSelect
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  options={subjectOptions.map(s => ({ value: s, label: s }))}
                  placeholder="Select subject..."
                  error={formErrors.subject}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomDatePicker
                  label="Submission Deadline"
                  selected={formData.dueDate ? new Date(formData.dueDate) : null}
                  onChange={handleDateChange}
                  placeholder="Select due date..."
                  error={formErrors.dueDate}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: theme.shadows[4]
                  }}
                >
                  {loading ? 'Processing...' : (isEdit ? 'Update Assignment' : 'Publish Homework')}
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/homework')}
                  sx={{ mt: 1.5, textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                >
                  Discard Changes
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeworkFormPage;
