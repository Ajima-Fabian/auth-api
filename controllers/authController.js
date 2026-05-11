import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import generateTokens from '../utils/generateTokens.js';
import setRefreshTokenCookie from '../utils/setCookie.js';

// ---------------------------------------------------
// Register new user
// ---------------------------------------------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate request fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    // Enforce minimum password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Hash refresh token before storing
    const salt = await bcrypt.genSalt(10);

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      salt
    );

    // Save hashed refresh token
    user.refreshTokens.push(hashedRefreshToken);

    await user.save();

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // Send response
    const safeUser = {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
};

return res.status(200).json({
  message: 'Email created successfully',
  user: safeUser,
  accessToken,
});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ---------------------------------------------------
// Login user
// ---------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user including hidden fields
    const user = await User.findOne({ email }).select(
      '+password +refreshTokens'
    );

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Compare password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Hash refresh token
    const salt = await bcrypt.genSalt(10);

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      salt
    );

    // Store hashed token
    user.refreshTokens.push(hashedRefreshToken);

    await user.save();

    // Set secure cookie
    setRefreshTokenCookie(res, refreshToken);

    const safeUser = {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
};

return res.status(200).json({
  message: 'Login successful',
  user: safeUser,
  accessToken,
});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ---------------------------------------------------
// Refresh access token
// ---------------------------------------------------
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    // Check cookie existence
    if (!token) {
      return res.status(401).json({
        message: 'Refresh token missing',
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    // Find user with refresh tokens
    const user = await User.findById(decoded.id).select(
      '+refreshTokens'
    );

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    // Validate refresh token
    let validToken = false;

    for (const storedHash of user.refreshTokens) {
      const isMatch = await bcrypt.compare(
        token,
        storedHash
      );

      if (isMatch) {
        validToken = true;

        // Remove used refresh token
        user.refreshTokens = user.refreshTokens.filter(
          (hash) => hash !== storedHash
        );

        break;
      }
    }

    // Possible token theft
    if (!validToken) {
      user.refreshTokens = [];

      await user.save();

      return res.status(403).json({
        message: 'Invalid refresh token',
      });
    }

    // Generate new token pair
    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = generateTokens(user._id);

    // Hash new refresh token
    const salt = await bcrypt.genSalt(10);

    const hashedNewRefreshToken = await bcrypt.hash(
      newRefreshToken,
      salt
    );

    // Store rotated refresh token
    user.refreshTokens.push(hashedNewRefreshToken);

    await user.save();

    // Replace refresh cookie
    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      accessToken,
    });
  } catch (err) {
    res.status(403).json({
      message: 'Invalid or expired refresh token',
    });
  }
};

// ---------------------------------------------------
// Logout user
// ---------------------------------------------------
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      '+refreshTokens'
    );

    // Remove all refresh tokens
    user.refreshTokens = [];

    await user.save();

    // Clear cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ---------------------------------------------------
// Current authenticated user
// ---------------------------------------------------
export const profile = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

// ---------------------------------------------------
// Admin-only route
// ---------------------------------------------------
export const adminRoute = async (req, res) => {
  res.status(200).json({
    message: 'Welcome admin',
    user: req.user,
  });
};