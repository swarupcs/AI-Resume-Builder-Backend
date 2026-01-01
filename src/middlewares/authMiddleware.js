import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';


/**
 * Middleware to authenticate user using JWT token stored in cookies
 */
export const authMiddleware = asyncHandler(async (req, res, next) => {
  // 1️⃣ Get token from cookies
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, 'Please login first');
  }

  // 2️⃣ Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  // 3️⃣ Check if user still exists
  const user = await User.findById(decoded.userId).select('_id');
  if (!user) {
    throw new ApiError(401, 'User no longer exists');
  }

  // 4️⃣ Attach userId to request (IMPORTANT)
  req.userId = user._id;

  next();
});

