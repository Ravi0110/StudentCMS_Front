import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import ProtectedRoute from './ProtectedRoute';

// ── Pages (lazy-friendly imports) ────────────────────────────────
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import DashboardPage from '../modules/dashboard/DashboardPage';
import StudentsPage from '../modules/students/StudentsPage';
import TeachersPage from '../modules/teachers/TeachersPage';
import ClassesPage from '../modules/classes/ClassesPage';
import SectionsPage from '../modules/sections/SectionsPage';
import HomeworkPage from '../modules/homework/HomeworkPage';
import AnnouncementsPage from '../modules/announcements/AnnouncementsPage';
import AttendancePage from '../modules/attendance/AttendancePage';
import TimetablePage from '../modules/timetable/TimetablePage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'teachers', element: <TeachersPage /> },
      { path: 'classes', element: <ClassesPage /> },
      { path: 'sections', element: <SectionsPage /> },
      { path: 'homework', element: <HomeworkPage /> },
      { path: 'announcements', element: <AnnouncementsPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'timetable', element: <TimetablePage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
