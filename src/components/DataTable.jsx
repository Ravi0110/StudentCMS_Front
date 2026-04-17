import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper,
  Box, Typography, Checkbox, IconButton, Tooltip,
  TextField, InputAdornment, Skeleton, useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useState } from 'react';

/**
 * Reusable data-table component.
 *
 * @param {Object} props
 * @param {Array}  props.columns      - [{ id, label, minWidth?, align?, render? }]
 * @param {Array}  props.rows         - data rows
 * @param {number} props.totalCount   - total for pagination
 * @param {number} props.page         - current 0-based page
 * @param {number} props.rowsPerPage
 * @param {Function} props.onPageChange
 * @param {Function} props.onRowsPerPageChange
 * @param {boolean}  props.selectable
 * @param {Array}    props.selected
 * @param {Function} props.onSelect
 * @param {boolean}  props.loading
 * @param {string}   props.searchValue
 * @param {Function} props.onSearchChange
 * @param {React.ReactNode} props.actions - header actions slot
 */
const DataTable = ({
  columns = [],
  rows = [],
  totalCount,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  selectable = false,
  selected = [],
  onSelect,
  loading = false,
  searchValue,
  onSearchChange,
  onRowClick,
  actions,
  stickyHeader = true,
}) => {
  const theme = useTheme();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelect?.(rows.map((r) => r._id || r.id));
    } else {
      onSelect?.([]);
    }
  };

  const handleSelectRow = (id) => {
    const idx = selected.indexOf(id);
    const next = idx === -1 ? [...selected, id] : selected.filter((s) => s !== id);
    onSelect?.(next);
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      {/* ── Toolbar ──────────────────────────────────────────── */}
      {(onSearchChange || actions) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            gap: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {onSearchChange && (
            <TextField
              size="small"
              placeholder="Search…"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{ maxWidth: 320 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
          )}
          {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
        </Box>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader={stickyHeader} size="medium">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAll}
                    size="small"
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{ minWidth: col.minWidth }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={`skel-${i}`}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={18} height={18} />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center" sx={{ py: 8 }}>
                  <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body1" fontWeight={600}>
                      No data found
                    </Typography>
                    <Typography variant="body2">
                      Try adjusting your search or filters.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const id = row._id || row.id;
                const isSelected = selected.includes(id);
                return (
                  <TableRow
                    hover
                    key={id}
                    selected={isSelected}
                    onClick={() => onRowClick?.(row)}
                    sx={{ cursor: (selectable || onRowClick) ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectRow(id)}
                          size="small"
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.id} align={col.align || 'left'}>
                        {col.render ? col.render(row[col.id], row) : row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Pagination ───────────────────────────────────────── */}
      {onPageChange && (
        <TablePagination
          component="div"
          count={totalCount ?? rows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => onPageChange(p)}
          onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
};

export default DataTable;
