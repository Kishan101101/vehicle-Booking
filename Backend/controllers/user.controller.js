import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";

// =========================
// ✅ Register User
// =========================
export const register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    if (!fullname || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profile photo upload if present
    let profilePhotoUrl = "";
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudinaryResponse = await cloudinary.uploader.upload(
        fileUri.content,
        {
          resource_type: "image",
        }
      );
      profilePhotoUrl = cloudinaryResponse.secure_url;
    }

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      newUser,
      success: true,
    });
  } catch (error) {
    console.error("Error in user registration:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// =========================
// ✅ Login User
// =========================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Role mismatch", success: false });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// =========================
// ✅ Logout
// =========================
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
