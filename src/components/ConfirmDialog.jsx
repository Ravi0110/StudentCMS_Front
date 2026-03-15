import {
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
} from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

/**
 * Reusable confirmation dialog.
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  loading = false,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontWeight: 600,
      }}
    >
      <WarningAmber color="warning" />
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText sx={{ color: 'text.secondary' }}>
        {message}
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        variant="contained"
        color={confirmColor}
        disabled={loading}
      >
        {loading ? 'Processing…' : confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
