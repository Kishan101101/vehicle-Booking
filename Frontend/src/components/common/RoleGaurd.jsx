import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ children, allowedRoles = [] }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="text-red-500 text-center p-6">
        ❌ Access Denied: You are not authorized to view this page.
      </div>
    );
  }

  return children;
}
