import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import { getCurrentUser } from "./utils/authUtils";

import RoleGuard from "./components/common/RoleGaurd";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AddVehicle from "./pages/owner/AddVehicle";
import SearchVehicle from "./pages/customer/SearchVehicle";
import MyBookings from "./pages/customer/MyBookings";
import MyVehicles from "./pages/owner/MyVehicles";
import Navbar from "./layouts/Navbar";
import Home from "./pages/Home";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUser();
      if (user) {
        dispatch(setUser(user));
      }
    }

    fetchUser();
  }, [dispatch]);

  return (
    <Router>
      <div
        // className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/vehicle.jpg')" }}
      >
        {/* Optional: darken background with overlay blur */}
        <div className="min-h-screen backdrop-blur-sm bg-black/50">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes for Owner */}
            <Route
              path="/owner/add-vehicle"
              element={
                <RoleGuard allowedRoles={["owner"]}>
                  <AddVehicle />
                </RoleGuard>
              }
            />
            <Route
              path="/owner/my-vehicles"
              element={
                <RoleGuard allowedRoles={["owner"]}>
                  <MyVehicles />
                </RoleGuard>
              }
            />

            {/* Protected routes for Customer */}
            <Route
              path="/customer/search"
              element={
                <RoleGuard allowedRoles={["customer"]}>
                  <SearchVehicle />
                </RoleGuard>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <RoleGuard allowedRoles={["customer"]}>
                  <MyBookings />
                </RoleGuard>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
