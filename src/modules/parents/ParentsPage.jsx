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
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Drawer,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  VisibilityOutlined as ViewIcon,
  EmailOutlined as EmailIcon,
  PhoneOutlined as PhoneIcon,
  PersonAddOutlined as LinkIcon,
  GroupOutlined as ChildrenIcon,
  RemoveCircleOutline as UnlinkIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { PageHeader, DataTable, ConfirmDialog, SearchableSelect } from '../../components';
import { useNotification } from '../../hooks';
import parentService from '../../services/parentService';
import studentService from '../../services/studentService';

const ParentsPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // ─── Main State ───────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // ─── Pagination & Search ─────────────────────────────────
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  // ─── Link Student Form State ─────────────────────────────
  const [linkFormData, setLinkFormData] = useState({
    studentId: '',
    relation: 'Father',
    isPrimary: false,
  });

  // ─── Dialog States ────────────────────────────────────────
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    status: 'Active',
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const data = await parentService.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchValue
      });
      setParents(data.result);
      setTotalCount(data.totalResults);
    } catch (err) {
      notify(err.message || 'Failed to fetch parents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async (parentId) => {
    try {
      const children = await parentService.getParentChildren(parentId);
      setSelectedParent(prev => ({ ...prev, children }));
    } catch (err) {
      notify('Failed to fetch children', 'error');
    }
  };

  const fetchStudents = async () => {
    try {
        const { data } = await studentService.getAll();
        setStudents(data.payload.result);
    } catch (err) {
        console.error(err);
    }
  }

  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, [page, rowsPerPage, searchValue]);

  const handleOpenDialog = (data = null) => {
    if (data) {
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: '',
        address: data.address || '',
        status: data.status,
      });
      setIsEdit(true);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        status: 'Active',
      });
      setIsEdit(false);
    }
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleLinkChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLinkFormData((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (isEdit) {
        // await parentService.update(selectedId, formData)
        notify('Parent updated successfully', 'success');
      } else {
        await parentService.createUser(formData);
        notify('Parent created (Email Sent)', 'success');
      }
      setOpenDialog(false);
      fetchParents();
    } catch (err) {
      notify(err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkStudent = async () => {
    if (!linkFormData.studentId) return;
    try {
      setLoading(true);
      await parentService.linkParentStudent({
        parentId: selectedParent._id,
        studentId: linkFormData.studentId,
        relation: linkFormData.relation,
        primaryContact: linkFormData.isPrimary,
        schoolId: students.find(s => s._id === linkFormData.studentId)?.schoolId
      });
      notify('Student linked successfully', 'success');
      fetchChildren(selectedParent._id);
      setLinkFormData({ studentId: '', relation: 'Father', isPrimary: false });
    } catch (err) {
      notify('Failed to link student', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async (studentId) => {
    try {
      await parentService.unlinkParentStudent(selectedParent._id, studentId);
      notify('Link removed', 'success');
      fetchChildren(selectedParent._id);
    } catch (err) {
      notify('Failed to unlink', 'error');
    }
  };

  const handleRowClick = (row) => {
      setSelectedParent(row);
      fetchChildren(row._id);
  };

  const handleDelete = () => {
    notify('Parent deleted successfully', 'success');
    setOpenDeleteDialog(false);
  };

  // ─── Table Columns ───────────────────────────────────────
  const columns = [
    {
      id: 'name',
      label: 'Parent Name',
      minWidth: 200,
      render: (val, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main, fontSize: 13, fontWeight: 700 }}>
            {val.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>{val}</Typography>
            <Typography variant="caption" color="text.secondary">Parent</Typography>
          </Box>
        </Box>
      ),
    },
    { id: 'phone', label: 'Phone', minWidth: 150 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'childrenCount', label: 'Children', minWidth: 100, align: 'center' },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (val) => (
        <Chip
          label={val}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.7rem',
            borderRadius: 1.5,
            bgcolor: val === 'Active' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
            color: val === 'Active' ? 'success.main' : 'text.secondary',
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View Details">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenDialog(row); }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => {
                setDeleteId(row._id);
                setOpenDeleteDialog(true);
              }}
            >
              <DeleteIcon fontSize="small" sx={{ color: 'error.main', opacity: 0.7 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Parents & Guardians"
        subtitle="Manage parent directory and student links"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Parents' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            Add Parent
          </Button>
        }
      />

      {/* ─── Parent List (Full Width) ─── */}
      <Box sx={{ width: '100%' }}>
        <DataTable
          columns={columns}
          rows={parents}
          loading={loading}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onRowClick={handleRowClick}
        />
      </Box>

      {/* ─── Right: Detail Drawer ─── */}
      <Drawer
        anchor="right"
        open={Boolean(selectedParent)}
        onClose={() => setSelectedParent(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400, md: 450 },
            borderRadius: '16px 0 0 16px',
            border: 'none',
            boxShadow: theme.shadows[10],
          },
        }}
      >
        {selectedParent && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(theme.palette.primary.main, 0.05), color: theme.palette.primary.main, fontWeight: 700, fontSize: 20 }}>
                  {selectedParent.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{selectedParent.name}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={selectedParent.status} size="small" color={selectedParent.status === 'Active' ? 'success' : 'default'} sx={{ height: 20, fontSize: 10, fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">{selectedParent.relation}</Typography>
                  </Stack>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedParent(null)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                <Tab label="Profile" sx={{ textTransform: 'none', fontWeight: 600 }} />
                <Tab label={`Children (${selectedParent.children?.length || 0})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              </Tabs>
            </Box>

            <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
              {activeTab === 0 && (
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Email Address</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={500}>{selectedParent.email}</Typography>
                    </Box>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>Phone Number</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={500}>{selectedParent.phone}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.5 }}>Home Address</Typography>
                      <Typography variant="body2" fontWeight={500}>{selectedParent.address || 'Not provided'}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2 }}>
                      <Typography variant="caption" fontWeight={700} color="primary" sx={{ mb: 1, display: 'block' }}>ACCOUNT STATUS</Typography>
                      <Typography variant="caption" color="text.secondary">Default password has been sent to candidate's email. Account is ready for parent portal access.</Typography>
                    </Box>
                  </Stack>
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Linked Students</Typography>
                  <Stack spacing={2}>
                    {selectedParent.children?.map((child) => (
                      <Card key={child._id} variant="outlined" sx={{ borderRadius: 3, borderStyle: 'dashed' }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar src={child.avatar} sx={{ width: 40, height: 40, bgcolor: theme.palette.primary.main }}>{child.name[0]}</Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight={700}>{child.studentId?.name || "Student"}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {child.studentId?.classId?.name} • {child.studentId?.sectionId?.name}
                                </Typography>
                              </Box>
                            </Box>
                             <Tooltip title="Unlink Student">
                               <IconButton size="small" color="error" onClick={() => handleUnlink(child.studentId?._id)}>
                                 <UnlinkIcon fontSize="small" sx={{ opacity: 0.5 }} />
                               </IconButton>
                             </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    {(!selectedParent.children || selectedParent.children.length === 0) && (
                      <Paper sx={{ p: 4, textAlign: 'center', bgcolor: alpha(theme.palette.action.hover, 0.05), borderRadius: 3, border: '1px dashed divider' }}>
                        <ChildrenIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5, opacity: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>No students linked yet</Typography>
                      </Paper>
                    )}

                    <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <LinkIcon color="primary" sx={{ fontSize: 20 }} />
                        <Typography variant="subtitle2" fontWeight={700}>Link Student</Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <SearchableSelect
                          label="Select Student"
                          name="studentId"
                          value={linkFormData.studentId}
                          onChange={handleLinkChange}
                          options={students.map(s => ({ value: s._id, label: `${s.name} (${s.admissionNumber})` }))}
                          placeholder="Search student..."
                          sx={{ mb: 0 }}
                        />
                        <SearchableSelect
                          label="Relation"
                          name="relation"
                          value={linkFormData.relation}
                          onChange={handleLinkChange}
                          options={[
                            { value: 'Father', label: 'Father' },
                            { value: 'Mother', label: 'Mother' },
                            { value: 'Guardian', label: 'Guardian' },
                          ]}
                          sx={{ mb: 0 }}
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              name="isPrimary"
                              checked={linkFormData.isPrimary}
                              onChange={handleLinkChange}
                            />
                          }
                          label={<Typography variant="caption" fontWeight={600}>Set as Primary Contact for this student</Typography>}
                          sx={{ mt: -1 }}
                        />
                         <Button 
                           variant="contained" 
                           fullWidth 
                           onClick={handleLinkStudent}
                           disabled={loading}
                           sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                           Link Student
                         </Button>
                      </Stack>
                    </Box>
                  </Stack>
                </Box>
              )}
            </DialogContent>
          </Box>
        )}
      </Drawer>


      {/* ─── Add/Edit Dialog ────────────────────────────────────── */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>{isEdit ? 'Edit Parent' : 'Add New Parent'}</Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small"><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 4 }}>
          <Grid container spacing={2.5} sx={{ mt: 0.1 }}>
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>FULL NAME</Typography>
              <TextField fullWidth name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Michael Johnson" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>PHONE NUMBER</Typography>
              <TextField fullWidth name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>EMAIL ADDRESS</Typography>
              <TextField fullWidth name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
            </Grid>
            {!isEdit && (
              <Grid item xs={12}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>TEMPORARY PASSWORD</Typography>
                <TextField fullWidth type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 1, mb: 0.5, display: 'block' }}>HOME ADDRESS (OPTIONAL)</Typography>
              <TextField fullWidth multiline rows={2} name="address" value={formData.address} onChange={handleChange} placeholder="Full residential address..." sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
            </Grid>
            <Grid item xs={12}>
              <SearchableSelect
                label="Account Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: alpha(theme.palette.action.hover, 0.02), borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 4 }}>Save Parent</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Parent"
        message="Are you sure you want to delete this parent? This will also remove student links but student records will remain. This action cannot be undone."
      />
    </Box>
  );
};

export default ParentsPage;
