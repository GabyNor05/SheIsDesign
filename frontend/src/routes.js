import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/common/RootLayout";
// Public pages
import HomePage from "./pages/public/HomePage";
import EventsPage from "./pages/public/EventsPage";
import GalleryPage from "./pages/public/GalleryPage";
import LeaderboardPage from "./pages/public/LeaderboardPage";
import DonatePage from "./pages/public/DonatePage";
import VolunteerPage from "./pages/public/VolunteerPage";
// Auth pages
import AuthPage from "./pages/auth/AuthPage/AuthPage";
import SignupDetailsPage from "./pages/auth/SignupDetailsPage/SignupDetailsPage";
import SignupSuccessPage from "./pages/auth/SignupSuccessPage/SignupSuccessPage";
import ApplicationStatusPage from "./pages/auth/ApplicationStatusPage/ApplicationStatusPage";
// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";


//Judge pages
import JudgeDashboard from "./pages/judge/JudgeDashboard";
import JudgeEvents from "./pages/judge/JudgeEvents";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Public
      { index: true, element: <HomePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "gallery", element: <GalleryPage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "donate", element: <DonatePage /> },
      { path: "volunteer", element: <VolunteerPage /> },

      // Auth — single page, slider toggles login/signup
      // /auth             → defaults to login
      // /auth?mode=signup → opens signup tab
      // /login and /signup kept as redirects so old links still work
      { path: "auth", element: <AuthPage /> },
      { path: "login", element: <AuthPage /> },
      { path: "signup", element: <AuthPage /> },

      // Post-signup flow (unchanged)
      { path: "signup/details", element: <SignupDetailsPage /> },
      { path: "signup/success", element: <SignupSuccessPage /> },
      { path: "application-status", element: <ApplicationStatusPage /> },
      { path: "admin", element: <AdminDashboard /> },
      { path: "judge", element: <JudgeDashboard /> },
    ],
  },
]);

export default router;
