import { createHashRouter } from "react-router-dom";
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
import AdminDashboardV2 from "./pages/admin/template/AdminDashboardV2";
import ManageEvents from "./pages/admin/template/Events";
import ManageParticipantsPage from "./pages/admin/ManageParticipantsPage";
import ManageLeaderboardPage from "./pages/admin//ManageLeaderboardPage";
import ManageDonations from "./pages/admin/ManageDonationsPage";
import ManageGallery from "./pages/admin/ManageGalleryPage";
import ManageActivityPage from "./pages/admin/ManageActivityPage";

// Judge pages
import JudgeDashboard from "./pages/judge/JudgeDashboard";
import JudgeScoringPage from "./pages/judge/JudgeScoringPage";

import NotFoundPage from "./pages/public/NotFoundPage";

const Routes = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
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

      // ── New admin — all share the sidebar via AdminLayout ──────────────────
      {
        path: "admin",
        element: <RoleProtectedRoute role="admin"><AdminLayout /></RoleProtectedRoute>,
        children: [
          { index: true, element: <AdminDashboardV2 /> },
          { path: "events", element: <ManageEvents /> },
          { path: "participants", element: <ManageParticipantsPage /> },
          { path: "leaderboard", element: <ManageLeaderboardPage /> },
          { path: "gallery", element: <ManageGallery /> },
          { path: "donations", element: <ManageDonations /> },
          { path: "activity", element: <ManageActivityPage /> },
        ],
      },

      // ── Judge ─────────────────────────────────────────────────────────────
      { path: "judge", element: <RoleProtectedRoute role="judge"><JudgeDashboard /></RoleProtectedRoute> },
      { path: "judge/score/:eventId", element: <RoleProtectedRoute role="judge"><JudgeScoringPage /></RoleProtectedRoute> },

      // ── 404 catch-all ─────────────────────────────────────────────────────
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default Routes;
