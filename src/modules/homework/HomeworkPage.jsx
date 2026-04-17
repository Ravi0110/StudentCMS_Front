import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { PageHeader, DataTable, ConfirmDialog } from '../../components';
import { useNotification } from '../../hooks';
import homeworkService from '../../services/homeworkService';

const HomeworkPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { notify } = useNotification();

  // ─── Table State ──────────────────────────────────────────
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  // ─── Delete State ─────────────────────────────────────────
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      // Fallback/Mock logic
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

  const handleCreate = () => navigate('/homework/add');
  const handleEdit = (id) => navigate(`/homework/edit/${id}`);

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
            <IconButton size="small" onClick={() => handleEdit(row._id)}>
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
            onClick={handleCreate}
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
