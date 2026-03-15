import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  MenuItem,
  Grid,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  FileUploadOutlined as UploadIcon,
} from '@mui/icons-material';
import { PageHeader, DataTable, ConfirmDialog } from '../../components';
import { useNotification } from '../../hooks';
import homeworkService from '../../services/homeworkService';

const HomeworkPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // ─── Table State ──────────────────────────────────────────
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // ─── Dialog State ─────────────────────────────────────────
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
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

  // ─── Mock Data for Options ──────────────────────────────
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

  // ─── Delete State ─────────────────────────────────────────
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      // Mock data matching screenshot
      const mockData = [
        {
          _id: '1',
          title: 'Algebra Linear Equations',
          class: 'Grade 10',
          section: 'Section A',
          subject: 'Mathematics',
          dueDate: '24 Oct 2024',
          createdBy: 'Sarah Jenkins',
        },
        {
          _id: '2',
          title: 'Photosynthesis Deep Dive',
          class: 'Grade 9',
          section: 'Section B',
          subject: 'Science',
          dueDate: '25 Oct 2024',
          createdBy: 'Sarah Jenkins',
        },
        {
          _id: '3',
          title: 'World War II Essay',
          class: 'Grade 8',
          section: 'Section C',
          subject: 'History',
          dueDate: '28 Oct 2024',
          createdBy: 'Robert Davis',
        },
      ];
      setHomeworks(mockData);
      setTotalCount(mockData.length);
    } catch (error) {
      notify('Failed to fetch homework assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, [page, rowsPerPage, searchValue]);

  const handleOpenDialog = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data._id);
      setFormData({
        classId: data.classId || '',
        sectionId: data.sectionId || '',
        subject: data.subject || '',
        dueDate: data.dueDate || '',
        title: data.title || '',
        description: data.description || '',
        attachment: null,
      });
    } else {
      setIsEdit(false);
      setFormData({
        classId: '',
        sectionId: '',
        subject: '',
        dueDate: '',
        title: '',
        description: '',
        attachment: null,
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
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
      notify(isEdit ? 'Homework updated successfully' : 'Homework published successfully', 'success');
      handleCloseDialog();
      fetchHomeworks();
    } catch (err) {
      notify(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      notify('Homework assignment deleted', 'success');
      setOpenDeleteDialog(false);
      fetchHomeworks();
    } catch (err) {
      notify('Failed to delete', 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'title', label: 'TITLE', minWidth: 250, render: (val) => <strong>{val}</strong> },
    { id: 'class', label: 'CLASS', minWidth: 120 },
    { id: 'section', label: 'SECTION', minWidth: 120 },
    { id: 'subject', label: 'SUBJECT', minWidth: 150 },
    { id: 'dueDate', label: 'DUE DATE', minWidth: 150 },
    { id: 'createdBy', label: 'CREATED BY', minWidth: 150 },
    {
      id: 'actions',
      label: 'ACTIONS',
      align: 'right',
      minWidth: 150,
      render: (_, row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
          <Tooltip title="View Submissions">
            <IconButton size="small">
              <ViewIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedId(row._id);
                setOpenDeleteDialog(true);
              }}
            >
              <DeleteIcon fontSize="small" sx={{ color: 'error.main', opacity: 0.7, fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Homework Management"
        subtitle="Create and manage academic assignments for students."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Homework' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Create Homework
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={homeworks}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* ─── Create/Edit Dialog ─────────────────────────────────── */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? 'Edit Homework' : 'Create New Homework'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Class
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  error={!!formErrors.classId}
                  helperText={formErrors.classId}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="" disabled>Select Class</MenuItem>
                  {classOptions.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Section
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  error={!!formErrors.sectionId}
                  helperText={formErrors.sectionId}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="" disabled>Select Section</MenuItem>
                  {sectionOptions.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Subject
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={!!formErrors.subject}
                  helperText={formErrors.subject}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="" disabled>Select Subject</MenuItem>
                  {subjectOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Due Date
                </Typography>
                <TextField
                  fullWidth
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Title
                </Typography>
                <TextField
                  fullWidth
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter homework title"
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed instructions for the homework..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Attachment
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 140,
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
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
                  <UploadIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.primary" fontWeight={600}>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SVG, PNG, JPG or PDF (max. 10MB)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 100,
              borderColor: theme.palette.divider,
              color: 'text.primary',
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.divider,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150,
              px: 3,
            }}
          >
            {isEdit ? 'Update Homework' : 'Publish Homework'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Homework"
        message="Are you sure you want to delete this assignment? Students will no longer be able to view or submit it."
        loading={loading}
      />
    </Box>
  );
};

export default HomeworkPage;
