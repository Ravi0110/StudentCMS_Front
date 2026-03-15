import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

/**
 * Reusable search bar.
 */
const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search students, teachers, classes…',
  fullWidth = true,
  size = 'small',
  sx = {},
  ...rest
}) => (
  <TextField
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    fullWidth={fullWidth}
    size={size}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        backgroundColor: 'background.paper',
      },
      ...sx,
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        </InputAdornment>
      ),
    }}
    {...rest}
  />
);

export default SearchBar;
