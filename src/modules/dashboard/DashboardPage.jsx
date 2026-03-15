import {
  Box, Grid, Card, CardContent, Typography,
  Chip, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Button, useTheme, alpha, Skeleton,
} from '@mui/material';
import {
  People as StudentsIcon,
  Person as TeacherIcon,
  FactCheck as AttendanceIcon,
  Assignment as HomeworkIcon,
  Event as EventIcon,
  Campaign as AnnouncementIcon,
  TrendingUp, ArrowForward,
  Science, EmojiEvents, Groups,
} from '@mui/icons-material';
import { PageHeader } from '../../components';

// ─── Mock data (replace with API calls) ────────────────────────
const stats = [
  {
    title: 'Total Students',
    value: '1,245',
    subtitle: '+12 new this month',
    icon: StudentsIcon,
    color: '#2563eb',
    bgColor: '#eef2ff',
  },
  {
    title: 'Total Teachers',
    value: '84',
    subtitle: 'All positions filled',
    icon: TeacherIcon,
    color: '#7c3aed',
    bgColor: '#f3e8ff',
  },
  {
    title: "Today's Attendance",
    value: '96.4%',
    subtitle: '+1.2% from yesterday',
    icon: AttendanceIcon,
    color: '#10b981',
    bgColor: '#ecfdf5',
  },
  {
    title: 'Homework Summary',
    value: '24',
    subtitle: 'Active assignments today',
    icon: HomeworkIcon,
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Science Fair 2025',
    location: 'Main Auditorium • All Classes',
    date: 'Tomorrow, 09:00 AM',
    icon: Science,
    tag: 'UPCOMING',
  },
  {
    id: 2,
    title: 'Annual Sports Day',
    location: 'School Ground • Parents Invited',
    date: 'Oct 15, 08:30 AM',
    icon: EmojiEvents,
    tag: 'UPCOMING',
  },
  {
    id: 3,
    title: 'Parent-Teacher Meeting',
    location: 'Respective Classrooms • Grade 10',
    date: 'Oct 18, 10:00 AM',
    icon: Groups,
    tag: 'UPCOMING',
  },
];

const recentAnnouncements = [
  {
    id: 1,
    title: 'Winter Break Schedule Update',
    description: 'Important update regarding the winter vacation dates for all grades.',
    time: '2 hours ago',
    tag: 'NEW',
    tagColor: 'error',
  },
  {
    id: 2,
    title: 'Change in Route 4 Bus Timing',
    description: 'Due to road construction, Route 4 will be delayed by 15 minutes.',
    time: 'Yesterday',
    tag: 'GENERAL',
    tagColor: 'default',
  },
  {
    id: 3,
    title: 'Mid-Term Syllabus Published',
    description: 'The syllabus for upcoming mid-term exams is now available.',
    time: 'Oct 05',
    tag: 'ACADEMIC',
    tagColor: 'primary',
  },
];

// ─── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ stat }) => {
  const theme = useTheme();
  const Icon = stat.icon;

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(stat.color, 0.15)}`,
        },
      }}
    >
      <CardContent sx={{ p: '20px 24px !important' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
          >
            {stat.title}
          </Typography>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2.5,
              backgroundColor: stat.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: stat.color, fontSize: 22 }} />
          </Box>
        </Box>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mt: 1.5, mb: 0.5, letterSpacing: '-0.02em' }}
        >
          {stat.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {stat.subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

// ─── Dashboard Page ─────────────────────────────────────────────
const DashboardPage = () => {
  const theme = useTheme();

  return (
    <Box>
      <PageHeader
        title="Overview Dashboard"
        subtitle="Welcome back! Here's what's happening in your school today."
      />

      {/* ── Stats Row ─────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <StatCard stat={stat} />
          </Grid>
        ))}
      </Grid>

      {/* ── Bottom Row ────────────────────────────────────── */}
      <Grid container spacing={2.5}>
        {/* Upcoming Events */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h5" fontWeight={600}>
                  Upcoming Events
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward sx={{ fontSize: '16px !important' }} />}
                  sx={{ fontWeight: 600 }}
                >
                  View Calendar
                </Button>
              </Box>
              <List disablePadding>
                {upcomingEvents.map((evt, i) => {
                  const EvtIcon = evt.icon;
                  return (
                    <ListItem
                      key={evt.id}
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom:
                          i < upcomingEvents.length - 1
                            ? `1px solid ${theme.palette.divider}`
                            : 'none',
                        alignItems: 'flex-start',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            width: 44,
                            height: 44,
                          }}
                        >
                          <EvtIcon sx={{ fontSize: 22 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={600}>
                            {evt.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {evt.location}
                          </Typography>
                        }
                      />
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          {evt.date}
                        </Typography>
                        <br />
                        <Chip
                          label={evt.tag}
                          size="small"
                          sx={{
                            mt: 0.5,
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Announcements */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h5" fontWeight={600}>
                  Recent Announcements
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForward sx={{ fontSize: '16px !important' }} />}
                  sx={{ fontWeight: 600 }}
                >
                  View All
                </Button>
              </Box>
              <List disablePadding>
                {recentAnnouncements.map((ann, i) => (
                  <ListItem
                    key={ann.id}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom:
                        i < recentAnnouncements.length - 1
                          ? `1px solid ${theme.palette.divider}`
                          : 'none',
                      alignItems: 'flex-start',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor:
                            ann.tagColor === 'error'
                              ? alpha(theme.palette.error.main, 0.08)
                              : alpha(theme.palette.primary.main, 0.08),
                          color:
                            ann.tagColor === 'error'
                              ? theme.palette.error.main
                              : theme.palette.primary.main,
                          width: 44,
                          height: 44,
                        }}
                      >
                        <AnnouncementIcon sx={{ fontSize: 22 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={600}>
                          {ann.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {ann.description}
                        </Typography>
                      }
                    />
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        {ann.time}
                      </Typography>
                      <br />
                      <Chip
                        label={ann.tag}
                        size="small"
                        color={ann.tagColor === 'default' ? 'default' : ann.tagColor}
                        sx={{
                          mt: 0.5,
                          height: 22,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
