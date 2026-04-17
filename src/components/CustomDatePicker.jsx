import DatePicker from "react-datepicker";
import { Box, Typography, alpha, useTheme } from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";
import { forwardRef } from "react";

/**
 * A highly customizable date picker component powered by react-datepicker.
 * 
 * @param {Object} props
 * @param {string} props.label - Label for the input
 * @param {string} props.name - Controlled component name
 * @param {any} props.selected - Selected date
 * @param {Function} props.onChange - Callback (date) => void
 * @param {string} props.error - Error message
 * @param {string} props.placeholder - Placeholder text
 */
const CustomDatePicker = ({
  label,
  name,
  selected,
  onChange,
  error,
  placeholder = "Select date...",
  ...rest
}) => {
  const theme = useTheme();

  // Custom input component to style it like MUI but using standard input
  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Box
      onClick={onClick}
      ref={ref}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 14px',
        borderRadius: `${theme.shape.borderRadius}px`,
        border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
        bgcolor: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
        },
        '&:focus-within': {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ flex: 1, color: value ? 'text.primary' : 'text.disabled', fontWeight: value ? 500 : 400 }}
      >
        {value || placeholder}
      </Typography>
      <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary', ml: 1 }} />
    </Box>
  ));

  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography 
          variant="caption" 
          fontWeight={700} 
          sx={{ ml: 0.5, mb: 1, color: 'text.secondary', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {label}
        </Typography>
      )}
      <DatePicker
        selected={selected}
        onChange={(date) => {
            // Match the (e) => void pattern if needed, but for simplicity we'll handle it in the parent or wrap it here
            onChange(date);
        }}
        customInput={<CustomInput />}
        dateFormat="dd MMM yyyy"
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

export default CustomDatePicker;
