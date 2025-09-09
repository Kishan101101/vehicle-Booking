import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    capacityKg: {
      type: Number,
      required: true,
    },
    tyres: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // store image URL or local path
      default: "",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // refers to the owner
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
