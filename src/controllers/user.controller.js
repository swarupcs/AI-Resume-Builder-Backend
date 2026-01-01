import Resume from "../models/resume.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.userId;

  // 1️⃣ Validate userId presence (auth middleware responsibility)
  if (!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  // 2️⃣ Find user
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // 3️⃣ Send response
  return new ApiResponse(200, { user }, 'User fetched successfully').send(res);
});


export const getUserResumes = asyncHandler(async (req, res) => {
  const userId = req.userId;

  // 1️⃣ Ensure user is authenticated
  if (!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  // 2️⃣ Fetch resumes belonging to the user
  const resumes = await Resume.find({ userId });

  // 3️⃣ Send response
  return new ApiResponse(
    200,
    { resumes },
    'User resumes fetched successfully'
  ).send(res);
});