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
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { PageHeader, DataTable, ConfirmDialog } from '../../components';
import { useNotification } from '../../hooks';
import sectionService from '../../services/sectionService';
import classService from '../../services/classService';

const SectionsPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // State
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Dialog State
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchSections = async () => {
    try {
      setLoading(true);
      // Mock data as per screenshot
      const mockData = [
        { _id: '1', name: 'Section A', className: 'Grade 10', studentsCount: 34 },
        { _id: '2', name: 'Section B', className: 'Grade 9', studentsCount: 45 },
        { _id: '3', name: 'Section A', className: 'Grade 8', studentsCount: 40 },
        { _id: '4', name: 'Section C', className: 'Grade 7', studentsCount: 30 },
      ];
      setSections(mockData);
      setTotalCount(mockData.length);
      
      // Real API Call
      // const res = await sectionService.getAll({ page: page + 1, limit: rowsPerPage, search: searchValue });
      // setSections(res.data.payload.results);
      // setTotalCount(res.data.payload.totalResults);
    } catch (error) {
      notify(error.message || 'Failed to fetch sections', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      // Mock classes for dropdown
      const mockClasses = [
        { _id: '1', name: 'Grade 10' },
        { _id: '2', name: 'Grade 9' },
        { _id: '3', name: 'Grade 8' },
        { _id: '4', name: 'Grade 7' },
      ];
      setClasses(mockClasses);
      
      // Real API Call
      // const res = await classService.getAll({ limit: 100 });
      // setClasses(res.data.payload.results);
    } catch (error) {
      console.error('Failed to fetch classes', error);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchClasses();
  }, [page, rowsPerPage, searchValue]);

  const handleOpenDialog = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data._id);
      setFormData({
        name: data.name,
        classId: data.classId || '',
      });
    } else {
      setIsEdit(false);
      setFormData({ name: '', classId: '' });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Section name is required';
    if (!formData.classId) errors.classId = 'Please select a class';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isEdit) {
        // await sectionService.update(selectedId, formData);
        notify('Section updated successfully', 'success');
      } else {
        // await sectionService.create(formData);
        notify('Section created successfully', 'success');
      }
      handleCloseDialog();
      fetchSections();
    } catch (error) {
      notify(error.message || 'Failed to save section', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // await sectionService.delete(selectedId);
      notify('Section deleted successfully', 'success');
      setOpenDeleteDialog(false);
      fetchSections();
    } catch (error) {
      notify(error.message || 'Failed to delete section', 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'name', label: 'SECTION NAME', minWidth: 200, render: (val) => <strong>{val}</strong> },
    { id: 'className', label: 'CLASS', minWidth: 150 },
    { id: 'studentsCount', label: 'STUDENTS COUNT', minWidth: 150, render: (val) => `${val} Students` },
    {
      id: 'actions',
      label: 'ACTIONS',
      align: 'right',
      minWidth: 150,
      render: (_, row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
        title="Sections"
        subtitle="Manage sections for all classes."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Sections' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Add Section
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={sections}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        loading={loading}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* Add / Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? 'Edit Section' : 'Add New Section'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4, mt: 1 }}>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                Select Class
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
                <MenuItem value="" disabled>
                  Select a class...
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls._id} value={cls._id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                Section Name
              </Typography>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Section A"
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, backgroundColor: alpha(theme.palette.primary.main, 0.04), borderTop: `1px solid ${theme.palette.divider}` }}>
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
              }
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
              minWidth: 120,
              px: 3,
            }}
          >
            {isEdit ? 'Update Section' : 'Save Section'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Section"
        message="Are you sure you want to delete this section? This will also affect associated student records."
        loading={loading}
      />
    </Box>
  );
};

export default SectionsPage;
