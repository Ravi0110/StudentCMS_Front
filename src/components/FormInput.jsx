import { TextField, FormHelperText, Box } from '@mui/material';

/**
 * Reusable form input wrapping MUI TextField.
 */
const FormInput = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  fullWidth = true,
  size = 'small',
  InputProps,
  sx = {},
  ...rest
}) => (
  <Box sx={{ mb: 2, ...sx }}>
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      fullWidth={fullWidth}
      size={size}
      InputProps={InputProps}
      {...rest}
    />
  </Box>
);

export default FormInput;
