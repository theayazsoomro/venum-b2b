// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const auth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({
//         status: "error",
//         message: "Authentication token is missing",
//       });
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(401).json({
//         status: "error",
//         message: "User not found",
//       });
//     }
//     req.user = user; // Attach user to request object
//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     res.status(401).json({
//       status: "error",
//       message: "Invalid authentication token",
//     });
//   }
// };

import jwt from "jsonwebtoken";
const { verify } = jwt;

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error();
    }
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};

export default auth;
