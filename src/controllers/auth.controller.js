
import User from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { setAuthCookie } from "../utils/cookies.js";
import { generateToken } from "../utils/generateToken.js";
import { validateSignUpData } from "../utils/validation.js";
import bcrypt from 'bcryptjs';

export const registerUser = asyncHandler(async (req, res) => {
  // 1️⃣ Validate request body
  // validateSignUpData(req);

  const { firstName, lastName, emailId, password } = req.body;

  // 2️⃣ Check if user already exists
  const existingUser = await User.findOne({ emailId });
  if (existingUser) {
    throw new ApiError(409, 'User already exists with this email');
  }

  // 3️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4️⃣ Create user
  const user = await User.create({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });

  // 5️⃣ Generate token & set cookie
  const token = generateToken(user._id);
  setAuthCookie(res, token);

  // 6️⃣ Remove sensitive fields
  user.password = undefined;

  // 7️⃣ Send response
  return new ApiResponse(201, { user }, 'User registered successfully').send(
    res
  );
});


export const loginUser = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;

  // 1️⃣ Validate input
  if (!emailId || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // 2️⃣ Check if user exists
  const user = await User.findOne({ emailId });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3️⃣ Verify password
  const isPasswordValid = user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 4️⃣ Generate token & set cookie
  const token = generateToken(user._id);
  setAuthCookie(res, token);

  // 5️⃣ Remove sensitive data
  user.password = undefined;

  // 6️⃣ Send response
  return new ApiResponse(200, { user }, 'Login successful').send(res);
});
