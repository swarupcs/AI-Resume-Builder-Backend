import imagekit from "../config/imageKit.js";
import Resume from "../models/resume.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import fs from 'fs';

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

export const updateResume = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { resumeId, resumeData, removeBackground } = req.body;
  const image = req.file;

  if (!resumeId) {
    throw new ApiError(400, 'Resume ID is required');
  }

  // 1️⃣ Parse resume data safely
  let resumeDataCopy;
  if (typeof resumeData === 'string') {
    resumeDataCopy = JSON.parse(resumeData);
  } else {
    resumeDataCopy = structuredClone(resumeData);
  }

  // 2️⃣ Handle image upload (optional)
  if (image) {
    const imageBufferData = fs.createReadStream(image.path);

    const response = await imagekit.files.upload({
      file: imageBufferData,
      fileName: `resume-${resumeId}.png`,
      folder: 'user-resumes',
      transformation: {
        pre:
          'w-300,h-300,fo-face,z-0.75' +
          (removeBackground ? ',e-bgremove' : ''),
      },
    });

    resumeDataCopy.personal_info = {
      ...resumeDataCopy.personal_info,
      image: response.url,
    };

    // ✅ Clean temp file
    fs.unlinkSync(image.path);
  }

  // 3️⃣ Update resume with ownership check
  const resume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId }, // 🔒 ownership enforced
    resumeDataCopy,
    { new: true }
  );

  if (!resume) {
    throw new ApiError(404, 'Resume not found or access denied');
  }

  // 4️⃣ Send response
  return new ApiResponse(200, { resume }, 'Resume saved successfully').send(
    res
  );
});

export const getResumeById = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { resumeId } = req.params;

  // 1️⃣ Validate inputs
  if (!userId) {
    throw new ApiError(401, 'Unauthorized request');
  }

  if (!resumeId) {
    throw new ApiError(400, 'Resume ID is required');
  }

  // 2️⃣ Fetch resume with ownership check
  const resume = await Resume.findOne(
    { _id: resumeId, userId },
    { __v: 0, createdAt: 0, updatedAt: 0 } // exclude fields cleanly
  );

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  // 3️⃣ Send response
  return new ApiResponse(200, { resume }, 'Resume fetched successfully').send(
    res
  );
});