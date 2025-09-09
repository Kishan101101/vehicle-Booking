import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

//API ROUTES

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

// Start server
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
  }
});
