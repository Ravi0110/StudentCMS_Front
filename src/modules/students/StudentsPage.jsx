import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  FileUploadOutlined as UploadIcon,
} from '@mui/icons-material';
import { PageHeader, DataTable, ConfirmDialog } from '../../components';
import { useNotification } from '../../hooks';
import studentService from '../../services/studentService';
import classService from '../../services/classService';
import sectionService from '../../services/sectionService';

const StudentsPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // ─── Table State ──────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // ─── Form State ───────────────────────────────────────────
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
    classId: '',
    sectionId: '',
    rollNumber: '',
    academicYear: '2024-2025',
    status: 'Active',
    profileImage: null,
  });
  const [formErrors, setFormErrors] = useState({});

  // ─── Options State ────────────────────────────────────────
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  // ─── Delete State ─────────────────────────────────────────
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Mock data matching screenshot
      const mockData = [
        { _id: '1', name: 'Alex Thompson', admissionNumber: 'ADM-2024-001', class: 'Grade 10', section: 'Section A', rollNumber: '15', status: 'Active', avatar: '' },
        { _id: '2', name: 'Maya Patel', admissionNumber: 'ADM-2024-002', class: 'Grade 10', section: 'Section A', rollNumber: '08', status: 'Active', avatar: '' },
        { _id: '3', name: 'Ethan Hunt', admissionNumber: 'ADM-2024-003', class: 'Grade 9', section: 'Section B', rollNumber: '22', status: 'Active', avatar: '' },
        { _id: '4', name: 'Sofia Rodriguez', admissionNumber: 'ADM-2024-004', class: 'Grade 8', section: 'Section C', rollNumber: '11', status: 'Inactive', avatar: '' },
      ];
      setStudents(mockData);
      setTotalCount(mockData.length);
    } catch (error) {
      notify('Failed to fetch students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      // Mock Fetch Classes/Sections for Dialog
      setClasses([
        { _id: 'c1', name: 'Grade 10' },
        { _id: 'c2', name: 'Grade 9' },
        { _id: 'c3', name: 'Grade 8' },
      ]);
      setSections([
        { _id: 's1', name: 'Section A' },
        { _id: 's2', name: 'Section B' },
        { _id: 's3', name: 'Section C' },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchOptions();
  }, [page, rowsPerPage, searchValue]);

  const handleOpenDialog = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data._id);
      setFormData({
        name: data.name,
        admissionNumber: data.admissionNumber,
        classId: data.classId || '',
        sectionId: data.sectionId || '',
        rollNumber: data.rollNumber,
        academicYear: data.academicYear || '2024-2025',
        status: data.status || 'Active',
        profileImage: null,
      });
    } else {
      setIsEdit(false);
      setFormData({
        name: '',
        admissionNumber: '',
        classId: '',
        sectionId: '',
        rollNumber: '',
        academicYear: '2024-2025',
        status: 'Active',
        profileImage: null,
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
    if (!formData.name.trim()) errs.name = 'Student name is required';
    if (!formData.admissionNumber.trim()) errs.admissionNumber = 'Admission number is required';
    if (!formData.classId) errs.classId = 'Class is required';
    if (!formData.sectionId) errs.sectionId = 'Section is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      // await studentService.create/update(formData)
      notify(isEdit ? 'Student updated successfully' : 'Student added successfully', 'success');
      handleCloseDialog();
      fetchStudents();
    } catch (err) {
      notify(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      notify('Student successfully deleted', 'success');
      setOpenDeleteDialog(false);
      fetchStudents();
    } catch (err) {
      notify('Failed to delete', 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Student Name',
      minWidth: 220,
      render: (val, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={row.avatar}
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {val.charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {val}
          </Typography>
        </Box>
      ),
    },
    { id: 'admissionNumber', label: 'Admission Number', minWidth: 150 },
    { id: 'class', label: 'Class', minWidth: 120 },
    { id: 'section', label: 'Section', minWidth: 120 },
    { id: 'rollNumber', label: 'Roll Number', minWidth: 120 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (val) => (
        <Chip
          label={val}
          size="small"
          color={val === 'Active' ? 'success' : 'default'}
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            borderRadius: 1.5,
            px: 0.5,
            bgcolor: val === 'Active' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
            color: val === 'Active' ? 'success.main' : 'text.secondary',
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 220,
      render: (_, row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              borderColor: theme.palette.divider,
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.action.hover, 0.05),
              '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main }
            }}
          >
            View Profile
          </Button>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" sx={{ color: 'text.secondary' }} />
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
              <DeleteIcon fontSize="small" sx={{ color: 'error.main', opacity: 0.7 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Student Management"
        subtitle="Manage student enrollments, profiles, and academic records."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Students' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Add Student
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={students}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* ─── Add/Edit Dialog ────────────────────────────────────── */}
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
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mt: 1 }}>
            {/* Profile Picture Upload Section */}
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
              Profile Picture
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 120,
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                mb: 4,
                bgcolor: alpha(theme.palette.action.hover, 0.02),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
            >
              <UploadIcon sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Click to upload image
              </Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Student Name
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Admission Number
                </Typography>
                <TextField
                  fullWidth
                  name="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={handleChange}
                  placeholder="e.g. ADM-2024-001"
                  error={!!formErrors.admissionNumber}
                  helperText={formErrors.admissionNumber}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
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
                  {classes.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
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
                  {sections.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Roll Number
                </Typography>
                <TextField
                  fullWidth
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Academic Year
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="2024-2025">2024-2025</MenuItem>
                  <MenuItem value="2025-2026">2025-2026</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
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
              minWidth: 130,
              px: 3,
            }}
          >
            {isEdit ? 'Update Student' : 'Save Student'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student record? This action cannot be undone."
        loading={loading}
      />
    </Box>
  );
};

export default StudentsPage;
