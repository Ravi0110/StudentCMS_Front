import { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, useTheme, Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from '@mui/icons-material';
import DataTable from '../../components/DataTable';
import PageHeader from '../../components/PageHeader';
import schoolService from '../../services/schoolService';
import { useNotification } from '../../hooks';

const SchoolsPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // Create Dialog State
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    organization_name: '',
    organization_email: '',
    organization_password: '',
  });

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const res = await schoolService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        filter: searchValue,
      });
      const { data, meta } = res.data.payload;
      setSchools(data || []);
      setTotalCount(meta?.total_found || 0);
    } catch (error) {
      notify(error.message || 'Failed to fetch schools', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [page, rowsPerPage, searchValue]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await schoolService.create(formData);
      notify('School created successfully! An email has been sent to the administrator.', 'success');
      setOpen(false);
      setFormData({
        full_name: '',
        organization_name: '',
        organization_email: '',
        organization_password: '',
      });
      fetchSchools();
    } catch (error) {
      notify(error.message || 'Failed to create school', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (school) => {
    try {
      await schoolService.updateStatus(school._id, !school.is_active);
      notify(`School ${school.is_active ? 'deactivated' : 'activated'} successfully`, 'success');
      fetchSchools();
    } catch (error) {
      notify('Failed to update status', 'error');
    }
  };

  const columns = [
    { id: 'organization_name', label: 'School Name', minWidth: 200 },
    { id: 'full_name', label: 'Admin Name', minWidth: 150 },
    { id: 'organization_email', label: 'Admin Email', minWidth: 200 },
    {
      id: 'is_active',
      label: 'Status',
      render: (val) => (
        <Chip
          label={val ? 'Active' : 'Inactive'}
          color={val ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, school) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleToggleStatus(school)}
            title={school.is_active ? 'Deactivate' : 'Activate'}
          >
            {school.is_active ? <InactiveIcon /> : <ActiveIcon />}
          </IconButton>
          <IconButton size="small" color="info">
            <ViewIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader
        title="School Management"
        subtitle="Manage schools, institutions and their administrative access"
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Create New School
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={schools}
        loading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* Create Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New School</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent dividers>
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  School Information
                </Typography>
                <TextField
                  fullWidth
                  label="School / Organization Name"
                  required
                  value={formData.organization_name}
                  onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                  placeholder="e.g. St. Xavier's International School"
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                  Super Admin Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Administrative Email"
                  type="email"
                  required
                  value={formData.organization_email}
                  onChange={(e) => setFormData({ ...formData, organization_email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Default Password"
                  type="password"
                  required
                  value={formData.organization_password}
                  onChange={(e) => setFormData({ ...formData, organization_password: e.target.value })}
                  helperText="Admin can change this after first login"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ px: 4, borderRadius: 2 }}
            >
              {submitting ? 'Creating...' : 'Create School'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SchoolsPage;
