import axiosInstance from "./axiosInstance";

// Get user from backend (if session cookie exists)
export async function getCurrentUser() {
  try {
    const res = await axiosInstance.get("/users/me");
    return res.data.user;
  } catch (error) {
    console.error("Failed to fetch current user", error);
    return null;
  }
}

// Check if user object exists in Redux
export function isAuthenticated(user) {
  return !!user;
}
