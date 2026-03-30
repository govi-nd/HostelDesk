import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./components/landing";
import DashBoard from "./components/dashborad";
import DashBoardAdmin from "./components/dashboradAdmin";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const redirectTo =
    role === "warden" ? "/dashboard/warden" : "/dashboard/student";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to={redirectTo} replace /> : <Landing />
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/warden"
          element={
            <ProtectedRoute>
              <DashBoardAdmin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default App;
