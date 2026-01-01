
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


export const loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;

        // check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // return success message
         const token = generateToken(user._id)
         user.password = undefined;

         return res.status(200).json({message: 'Login successful', token, user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}
