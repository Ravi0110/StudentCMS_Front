import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { PageHeader, DataTable, ConfirmDialog } from '../../components';
import { useNotification } from '../../hooks';
import studentService from '../../services/studentService';

const StudentsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { notify } = useNotification();

  // ─── Table State ──────────────────────────────────────────
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // ─── Delete State ─────────────────────────────────────────
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await studentService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchValue
      });
      setStudents(data?.payload?.result?.data || []);
      setTotalCount(data?.payload?.result?.meta?.total_found || 0);
    } catch (error) {
       // Mock for safety if backend unavailable
       setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, searchValue]);

  const handleCreate = () => navigate('/students/add');
  const handleEdit = (id) => navigate(`/students/edit/${id}`);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await studentService.delete(selectedId);
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
    { 
        id: 'classId', 
        label: 'Class', 
        minWidth: 120,
        render: (val) => val?.name || 'N/A'
    },
    { 
        id: 'sectionId', 
        label: 'Section', 
        minWidth: 120,
        render: (val) => val?.name || 'N/A'
    },
    { id: 'rollNumber', label: 'Roll Number', minWidth: 120 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      render: (val) => (
        <Chip
          label={val === 'active' ? 'Active' : 'Inactive'}
          size="small"
          color={val === 'active' ? 'success' : 'default'}
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            borderRadius: 1.5,
            px: 0.5,
            bgcolor: val === 'active' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
            color: val === 'active' ? 'success.main' : 'text.secondary',
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
            onClick={() => navigate(`/students/profile/${row._id}`)}
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
            <IconButton size="small" onClick={() => handleEdit(row._id)}>
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
            onClick={handleCreate}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Enroll Student
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
