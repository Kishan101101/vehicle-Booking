import Vehicle from "../models/vehicle.model.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import Booking from "../models/booking.model.js";

// =========================
// ✅ Add a Vehicle (Owner Only)
// =========================
export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;

    if (!name || !capacityKg || !tyres) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    let imageUrl = "";
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudinaryResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          resource_type: "image",
        }
      );
      imageUrl = cloudinaryResponse.secure_url;
    }

    const vehicle = await Vehicle.create({
      name,
      capacityKg,
      tyres,
      image: imageUrl,
      addedBy: req.id,
    });

    return res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
      success: true,
    });
  } catch (error) {
    console.error("Add vehicle error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// =========================
// ✅ Get Available Vehicles
// =========================
export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res
        .status(400)
        .json({ message: "Missing query parameters", success: false });
    }

    const start = new Date(startTime);
    const durationHours =
      Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
    const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

    const allMatchingVehicles = await Vehicle.find({
      capacityKg: { $gte: capacityRequired },
    });
    const bookings = await Booking.find({
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    const bookedVehicleIds = bookings.map((b) => b.vehicleId.toString());
    const availableVehicles = allMatchingVehicles.filter(
      (v) => !bookedVehicleIds.includes(v._id.toString())
    );

    return res.status(200).json({
      message: "Available vehicles retrieved successfully",
      vehicles: availableVehicles,
      estimatedRideDurationHours: durationHours,
      success: true,
    });
  } catch (error) {
    console.error("Get available vehicles error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
