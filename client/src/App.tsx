import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./pages/not-found";
import RegisterPage from "./pages/register";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import DashboardLayout from "./layout/dashboard-layout";
import LocationsPage from "./pages/locations";
import NewLocationPage from "./pages/locations/new";
import LocationDetailsPage from "./pages/locations/details";
import AuthLayout from "./layout/auth-layout";
import ProtectedRoute from "./components/auth/protected-route";
import PublicRoute from "./components/auth/public-route";

export default function App() {
  return (
    <Routes>
      <Route path="auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="locations">
          <Route index element={<LocationsPage />} />
          <Route path=":id" element={<LocationDetailsPage />} />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="locations">
          <Route path="new" element={<NewLocationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}