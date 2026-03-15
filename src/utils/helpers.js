// ─── Utility helpers ────────────────────────────────────────────

/**
 * Get initials from a full name.
 * @param {string} name - e.g. "Robert Fox"
 * @returns {string} e.g. "RF"
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

/**
 * Format a date string for display.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  const defaults = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(
    new Date(date)
  );
};

/**
 * Format a number for display (e.g. 1245 → "1,245").
 */
export const formatNumber = (num) => {
  if (num == null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Capitalise the first letter of a string.
 */
export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Truncate text to a given length.
 */
export const truncate = (str = '', maxLen = 100) =>
  str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;

/**
 * Resolve an icon name string (from backend) to an MUI icon component key.
 */
export const resolveIconName = (iconName) => {
  const map = {
    dashboard: 'Dashboard',
    school: 'School',
    person: 'Person',
    people: 'People',
    class: 'Class',
    book: 'MenuBook',
    assignment: 'Assignment',
    event: 'Event',
    calendar: 'CalendarToday',
    announcement: 'Campaign',
    campaign: 'Campaign',
    schedule: 'Schedule',
    attendance: 'FactCheck',
    homework: 'Assignment',
    timetable: 'Schedule',
    settings: 'Settings',
    admin: 'AdminPanelSettings',
    users: 'Group',
    sections: 'Layers',
    layers: 'Layers',
    classes: 'Class',
  };
  return map[iconName?.toLowerCase()] || 'Circle';
};
