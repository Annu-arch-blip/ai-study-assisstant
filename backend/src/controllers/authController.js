import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * @route POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, classLevel } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    // Password hashing happens automatically via the pre("save") hook in User.js
    const user = await User.create({ name, email, password, classLevel });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        classLevel: user.classLevel,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Something went wrong while creating your account" });
  }
};

/**
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // .select("+password") because the schema excludes password by default
    const user = await User.findOne({ email }).select("+password");

    // Deliberately vague error message — doesn't reveal whether the email
    // exists or the password was wrong. This is a security best practice
    // that prevents attackers from "fishing" for valid emails.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        classLevel: user.classLevel,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Something went wrong while logging in" });
  }
};

/**
 * @route GET /api/auth/me
 * Returns the currently logged-in user's profile.
 * Useful for the frontend to check "am I still logged in?" on page load.
 */
export const getMe = async (req, res) => {
  // req.user is attached by the `protect` middleware
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      classLevel: req.user.classLevel,
    },
  });
};
