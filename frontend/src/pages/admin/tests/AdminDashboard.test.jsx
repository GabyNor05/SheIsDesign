import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../AdminDashboard";

// 1. Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// 2. Mock sub-components to isolate the AdminDashboard container logic
jest.mock("../../../components/common/Sidebar", () => {
  return function MockSidebar({ activeTab, setActiveTab }) {
    return (
      <div data-testid="mock-sidebar">
        <span>Active: {activeTab}</span>
        <button onClick={() => setActiveTab("Events")}>Switch to Events</button>
      </div>
    );
  };
});

jest.mock("../Overview", () => () => <div data-testid="overview-content">Overview Component</div>);
jest.mock("../ManageEvents", () => () => <div data-testid="events-content">Events Component</div>);
jest.mock("../Leaderboard", () => () => <div data-testid="leaderboard-content">Leaderboard Component</div>);

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Verifies initial rendering and default state behavior
  test("renders Overview component by default and displays correct breadcrumb", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Assert that the breadcrumb text reflects default "Dashboard" tab
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // Assert that the default Overview component content is visible
    expect(screen.getByTestId("overview-content")).toBeInTheDocument();
  });

  // Test 2: Verifies tab switching updates the main content area using user-event
  test("changes content area when sidebar updates the active tab", async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Click the simulated sidebar button to switch tabs
    const switchTabButton = screen.getByRole("button", { name: /switch to events/i });
    await user.click(switchTabButton);

    // Verify view updates to the Events component and breadcrumb updates
    expect(screen.getByTestId("events-content")).toBeInTheDocument();
    expect(screen.queryByTestId("overview-content")).not.toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
  });

  // Test 3: Verifies routing interaction
  test("navigates back to home page when clicking the Home breadcrumb button", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Find and click the Home button in the breadcrumbs
    const homeButton = screen.getByRole("button", { name: /home/i });
    await user.click(homeButton);

    // Verify navigate function was triggered with the correct root route
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});