import express from "express";
import {
  addVehicle,
  getAvailableVehicles,
} from "../controllers/vehicle.controller.js";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middlewares/isAuthenticated.js";
import { SingleUpload } from "../middlewares/multer.js";
import Vehicle from "../models/vehicle.model.js";
const router = express.Router();

// Owner adds a vehicle
router.post(
  "/add",
  isAuthenticated,
  authorizeRoles("owner"),
  SingleUpload,
  addVehicle
);

// Customer or anyone gets available vehicles
router.get("/available", getAvailableVehicles);

router.get(
  "/mine",
  isAuthenticated,
  authorizeRoles("owner"),
  async (req, res) => {
    try {
      const vehicles = await Vehicle.find({ addedBy: req.id }).sort({
        createdAt: -1,
      });
      res.status(200).json({ vehicles, success: true });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to get vehicles", success: false });
    }
  }
);

export default router;
