import Select from 'react-select';
import { Box, Typography, useTheme, alpha } from '@mui/material';

/**
 * A highly customizable select component powered by react-select.
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the input
 * @param {string} props.name - Controlled component name
 * @param {any} props.value - Selected value (primitive)
 * @param {Function} props.onChange - Callback (e) => void
 * @param {Array} props.options - Array of { value, label }
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.fullWidth - Default true
 */
const SearchableSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = "Select...",
  fullWidth = true,
  isLoading = false,
  sx = {},
  ...rest
}) => {
  const theme = useTheme();

  // Find the current option object based on the primitive value
  const selectedOption = options.find((opt) => opt.value === (value?._id || value)) || null;

  const handleChange = (selected) => {
    const mockEvent = {
      target: {
        name,
        value: selected ? selected.value : '',
      },
    };
    onChange(mockEvent);
  };

  // Custom styles for react-select to match MUI premium look
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: `${theme.shape.borderRadius}px`,
      borderColor: error ? theme.palette.error.main : state.isFocused ? theme.palette.primary.main : theme.palette.divider,
      boxShadow: state.isFocused ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
      padding: '2px 4px',
      fontSize: '0.875rem',
      backgroundColor: '#fff',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: theme.palette.text.disabled,
    }),
    singleValue: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      fontWeight: 500,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: `${theme.shape.borderRadius + 2}px`,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      padding: '4px',
      zIndex: 1000,
      border: `1px solid ${theme.palette.divider}`,
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: `${theme.shape.borderRadius - 2}px`,
      fontSize: '0.875rem',
      backgroundColor: state.isSelected ? theme.palette.primary.main : state.isFocused ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
      color: state.isSelected ? '#fff' : theme.palette.text.primary,
      fontWeight: state.isSelected ? 600 : 400,
      cursor: 'pointer',
      padding: '10px 12px',
      transition: 'all 0.2s ease',
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: theme.palette.text.secondary,
    }),
    indicatorSeparator: () => ({
        display: 'none',
    })
  };

  return (
    <Box sx={{ mb: 2, width: fullWidth ? '100%' : 'auto', ...sx }}>
      {label && (
        <Typography 
          variant="caption" 
          fontWeight={700} 
          sx={{ ml: 0.5, mb: 1, color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {label}
        </Typography>
      )}
      <Select
        name={name}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        styles={customStyles}
        isLoading={isLoading}
        isClearable
        {...rest}
      />
      {error && (
        <Typography variant="caption" color="error.main" sx={{ mt: 0.5, ml: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default SearchableSelect;
