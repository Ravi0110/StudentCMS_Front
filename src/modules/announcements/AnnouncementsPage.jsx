import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Event as EventIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreIcon,
  CalendarToday as CalendarIcon,
  FileUploadOutlined as UploadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { PageHeader, ConfirmDialog } from '../../components';
import { useNotification } from '../../hooks';
import announcementService from '../../services/announcementService';

const AnnouncementsPage = () => {
  const theme = useTheme();
  const { notify } = useNotification();

  // ─── State ──────────────────────────────────────────────────
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  // ─── Dialog State ──────────────────────────────────────────
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetRole: 'All Users',
    eventDate: '',
    targetClass: '',
    targetSection: '',
    attachment: null,
  });
  const [formErrors, setFormErrors] = useState({});

  // ─── Options (Mock) ───────────────────────────────────────
  const roleOptions = ['All Users', 'Teachers', 'Students', 'Parents'];
  const classOptions = ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 7'];
  const sectionOptions = ['Section A', 'Section B', 'Section C'];

  // ─── Delete State ─────────────────────────────────────────
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      // Mock data matching screenshot
      const mockData = [
        {
          _id: '1',
          title: 'Annual Science Fair 2024',
          description: "We are excited to announce our upcoming Annual Science Fair! Students from all grades are invited to showcase their innovative projects...",
          eventDate: 'Oct 15, 2024',
          targetRole: 'All Teachers',
          attachment: 'Science_Fair_Guidelines.pdf',
        },
        {
          _id: '2',
          title: 'School Closed for National Holiday',
          description: "Please be informed that the school will remain closed this Friday in observance of the upcoming national holiday. Classes will...",
          eventDate: 'Sep 15, 2024',
          targetRole: 'Entire School',
          attachment: null,
        },
        {
          _id: '3',
          title: 'New Library E-Resources',
          description: "We have added 500+ new e-books to our school library, including academic journals, adult fiction and research papers...",
          eventDate: 'Sep 10, 2024',
          targetRole: 'Students',
          attachment: null,
        },
      ];
      setAnnouncements(mockData);
    } catch (error) {
      notify('Failed to fetch announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [searchValue]);

  const handleOpenDialog = (data = null) => {
    if (data) {
      setIsEdit(true);
      setSelectedId(data._id);
      setFormData({
        title: data.title,
        description: data.description,
        targetRole: data.targetRole || 'All Users',
        eventDate: data.eventDate || '',
        targetClass: '',
        targetSection: '',
        attachment: null,
      });
    } else {
      setIsEdit(false);
      setFormData({
        title: '',
        description: '',
        targetRole: 'All Users',
        eventDate: '',
        targetClass: '',
        targetSection: '',
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
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      notify(isEdit ? 'Announcement updated successfully' : 'Announcement published successfully', 'success');
      handleCloseDialog();
      fetchAnnouncements();
    } catch (err) {
      notify(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      notify('Announcement deleted', 'success');
      setOpenDeleteDialog(false);
      fetchAnnouncements();
    } catch (err) {
      notify('Failed to delete', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Announcements & Events"
        subtitle="Manage and track school announcements and upcoming events."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Announcements' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
          >
            New Announcement
          </Button>
        }
      />

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search announcements..."
          fullWidth
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ maxWidth: 400, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MoreIcon fontSize="small" sx={{ color: 'text.secondary', transform: 'rotate(90deg)' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {announcements.map((ann) => (
          <Grid item xs={12} md={6} key={ann._id}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardContent sx={{ p: 3, position: 'relative' }}>
                <IconButton sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <MoreIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </IconButton>

                <Typography variant="h6" fontWeight={700} sx={{ mb: 1, pr: 4 }}>
                  {ann.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
                  <CalendarIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={500}>
                    {ann.eventDate}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.6,
                  }}
                >
                  {ann.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    label={ann.targetRole}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                    }}
                  />
                  {/* Additional target identifiers if they existed in data */}
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px dashed ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <AttachIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {ann.attachment || 'No attachments'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
            {isEdit ? 'Edit Announcement' : 'Create Announcement'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                Title
              </Typography>
              <TextField
                fullWidth
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Annual Sports Day"
                error={!!formErrors.title}
                helperText={formErrors.title}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
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
                placeholder="Write announcement details here..."
                error={!!formErrors.description}
                helperText={formErrors.description}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Target Role
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {roleOptions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Event Date
                </Typography>
                <TextField
                  fullWidth
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Target Class
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="targetClass"
                  value={formData.targetClass}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="">Select Class (Optional)</MenuItem>
                  {classOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: 'text.primary' }}>
                  Target Section
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="targetSection"
                  value={formData.targetSection}
                  onChange={handleChange}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="">Select Section (Optional)</MenuItem>
                  {sectionOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>

            {/* Attachment Area */}
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, mt: 3, color: 'text.primary' }}>
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
                SVG, PNG, JPG or PDF (max. 5MB)
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
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
              minWidth: 160,
              px: 3,
            }}
          >
            {isEdit ? 'Update Announcement' : 'Publish Announcement'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        loading={loading}
      />
    </Box>
  );
};

export default AnnouncementsPage;
