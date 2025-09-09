import express from "express";
import { createBooking } from "../controllers/booking.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Customer books a vehicle
router.post(
  "/create",
  isAuthenticated,
  authorizeRoles("customer"),
  createBooking
);
router.get(
  "/me",
  isAuthenticated,
  authorizeRoles("customer"),
  async (req, res) => {
    try {
      const bookings = await Booking.find({ customerId: req.id }).populate(
        "vehicleId"
      );
      res.status(200).json({ bookings, success: true });
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res
        .status(500)
        .json({ message: "Failed to get bookings", success: false });
    }
  }
);
export default router;
