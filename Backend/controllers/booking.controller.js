import Booking from "../models/booking.model.js";
import Vehicle from "../models/vehicle.model.js";

// =========================
// ✅ Book a Vehicle (Customer Only)
// =========================
export const createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ message: "Vehicle not found", success: false });
    }

    const start = new Date(startTime);
    const durationHours =
      Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

    const conflict = await Booking.findOne({
      vehicleId,
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      return res.status(409).json({
        message: "Vehicle already booked in this time window",
        success: false,
      });
    }

    const booking = await Booking.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId: req.id,
    });

    return res.status(201).json({
      message: "Booking successful",
      booking,
      success: true,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
