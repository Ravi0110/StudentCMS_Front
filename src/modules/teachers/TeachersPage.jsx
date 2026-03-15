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
  Select,
  FormControl,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  PersonAddAlt1 as AssignIcon,
} from '@mui/icons-material';
import { PageHeader, DataTable, ConfirmDialog } from '../../components';
import { useNotification } from '../../hooks';
import teacherService from '../../services/teacherService';

const TeachersPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // ─── Table State ──────────────────────────────────────────
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');

  // ─── Form State ───────────────────────────────────────────
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subjects: [],
    assignedClasses: [],
    status: 'Active',
  });
  const [formErrors, setFormErrors] = useState({});

  // ─── Options (Mock) ───────────────────────────────────────
  const subjectOptions = ['Mathematics', 'Science', 'English', 'History', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const classOptions = ['Grade 10 - A', 'Grade 10 - B', 'Grade 9 - A', 'Grade 8 - C', 'Grade 7 - A'];

  // ─── Delete State ─────────────────────────────────────────
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Mock data matching screenshot
      const mockData = [
        { _id: '1', name: 'Eleanor Fant', email: 'e.fant@school.edu', phone: '+1 (555) 123-4567', subjects: ['Mathematics', 'Physics'], status: 'Active', avatar: '' },
        { _id: '2', name: 'David Miller', email: 'd.miller@school.edu', phone: '+1 (555) 987-6543', subjects: ['Science', 'Biology'], status: 'Active', avatar: '' },
        { _id: '3', name: 'Mei Lin', email: 'm.lin@school.edu', phone: '+1 (555) 456-7890', subjects: ['English', 'History'], status: 'Active', avatar: '' },
      ];
      setTeachers(mockData);
      setTotalCount(mockData.length);
    } catch (error) {
      notify('Failed to fetch teachers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, rowsPerPage, searchValue, subjectFilter]);

  const handleOpenDialog = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data._id);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        subjects: data.subjects || [],
        assignedClasses: data.assignedClasses || [],
        status: data.status || 'Active',
      });
    } else {
      setIsEdit(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subjects: [],
        assignedClasses: [],
        status: 'Active',
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
    if (!formData.name.trim()) errs.name = 'Teacher name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Invalid email format';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      notify(isEdit ? 'Teacher updated successfully' : 'Teacher added successfully', 'success');
      handleCloseDialog();
      fetchTeachers();
    } catch (err) {
      notify(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      notify('Teacher record deleted', 'success');
      setOpenDeleteDialog(false);
      fetchTeachers();
    } catch (err) {
      notify('Failed to delete', 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      id: 'name',
      label: 'Teacher Name',
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
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    {
      id: 'subjects',
      label: 'Subjects',
      minWidth: 200,
      render: (val) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {val.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 20,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                color: 'primary.main',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            />
          ))}
        </Box>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
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
      minWidth: 180,
      render: (_, row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, alignItems: 'center' }}>
          <Button
            variant="text"
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'text.secondary',
              '&:hover': { color: theme.palette.primary.main }
            }}
          >
            View
          </Button>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Classes">
            <IconButton size="small">
              <AssignIcon fontSize="small" sx={{ color: 'text.secondary', fontSize: 18 }} />
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
        title="Teacher Management"
        subtitle="Manage teaching staff, subjects, and assignments."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Teachers' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Add Teacher
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={teachers}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        actions={
          <TextField
            select
            size="small"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            <MenuItem value="All Subjects">All Subjects</MenuItem>
            {subjectOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        }
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
            {isEdit ? 'Edit Teacher' : 'Add New Teacher'}
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
                  Teacher Name
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Smith"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. j.smith@school.edu"
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Phone
                </Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 (555) 000-0000"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Subjects
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {subjectOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: 'text.primary' }}>
                  Assigned Classes
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="assignedClasses"
                  value={formData.assignedClasses}
                  onChange={handleChange}
                  SelectProps={{
                    multiple: true,
                    renderValue: (selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {classOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
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
              minWidth: 140,
              px: 3,
            }}
          >
            {isEdit ? 'Update Teacher' : 'Save Teacher'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Remove Teacher"
        message="Are you sure you want to remove this teacher from the system? Their assignment records will be archived."
        loading={loading}
      />
    </Box>
  );
};

export default TeachersPage;
