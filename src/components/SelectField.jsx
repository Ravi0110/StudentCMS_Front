import {
  FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Box,
} from '@mui/material';

/**
 * Reusable select field component.
 *
 * @param {Object} props
 * @param {Array}  props.options - [{ value, label }]
 */
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'small',
  placeholder,
  sx = {},
  ...rest
}) => (
  <Box sx={{ mb: 2, ...sx }}>
    <FormControl
      fullWidth={fullWidth}
      size={size}
      error={!!error}
      required={required}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        {...rest}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  </Box>
);

export default SelectField;
