import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import * as UserModel from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // attach user basic info using model
    const user = await UserModel.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token", error: err.message });
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};
