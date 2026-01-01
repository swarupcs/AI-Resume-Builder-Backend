import Resume from "../models/resume.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createResume = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { title } = req.body;

  // 1️⃣ Ensure user is authenticated
  if (!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  // 2️⃣ Validate input
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Resume title is required');
  }

  // 3️⃣ Create resume
  const resume = await Resume.create({
    userId,
    title: title.trim(),
  });

  // 4️⃣ Send response
  return new ApiResponse(201, { resume }, 'Resume created successfully').send(
    res
  );
});
