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
  Grid,
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
import classService from '../../services/classService';

const ClassesPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // State
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
    code: '',
    order: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Dialog State
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      // Mock data for UI as per screenshot
      const mockData = [
        { _id: '1', name: 'Grade 10', code: 'G10', sections: 4 },
        { _id: '2', name: 'Grade 9', code: 'G9', sections: 3 },
        { _id: '3', name: 'Grade 8', code: 'G8', sections: 3 },
        { _id: '4', name: 'Grade 7', code: 'G7', sections: 2 },
        { _id: '5', name: 'Grade 6', code: 'G6', sections: 2 },
      ];
      setClasses(mockData);
      setTotalCount(mockData.length);
      
      // Real API Call (uncomment when backend is ready)
      // const res = await classService.getAll({ page: page + 1, limit: rowsPerPage, search: searchValue });
      // setClasses(res.data.payload.results);
      // setTotalCount(res.data.payload.totalResults);
    } catch (error) {
      notify(error.message || 'Failed to fetch classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [page, rowsPerPage, searchValue]);

  const handleOpenDialog = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data._id);
      setFormData({
        name: data.name,
        code: data.code,
        order: data.order || '',
      });
    } else {
      setIsEdit(false);
      setFormData({ name: '', code: '', order: '' });
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
    if (!formData.name.trim()) errors.name = 'Class name is required';
    if (!formData.code.trim()) errors.code = 'Class code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      if (isEdit) {
        // await classService.update(selectedId, formData);
        notify('Class updated successfully', 'success');
      } else {
        // await classService.create(formData);
        notify('Class created successfully', 'success');
      }
      handleCloseDialog();
      fetchClasses();
    } catch (error) {
      notify(error.message || 'Failed to save class', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // await classService.delete(selectedId);
      notify('Class deleted successfully', 'success');
      setOpenDeleteDialog(false);
      fetchClasses();
    } catch (error) {
      notify(error.message || 'Failed to delete class', 'error');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'name', label: 'Class Name', minWidth: 200, render: (val) => <strong>{val}</strong> },
    { id: 'code', label: 'Code', minWidth: 150 },
    { id: 'sections', label: 'Sections', minWidth: 150 },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      minWidth: 200,
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
              '&:hover': {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }
            }}
          >
            View sections
          </Button>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOpenDialog(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setSelectedId(row._id);
                setOpenDeleteDialog(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Class Management"
        subtitle="Organize and manage school classes."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Classes' }]}
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
            Add Class
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={classes}
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
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? 'Edit Class' : 'Add New Class'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4, mt: 1 }}>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                Class Name
              </Typography>
              <TextField
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grade 11"
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                Class Code
              </Typography>
              <TextField
                fullWidth
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. G11"
                error={!!formErrors.code}
                helperText={formErrors.code}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                Order
              </Typography>
              <TextField
                fullWidth
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
                placeholder="e.g. 11"
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
            {isEdit ? 'Update Class' : 'Save Class'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Class"
        message="Are you sure you want to delete this class? This will also affect associated sections and records."
        loading={loading}
      />
    </Box>
  );
};

export default ClassesPage;
