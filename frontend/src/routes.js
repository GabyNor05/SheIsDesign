import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/common/RootLayout";
import AdminLayout from "./pages/admin/template/AdminLayout";
import PendingBlockedRoute from "./components/common/PendingBlockedRoute";
import AuthRequiredRoute from "./components/common/AuthRequiredRoute";
import RoleProtectedRoute from "./components/common/RoleProtectedRoute";

// Public pages
import HomePage from "./pages/public/HomePage";
import EventsPage from "./pages/public/EventsPage";
import GalleryPage from "./pages/public/GalleryPage";
import LeaderboardPage from "./pages/public/LeaderboardPage";
import DonatePage from "./pages/public/DonatePage";
import ProfilePage from "./pages/public/ProfilePage/ProfilePage";

// Auth pages
import AuthPage from "./pages/auth/AuthPage/AuthPage";
import OtpPage from "./pages/auth/OtpPage/OtpPage";
import SignupDetailsPage from "./pages/auth/SignupDetailsPage/SignupDetailsPage";
import SignupSuccessPage from "./pages/auth/SignupSuccessPage/SignupSuccessPage";
import ApplicationStatusPage from "./pages/auth/ApplicationStatusPage/ApplicationStatusPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDashboardV2 from "./pages/admin/template/AdminDashboardV2";
import ManageEvents from "./pages/admin/template/Events";
import ManageParticipantsPage from "./pages/admin/ManageParticipantsPage";
import ManageLeaderboardPage from "./pages/admin//ManageLeaderboardPage";
import ManageDonations from "./pages/admin/ManageDonationsPage";
import ManageGallery from "./pages/admin/ManageGalleryPage";

// Judge pages
import JudgeDashboard from "./pages/judge/JudgeDashboard";
import JudgeEventsPage from "./pages/judge/JudgeEventsPage";
import JudgeScoringPage from "./pages/judge/JudgeScoringPage";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // ── Public ────────────────────────────────────────────────────────────
      { index: true, element: <HomePage /> },
      { path: "events",      element: <PendingBlockedRoute><EventsPage /></PendingBlockedRoute> },
      { path: "gallery",     element: <AuthRequiredRoute><GalleryPage /></AuthRequiredRoute> },
      { path: "leaderboard", element: <PendingBlockedRoute><LeaderboardPage /></PendingBlockedRoute> },
      { path: "donate",      element: <DonatePage /> },
      { path: "profile",     element: <PendingBlockedRoute><ProfilePage /></PendingBlockedRoute> },

      // ── Auth ──────────────────────────────────────────────────────────────
      { path: "auth", element: <AuthPage /> },
      { path: "login", element: <AuthPage /> },
      { path: "signup", element: <AuthPage /> },
      { path: "signup/verify", element: <OtpPage /> },
      { path: "signup/details", element: <SignupDetailsPage /> },
      { path: "signup/success", element: <SignupSuccessPage /> },
      { path: "application-status", element: <ApplicationStatusPage /> },

      // ── Old admin dashboard (kept for reference) ───────────────────────────
      // { path: "admin", element: <AdminDashboard /> },

      // ── New admin — all share the sidebar via AdminLayout ──────────────────
      {
        path: "admin",
        element: <RoleProtectedRoute role="admin"><AdminLayout /></RoleProtectedRoute>,
        children: [
          { index: true, element: <AdminDashboardV2 /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "events", element: <ManageEvents /> },
          { path: "participants", element: <ManageParticipantsPage /> },
          { path: "leaderboard", element: <ManageLeaderboardPage /> },
          { path: "gallery", element: <ManageGallery /> },
          { path: "donations", element: <ManageDonations /> },
        ],
      },

      // ── Judge ─────────────────────────────────────────────────────────────
      { path: "judge", element: <RoleProtectedRoute role="judge"><JudgeDashboard /></RoleProtectedRoute> },
      { path: "judge/events", element: <RoleProtectedRoute role="judge"><JudgeEventsPage /></RoleProtectedRoute> },
      { path: "judge/score/:eventId", element: <RoleProtectedRoute role="judge"><JudgeScoringPage /></RoleProtectedRoute> },
    ],
  },
]);

export default Routes;
