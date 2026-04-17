import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  useTheme,
  alpha,
  Paper,
  Divider,
  Chip,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Stack,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  FileUploadOutlined as UploadIcon,
} from '@mui/icons-material';
import { PageHeader, SearchableSelect } from '../../components';
import { useNotification } from '../../hooks';
import studentService from '../../services/studentService';
import classService from '../../services/classService';
import sectionService from '../../services/sectionService';
import parentService from '../../services/parentService';
import api from '../../services/api';

const StudentFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { notify } = useNotification();
  const isEdit = Boolean(id);

  // ─── Main State ───────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
    classId: '',
    sectionId: '',
    rollNumber: '',
    academicYear: '2024-2025',
    status: 'Active',
    profileImage: null,
    // Parent Fields
    parentId: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    relation: 'Father',
    isPrimary: true,
  });
  const [formErrors, setFormErrors] = useState({});

  // ─── Options State ────────────────────────────────────────
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [parentSearchLoading, setParentSearchLoading] = useState(false);
  const [isNewParent, setIsNewParent] = useState(true);

  // ─── Initialization ───────────────────────────────────────
  const fetchOptions = async () => {
    try {
      setOptionsLoading(true);
      const [classesRes, sectionsRes] = await Promise.all([
        classService.getAll(),
        sectionService.getAll()
      ]);
      setClasses(classesRes.data?.payload?.result || []);
      setSections(sectionsRes.data?.payload?.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setOptionsLoading(false);
    }
  };

  const fetchStudentData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data } = await studentService.getById(id);
      const student = data.payload.result;
      
      setFormData(prev => ({
        ...prev,
        name: student.name,
        admissionNumber: student.admissionNumber,
        classId: student.classId?._id || student.classId,
        sectionId: student.sectionId?._id || student.sectionId,
        rollNumber: student.rollNumber,
        academicYear: student.academicYear,
        status: student.status === 'active' ? 'Active' : 'Inactive',
      }));

      // Fetch Parent Link
      const parentsResp = await api.get(`/students/${id}/parents`);
      const primary = parentsResp.data.payload.result.find(p => p.primaryContact);
      if (primary && primary.parent) {
        setFormData(prev => ({
          ...prev,
          parentId: primary.parent._id,
          parentName: primary.parent.name,
          parentEmail: primary.parent.email,
          parentPhone: primary.parent.phone,
          relation: primary.relation,
          isPrimary: primary.primaryContact
        }));
        setIsNewParent(false);
      }
    } catch (err) {
      notify('Failed to load student data', 'error');
      navigate('/students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    if (isEdit) fetchStudentData();
  }, [id]);

  // ─── Handlers ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleParentSearch = async (query) => {
    if (query.length < 3) {
      setParentOptions([]);
      return;
    }
    try {
      setParentSearchLoading(true);
      const results = await parentService.searchUsers(query);
      setParentOptions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setParentSearchLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Student name is required';
    if (!formData.admissionNumber.trim()) errs.admissionNumber = 'Admission number is required';
    if (!formData.classId) errs.classId = 'Class is required';
    if (!formData.sectionId) errs.sectionId = 'Section is required';
    if (!formData.parentEmail.trim()) errs.parentEmail = 'Parent email is required';
    if (!formData.parentName.trim()) errs.parentName = 'Parent name is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = {
        ...formData,
        status: formData.status === 'Active' ? 'active' : 'inactive'
      };

      if (isEdit) {
        await studentService.update(id, payload);
        notify('Student and parent updated successfully', 'success');
      } else {
        await studentService.create(payload);
        notify('Student enrolled successfully', 'success');
      }
      navigate('/students');
    } catch (err) {
      notify(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────
  return (
    <Box sx={{ pb: 8 }}>
      <PageHeader
        title={isEdit ? 'Edit Student' : 'Student Enrollment'}
        subtitle={isEdit ? 'Update student records and parent details' : 'Enroll a new student and board the parent'}
        breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Students', path: '/students' },
            { label: isEdit ? 'Edit' : 'Add' }
        ]}
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={() => navigate('/students')}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Records' : 'Confirm Enrollment')}
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        {/* Left Column: Basic Info */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Student Basic Information</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 0.5, mb: 1, display: 'block' }}>FULL NAME</Typography>
                <TextField 
                  fullWidth 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Enter full name"
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 0.5, mb: 1, display: 'block' }}>ADMISSION NUMBER</Typography>
                <TextField 
                  fullWidth 
                  name="admissionNumber" 
                  value={formData.admissionNumber} 
                  onChange={handleChange} 
                  placeholder="ADM-202X-XXX"
                  error={!!formErrors.admissionNumber}
                  helperText={formErrors.admissionNumber}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Grade/Class"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  options={classes.map(c => ({ value: c._id, label: c.name }))}
                  placeholder="Select Class"
                  error={!!formErrors.classId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Section/Group"
                  name="sectionId"
                  value={formData.sectionId}
                  onChange={handleChange}
                  options={sections.map(s => ({ value: s._id, label: s.name }))}
                  placeholder="Select Section"
                  error={!!formErrors.sectionId}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 0.5, mb: 1, display: 'block' }}>ROLL NUMBER (OPTIONAL)</Typography>
                <TextField 
                  fullWidth 
                  name="rollNumber" 
                  value={formData.rollNumber} 
                  onChange={handleChange} 
                  placeholder="e.g. 05"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Academic Session"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  options={[
                    { value: '2024-2025', label: 'Session 2024-25' },
                    { value: '2025-2026', label: 'Session 2025-26' },
                  ]}
                />
              </Grid>
            </Grid>

            {/* Parent Section */}
            <Divider sx={{ my: 4 }}>
               <Chip label="Parent / Guardian Details" sx={{ fontWeight: 700 }} />
            </Divider>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 0.5, mb: 1, display: 'block' }}>PARENT SEARCH (SYNC EXISTING)</Typography>
                <Autocomplete
                  freeSolo
                  options={parentOptions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : `${option.email} (${option.name})`}
                  loading={parentSearchLoading}
                  onInputChange={(event, newInputValue) => {
                    handleParentSearch(newInputValue);
                    setFormData(prev => ({ ...prev, parentEmail: newInputValue }));
                  }}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'object' && newValue !== null) {
                      setFormData(prev => ({
                        ...prev,
                        parentId: newValue._id,
                        parentName: newValue.name,
                        parentEmail: newValue.email,
                        parentPhone: newValue.phone || '',
                      }));
                      setIsNewParent(false);
                    } else {
                      setIsNewParent(true);
                      setFormData(prev => ({ ...prev, parentId: '' }));
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Type email or name to link existing parent account..."
                      error={!!formErrors.parentEmail}
                      helperText={formErrors.parentEmail}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {parentSearchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                        sx: { borderRadius: 1.2 }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 0.5, mb: 1, display: 'block' }}>PARENT NAME</Typography>
                <TextField
                  fullWidth
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  placeholder="Full name of parent"
                  error={!!formErrors.parentName}
                  helperText={formErrors.parentName}
                  disabled={!isNewParent}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ ml: 0.5, mb: 1, display: 'block' }}>CONTACT PHONE</Typography>
                <TextField
                  fullWidth
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  placeholder="+1 XXXXXXXXXX"
                  disabled={!isNewParent}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SearchableSelect
                  label="Student Relation"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  options={[
                    { value: 'Father', label: 'Father' },
                    { value: 'Mother', label: 'Mother' },
                    { value: 'Guardian', label: 'Guardian' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                   <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isPrimary}
                          onChange={(e) => setFormData(p => ({ ...p, isPrimary: e.target.checked }))}
                          color="primary"
                        />
                      }
                      label={<Typography variant="body2" fontWeight={600} color="text.primary">Designate as Primary Contact</Typography>}
                      sx={{ mt: 3, ml: 0.5 }}
                    />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column: Status & Media */}
        <Grid item xs={12} md={4}>
           <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Enrollment Status</Typography>
                  <SearchableSelect
                    label="Current Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: 'Active', label: 'Active Enrollment' },
                        { value: 'Inactive', label: 'Inactive / On Hold' },
                    ]}
                  />
                  <Box sx={{ mt: 2, p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                      <Typography variant="caption" color="info.main" fontWeight={600}>
                          {isEdit 
                            ? "Updating enrollment status will reflect in attendance and teacher lists." 
                            : "New students will be set to 'Active' status by default upon enrollment."}
                      </Typography>
                  </Box>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Profile Photo</Typography>
                  <Box
                    sx={{
                        width: '100%',
                        height: 200,
                        border: `2px dashed ${theme.palette.divider}`,
                        borderRadius: 3,
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
                    <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Drop or click to upload
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        JPG, PNG up to 2MB
                    </Typography>
                  </Box>
              </Paper>

              {!isEdit && (
                  <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${theme.palette.success.main}`, bgcolor: alpha(theme.palette.success.main, 0.02), boxShadow: 'none' }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: 'success.main' }}>Parent Onboarding</Typography>
                      <Typography variant="caption" color="text.secondary">
                          A welcome email with login credentials will be sent to <strong>{formData.parentEmail || 'the parent'}</strong> immediately after enrollment.
                      </Typography>
                  </Paper>
              )}
           </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentFormPage;
