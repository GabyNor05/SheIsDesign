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
import LoginPage from "./pages/auth/LoginPage/LoginPage";
import SignupBasicPage from "./pages/auth/SignupBasicPage/SignupBasicPage";
import OtpPage from "./pages/auth/OtpPage/OtpPage";
import SignupDetailsPage from "./pages/auth/SignupDetailsPage/SignupDetailsPage";
import SignupSuccessPage from "./pages/auth/SignupSuccessPage/SignupSuccessPage";
import ApplicationStatusPage from "./pages/auth/ApplicationStatusPage/ApplicationStatusPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEventsPage from "./pages/admin/ManageEventsPage";
import ManageParticipantsPage from "./pages/admin/ManageParticipantsPage";
import ManageDonationsPage from "./pages/admin/ManageDonationsPage";
import ManageGalleryPage from "./pages/admin/ManageGalleryPage";
import ManageLeaderboardPage from "./pages/admin/ManageLeaderboardPage";

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

      // Auth
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupBasicPage /> },
      { path: "otp", element: <OtpPage /> },
      { path: "signup/details", element: <SignupDetailsPage /> },
      { path: "signup/success", element: <SignupSuccessPage /> },
      { path: "application-status", element: <ApplicationStatusPage /> },
    ],
  },
  {
    path: "/admin",
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "events", element: <ManageEventsPage /> },
      { path: "participants", element: <ManageParticipantsPage /> },
      { path: "donations", element: <ManageDonationsPage /> },
      { path: "gallery", element: <ManageGalleryPage /> },
      { path: "leaderboard", element: <ManageLeaderboardPage /> },
    ],
  },
]);

export default router;
