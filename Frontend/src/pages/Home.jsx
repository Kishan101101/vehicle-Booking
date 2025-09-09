import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Light blur animation in background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-2xl opacity-20 pointer-events-none" />

      <div className="max-w-2xl w-full text-center z-10 bg-white/10 backdrop-blur-lg p-10 rounded-2xl border border-white/20 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to FleetLink 🚚
        </h1>

        <p className="text-white/80 mb-6 text-lg">
          {user
            ? `Hi ${user.fullname}, manage or book vehicles seamlessly.`
            : "Book reliable transport vehicles or manage your fleet with ease."}
        </p>

        <div className="flex justify-center flex-wrap gap-4">
          {!user ? (
            <>
              <Link to="/login">
                <Button variant="default" className="text-white px-6">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  className="text-white border-white/30"
                >
                  Register
                </Button>
              </Link>
            </>
          ) : user.role === "customer" ? (
            <>
              <Link to="/customer/search">
                <Button variant="default" className="text-white px-6">
                  Search Vehicles
                </Button>
              </Link>
              <Link to="/customer/bookings">
                <Button
                  variant="outline"
                  className="text-white border-white/30"
                >
                  My Bookings
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/owner/add-vehicle">
                <Button variant="default" className="text-white px-6">
                  Add Vehicle
                </Button>
              </Link>
              <Link to="/owner/my-vehicles">
                <Button
                  variant="outline"
                  className="text-white border-white/30"
                >
                  My Vehicles
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
