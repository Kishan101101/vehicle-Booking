import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import axiosInstance from "../utils/axiosInstance";
export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.get("/users/logout");
      dispatch(logoutUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-md border-b border-white/10 shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-white">
        <Link to="/" className="text-xl font-bold tracking-tight">
          FleetLink
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            {user.role === "owner" && (
              <>
                <Link to="/owner/add-vehicle" className="hover:underline">
                  Add Vehicle
                </Link>
                <Link to="/owner/my-vehicles" className="hover:underline">
                  My Vehicles
                </Link>
              </>
            )}

            {user.role === "customer" && (
              <>
                <Link to="/customer/search" className="hover:underline">
                  Search
                </Link>
                <Link to="/customer/bookings" className="hover:underline">
                  My Bookings
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
